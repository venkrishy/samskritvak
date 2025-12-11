"use client"
import { useState } from 'react'
import { saveLesson, publishLesson, uploadR2, parseMetaLinks } from '@/lib/serverActions'

type Lesson = {
  id?: string
  lesson_id?: string
  language?: string
  level?: string
  chapter_number?: number
  slug?: string
  title?: string
  goal_vocabulary_md?: string
  examples_md?: string
  tips_md?: string
  dialogue_md?: string
  image_url?: string
  status?: 'draft'|'published'
  order?: number
}

export function EditorForm({ initial }: { initial?: Lesson }) {
  const [form, setForm] = useState<Lesson>({
    language: initial?.language || 'sanskrit',
    level: initial?.level || 'Beginner',
    chapter_number: initial?.chapter_number || 1,
    slug: initial?.slug || '',
    title: initial?.title || '',
    goal_vocabulary_md: initial?.goal_vocabulary_md || '',
    examples_md: initial?.examples_md || '',
    tips_md: initial?.tips_md || '',
    dialogue_md: initial?.dialogue_md || '',
    image_url: initial?.image_url || '',
    order: initial?.order || 0
  })
  const [commitMessage, setCommitMessage] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleChange = (k: keyof Lesson) => (e: any) => {
    setForm(prev => ({ ...prev, [k]: e.target.value }))
  }

  const onUpload = async (file: File) => {
    setUploading(true)
    try {
      const url = await uploadR2(file)
      setForm(prev => ({ ...prev, image_url: url }))
    } finally {
      setUploading(false)
    }
  }

  const onSave = async () => {
    await saveLesson(form, commitMessage)
    setCommitMessage('')
    alert('Saved')
  }
  const onPublish = async () => {
    await publishLesson(form, commitMessage)
    setCommitMessage('')
    alert('Published')
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight">{initial?.id ? 'Edit Lesson' : 'New Lesson'}</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/30 p-6 rounded-xl ring-1 ring-slate-800">
        <label className="space-y-2">
          <span className="text-xs uppercase text-slate-400">Language</span>
          <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500" value={form.language||''} onChange={handleChange('language')} />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase text-slate-400">Level</span>
          <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500" value={form.level||''} onChange={handleChange('level')} />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase text-slate-400">Chapter Number</span>
          <input type="number" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500" value={form.chapter_number||1} onChange={handleChange('chapter_number')} />
        </label>
        <label className="space-y-2">
          <span className="text-xs uppercase text-slate-400">Slug</span>
          <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500" value={form.slug||''} onChange={handleChange('slug')} />
        </label>
        <label className="col-span-full space-y-2">
          <span className="text-xs uppercase text-slate-400">Title</span>
          <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500" value={form.title||''} onChange={handleChange('title')} />
        </label>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MarkdownField label="Goal & Vocabulary" value={form.goal_vocabulary_md||''} onChange={v=>setForm(p=>({...p, goal_vocabulary_md:v}))} />
        <MarkdownField label="Examples" value={form.examples_md||''} onChange={v=>setForm(p=>({...p, examples_md:v}))} />
        <MarkdownField label="Tips" value={form.tips_md||''} onChange={v=>setForm(p=>({...p, tips_md:v}))} />
        <MarkdownField label="Example Dialogue" value={form.dialogue_md||''} onChange={v=>setForm(p=>({...p, dialogue_md:v}))} />
      </section>

      <section className="space-y-3">
        <div className="text-sm font-medium text-slate-300">Hero Image</div>
        {form.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.image_url} alt="hero" className="max-h-48 rounded-lg ring-1 ring-slate-800" />
        )}
        <input type="file" accept="image/*" onChange={e=>e.target.files&&onUpload(e.target.files[0])} disabled={uploading} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <label className="space-y-2">
          <span className="text-xs uppercase text-slate-400">Commit Message</span>
          <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500" value={commitMessage} onChange={e=>setCommitMessage(e.target.value)} placeholder="Describe your changes" />
        </label>
        <div className="flex gap-3">
          <button className="rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-2" onClick={onSave}>Save</button>
          <button className="rounded-lg bg-sky-600 hover:bg-sky-500 px-4 py-2" onClick={onPublish}>Publish</button>
        </div>
      </section>
    </div>
  )
}

function MarkdownField({ label, value, onChange }: { label: string, value: string, onChange: (v:string)=>void }) {
  const [text, setText] = useState(value)
  const insert = (snippet: string) => {
    const v = (text || '') + (text ? '\n\n' : '') + snippet
    setText(v)
    onChange(v)
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-300">{label}</div>
        <div className="text-xs flex gap-3 text-sky-400">
          <button className="underline" type="button" onClick={()=>insert("```meta\ntype: youtube\nurl: https://youtu.be/xyz\nlabel: Intro video\n```")}>/youtube</button>
          <button className="underline" type="button" onClick={()=>insert("```meta\ntype: audio\nurl: https://media.example.com/audio.mp3\nlabel: Audio\n```")}>/audio</button>
          <button className="underline" type="button" onClick={()=>insert("```meta\ntype: flashcards\nurl: flashcards://set/<id>\nlabel: Flashcards\n```")}>/flashcards</button>
        </div>
      </div>
      <textarea className="w-full h-56 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500" value={text} onChange={e=>{setText(e.target.value); onChange(e.target.value)}} />
    </div>
  )
}

