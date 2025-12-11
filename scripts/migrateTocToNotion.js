#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import NotionService from '../src/services/notionService.js'

dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const LANGUAGE = 'sanskrit'
const LEVEL = 'Beginner'

function ensureEnv() {
  const apiKey = process.env.NOTION_API_KEY
  const dbId = process.env.NOTION_DATABASE_ID
  if (!apiKey || !dbId) {
    console.error('❌ Missing NOTION_API_KEY or NOTION_DATABASE_ID in .env.local')
    return false
  }
  return true
}

function extractTocFromLayout() {
  const layoutPath = path.join(__dirname, '..', 'src', 'app', 'layout.jsx')
  const content = fs.readFileSync(layoutPath, 'utf8')

  const startMarker = 'const tableOfContents = ['
  const startIdx = content.indexOf(startMarker)
  if (startIdx === -1) throw new Error('tableOfContents array not found in layout.jsx')

  // Find the matching closing bracket ']' followed by optional whitespace and a newline or ']' then '\n'
  // We do a simple bracket match from the first '[' after the marker
  let idx = content.indexOf('[', startIdx)
  let depth = 0
  for (; idx < content.length; idx++) {
    const ch = content[idx]
    if (ch === '[') depth++
    else if (ch === ']') {
      depth--
      if (depth === 0) {
        const arrayText = content.slice(content.indexOf('[', startIdx), idx + 1)
        return arrayText
      }
    }
  }
  throw new Error('Failed to parse tableOfContents array bounds')
}

function parseToc(arrayText) {
  // Use a sandboxed Function to evaluate the literal array
  // The content is a plain object/array literal with strings and numbers.
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(`return (${arrayText});`)
    const toc = fn()
    if (!Array.isArray(toc)) throw new Error('Parsed TOC is not an array')
    return toc
  } catch (err) {
    throw new Error(`Failed to evaluate TOC: ${err.message}`)
  }
}

function buildLessonEntries(toc) {
  const entries = []
  for (const chapter of toc) {
    const chapterNum = chapter.number
    const chapterTitle = chapter.title
    const categoryBase = `Chapter ${chapterNum}: ${chapterTitle}`
    const categorySanitized = categoryBase.replace(/,/g, ' –')
    if (Array.isArray(chapter.sections)) {
      for (const section of chapter.sections) {
        const topicTitle = section.title
        const order = chapterNum * 100 + (section.number || 0)
        const lessonId = `${LANGUAGE}/${LEVEL.toLowerCase()}/chapter-${String(chapterNum).padStart(2, '0')}/${topicTitle.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '')}`
        const title = `${LANGUAGE}/${LEVEL.toLowerCase()}/Chapter ${chapterNum}: ${chapterTitle}/${topicTitle}`
        entries.push({
          title,
          lessonId,
          level: LEVEL,
          category: categorySanitized,
          order,
        })
      }
    } else {
      // Chapter with no sections: create a single entry for the chapter itself
      const order = chapterNum * 100
      const lessonId = `${LANGUAGE}/${LEVEL.toLowerCase()}/chapter-${String(chapterNum).padStart(2, '0')}`
      const title = `${LANGUAGE}/${LEVEL.toLowerCase()}/Chapter ${chapterNum}: ${chapterTitle}`
      entries.push({ title, lessonId, level: LEVEL, category: categorySanitized, order })
    }
  }
  return entries
}

function buildIntroBlocks(entry) {
  return [
    {
      object: 'block',
      heading_2: { rich_text: [{ type: 'text', text: { content: entry.title } }] }
    },
    {
      object: 'block',
      paragraph: {
        rich_text: [
          { type: 'text', text: { content: `Language: ${LANGUAGE}` } },
          { type: 'text', text: { content: ' • ' } },
          { type: 'text', text: { content: `Level: ${entry.level}` } },
          { type: 'text', text: { content: ' • ' } },
          { type: 'text', text: { content: `Chapter/Topic: ${entry.category}` } }
        ]
      }
    }
  ]
}

async function migrate() {
  const notion = new NotionService()
  const arrayText = extractTocFromLayout()
  const toc = parseToc(arrayText)
  const entries = buildLessonEntries(toc)

  console.log(`📚 Preparing to migrate ${entries.length} TOC entries to Notion as pages`)

  if (!ensureEnv()) {
    // Dry run preview
    for (const e of entries.slice(0, 10)) {
      console.log(`📝 (dry-run) ${e.title} [${e.lessonId}]`) 
    }
    console.log('ℹ️ Set NOTION_API_KEY and NOTION_DATABASE_ID to perform actual migration.')
    process.exit(1)
  }

  const ops = entries.map(e => async () => {
    // Skip if a page with this LessonID already exists
    const existing = await notion.getLessonByID(e.lessonId)
    if (existing && existing.id) {
      return { skipped: true, id: existing.id }
    }
    const data = {
      title: e.title,
      lessonId: e.lessonId,
      category: e.category,
      level: e.level,
      status: 'Published',
      imageUrl: null,
      order: e.order,
      blocks: buildIntroBlocks(e)
    }
    return await notion.createLesson(data)
  })

  const results = await notion.batchOperation(ops, 400)
  const success = results.filter(r => r && r.id).length
  const skipped = results.filter(r => r && r.skipped).length
  console.log(`✅ Migration complete. Created ${success}/${entries.length} pages. Skipped ${skipped} existing.`)
}

migrate().catch(err => {
  console.error('❌ TOC migration failed:', err)
  process.exit(1)
})


