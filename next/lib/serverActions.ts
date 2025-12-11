"use server"
import { createClient } from '@supabase/supabase-js'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuid } from 'uuid'

const supabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_SUPABASE_PUBLISHABLE_KEY!)

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || ''
  }
})

export async function uploadR2(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  const key = `lessons/${Date.now()}-${uuid()}-${file.name}`
  await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: Buffer.from(arrayBuffer),
    ContentType: file.type
  }))
  const base = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, '')
  return `${base}/${key}`
}

export async function saveLesson(form: any, commitMessage: string) {
  const client = supabase()
  // upsert by id or chapter+slug
  const payload = { ...form }
  const { data, error } = await client.from('lessons').upsert(payload).select('id').single()
  if (error) throw error
  await client.from('lesson_revisions').insert({
    lesson_id: data.id,
    snapshot: payload,
    commit_message: commitMessage || 'update'
  })
  return data
}

export async function publishLesson(form: any, commitMessage: string) {
  const client = supabase()
  const payload = { ...form, status: 'published' }
  const { data, error } = await client.from('lessons').upsert(payload).select('id').single()
  if (error) throw error
  await client.from('lesson_revisions').insert({
    lesson_id: data.id,
    snapshot: payload,
    commit_message: commitMessage || 'publish'
  })
  // TODO: trigger revalidate tag via route handler if needed
  return data
}

export async function parseMetaLinks(md: string) {
  const blocks: { type: string, url: string, label?: string }[] = []
  const regex = /```meta[\s\S]*?```/g
  const matches = md.match(regex) || []
  for (const block of matches) {
    const type = /type:\s*(.+)/.exec(block)?.[1]?.trim()
    const url = /url:\s*(.+)/.exec(block)?.[1]?.trim()
    const label = /label:\s*(.+)/.exec(block)?.[1]?.trim()
    if (type && url) blocks.push({ type, url, label })
  }
  return blocks
}

