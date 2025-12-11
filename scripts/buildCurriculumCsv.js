// Build a fully quoted CSV for the first five modules in src/app
// Columns: Chapter Order, Chapter Title, Topic Order, Topic Title, Topic Description,
// Topic Details, Explanation, Example, Example Tips, Dialogue, Image ALT, Image Name, Image URL, Image Prompt

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const APP = path.join(ROOT, 'src', 'app')
const OUTPUT = path.join(ROOT, 'curriculum_structured.csv')

// Cloudflare R2 dashboard URL pattern provided by user
const R2_DASH_BASE = 'https://dash.cloudflare.com/9e1c4092ca4c803f08a507eab1d1d1e7/r2/default/buckets/sanskrit/objects'

function q(v) {
	return '"' + String(v ?? '').replace(/"/g, '""') + '"'
}

function read(file) {
	try { return fs.readFileSync(file, 'utf8') } catch { return '' }
}

function getChapterTitle(chapterDir) {
	const page = path.join(chapterDir, 'page.jsx')
	const src = read(page)
	const m = /title="([^"]+)"/.exec(src)
	return m?.[1] || path.basename(chapterDir)
}

function getTopicMeta(topicPagePath) {
	const src = read(topicPagePath)
	
	// Look for title in ChapterTitleCard component
	const titleMatch = /<ChapterTitleCard[\s\S]*?title="([^"]+)"/m.exec(src)
	const title = titleMatch?.[1] || ''
	
	// Look for subtitle in ChapterTitleCard component  
	const subtitleMatch = /<ChapterTitleCard[\s\S]*?subtitle="([^"]+)"/m.exec(src)
	const subtitle = subtitleMatch?.[1] || ''
	
	// Look for imageSrc in ImageCard component
	const imageSrc = /<ImageCard[\s\S]*?imageSrc="([^"]+)"/m.exec(src)?.[1] || ''
	const imageAlt = /<ImageCard[\s\S]*?imageAlt="([^"]+)"/m.exec(src)?.[1] || ''
	
	let examples = []
	const exArr = /examples=\{\s*\[([\s\S]*?)\]\s*\}/m.exec(src)?.[1]
	if (exArr) {
		// very simple scrub of examples content
		examples = exArr
			.split(/\},\s*\{/)
			.map(s => s.replace(/[\n\r]+/g, ' ').trim())
	}
	
	// Look for content in ExplanationCard components
	const explanationContent = /content="([\s\S]*?)"\s*\)/m.exec(src)?.[1] || ''
	const tips = /tips="([\s\S]*?)"/m.exec(src)?.[1] || ''
	const dialogueBlock = /<ExplanationCard[\s\S]*?title="Example Dialogue"[\s\S]*?examples=\{\s*\[([\s\S]*?)\]\s*\}/m.exec(src)?.[1] || ''

	// Topic order from leading number pattern in title like "1.6 - ..."
	const order = /^(\d+\.\d+)/.exec(title)?.[1] || ''

	let imageName = ''
	let imageUrl = ''
	let imagePrompt = ''
	if (imageSrc) {
		imageName = path.basename(imageSrc)
		imageUrl = `${R2_DASH_BASE}/${imageName}/details`
		// Generate appropriate image prompt based on topic
		imagePrompt = generateImagePrompt(title, subtitle, imageAlt)
	}

	return { title, subtitle, order, imageName, imageUrl, imageAlt, imagePrompt, examples, explanationContent, tips, dialogueBlock }
}

function generateImagePrompt(title, subtitle, imageAlt) {
	// Create a descriptive image prompt based on the lesson content
	const basePrompt = "Educational illustration for Sanskrit learning, clean modern style, suitable for language learning app"
	
	// Extract key concepts from title and subtitle
	const concepts = []
	if (title.toLowerCase().includes('greeting') || title.toLowerCase().includes('identity')) {
		concepts.push('people greeting each other in traditional Indian style')
	} else if (title.toLowerCase().includes('masculine')) {
		concepts.push('traditional Indian male figures representing masculine names')
	} else if (title.toLowerCase().includes('feminine')) {
		concepts.push('traditional Indian female figures representing feminine names')
	} else if (title.toLowerCase().includes('who') || title.toLowerCase().includes('what')) {
		concepts.push('visual representation of question words and interrogative pronouns')
	} else if (title.toLowerCase().includes('yes') || title.toLowerCase().includes('no')) {
		concepts.push('people having conversations with yes/no responses')
	} else if (title.toLowerCase().includes('daily') || title.toLowerCase().includes('items')) {
		concepts.push('various daily use items like books, fruits, water, food, clothing')
	} else if (title.toLowerCase().includes('existence') || title.toLowerCase().includes('identification')) {
		concepts.push('various objects on a table showing existence concepts')
	} else if (title.toLowerCase().includes('exists') || title.toLowerCase().includes('not')) {
		concepts.push('a table with some objects present and some missing')
	} else if (title.toLowerCase().includes('demonstrating') || title.toLowerCase().includes('this') || title.toLowerCase().includes('that')) {
		if (title.toLowerCase().includes('neuter')) {
			concepts.push('various objects showing this and that concepts')
		} else if (title.toLowerCase().includes('masculine')) {
			concepts.push('male figures representing this and that concepts')
		} else if (title.toLowerCase().includes('feminine')) {
			concepts.push('female figures representing this and that concepts')
		}
	} else if (title.toLowerCase().includes('workplace')) {
		concepts.push('office and workplace items like pens, books, tables, chairs')
	} else if (title.toLowerCase().includes('location') || title.toLowerCase().includes('where')) {
		concepts.push('various objects showing different locations and spatial relationships')
	} else if (title.toLowerCase().includes('here') || title.toLowerCase().includes('there')) {
		concepts.push('objects showing here and there locations')
	} else if (title.toLowerCase().includes('everywhere') || title.toLowerCase().includes('elsewhere')) {
		concepts.push('visual representation of everywhere and elsewhere concepts')
	} else if (title.toLowerCase().includes('front') || title.toLowerCase().includes('back') || title.toLowerCase().includes('left') || title.toLowerCase().includes('right')) {
		concepts.push('objects showing front, back, left, right positions')
	} else if (title.toLowerCase().includes('inside') || title.toLowerCase().includes('outside')) {
		concepts.push('objects showing inside and outside locations')
	} else if (title.toLowerCase().includes('from')) {
		concepts.push('objects showing origin and source concepts')
	} else if (title.toLowerCase().includes('action') || title.toLowerCase().includes('verb')) {
		concepts.push('people performing various actions like going, writing, reading')
	} else if (title.toLowerCase().includes('plural') || title.toLowerCase().includes('many')) {
		concepts.push('multiple objects or groups of people showing plural concepts')
	} else if (title.toLowerCase().includes('singular')) {
		concepts.push('objects showing singular and plural concepts')
	} else if (title.toLowerCase().includes('we') || title.toLowerCase().includes('you')) {
		concepts.push('groups of people performing plural actions')
	} else if (title.toLowerCase().includes('they') || title.toLowerCase().includes('those')) {
		if (title.toLowerCase().includes('masculine')) {
			concepts.push('groups of male figures showing plural concepts')
		} else if (title.toLowerCase().includes('feminine')) {
			concepts.push('groups of female figures showing plural concepts')
		} else if (title.toLowerCase().includes('neuter')) {
			concepts.push('groups of objects showing plural concepts')
		}
	} else if (title.toLowerCase().includes('how many')) {
		concepts.push('objects showing quantity concepts')
	}
	
	// Use imageAlt if available, otherwise use generated concepts
	const finalPrompt = imageAlt || concepts.join(', ') || 'educational illustration for Sanskrit learning'
	
	return `${basePrompt}, ${finalPrompt}, bright colors, clear typography, educational design`
}

function listFirstFiveModules() {
	const dirs = fs.readdirSync(APP)
	return dirs
		.filter(d => /^\d{2}-/.test(d))
		.sort()
		.slice(0, 5)
		.map(d => path.join(APP, d))
}

function collectTopics(chapterDir) {
	const entries = fs.readdirSync(chapterDir)
	const topics = []
	for (const entry of entries) {
		const full = path.join(chapterDir, entry)
		if (fs.statSync(full).isDirectory()) {
			const page = path.join(full, 'page.jsx')
			if (fs.existsSync(page)) topics.push(page)
		}
	}
	return topics.sort()
}

function buildCsv() {
	const header = [
		'chapter_order','chapter_title','topic_order','topic_title','topic_description','topic_details','explanation','example','example_tips','dialogue','image_alt','image_name','image_url','image_prompt'
	]
	const rows = [header.map(q).join(',')]

	const chapterDirs = listFirstFiveModules()
	chapterDirs.forEach((chapterDir, idx) => {
		const chapterOrder = (idx + 1).toString()
		const chapterTitle = getChapterTitle(chapterDir)
		const topics = collectTopics(chapterDir)
		for (const topicPage of topics) {
			const meta = getTopicMeta(topicPage)
			
			// Skip rows with empty topic_order or topic_title to prevent NULL records
			if (!meta.order || !meta.title) {
				console.log(`Skipping topic with missing data: ${topicPage}`)
				continue
			}
			
			const row = [
				chapterOrder,
				chapterTitle,
				meta.order,
				meta.title.replace(/^\d+\.\d+\s*-\s*/,'').trim(),
				meta.subtitle,
				meta.subtitle,
				meta.explanationContent,
				meta.examples.join(' | '),
				meta.tips,
				meta.dialogueBlock,
				meta.imageAlt,
				meta.imageName,
				meta.imageUrl,
				meta.imagePrompt
			].map(q).join(',')
			rows.push(row)
		}
	})

	fs.writeFileSync(OUTPUT, rows.join('\n'))
	console.log(`Wrote ${OUTPUT} with ${rows.length - 1} topics.`)
}

buildCsv()


