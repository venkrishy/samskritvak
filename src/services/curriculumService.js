import { supabase } from '@/lib/supabase'

export class CurriculumService {
  // Get all chapters
  static async getChapters() {
    const { data, error } = await supabase
      .from('curriculum')
      .select('chapter_order, chapter_title')
      .order('chapter_order')
    
    if (error) throw error
    
    // Get unique chapters
    const uniqueChapters = data?.reduce((acc, item) => {
      if (!acc.find(ch => ch.chapter_order === item.chapter_order)) {
        acc.push(item)
      }
      return acc
    }, []) || []
    
    return uniqueChapters
  }

  // Get topics for a chapter
  static async getChapterTopics(chapterNumber) {
    const { data, error } = await supabase
      .from('curriculum')
      .select('*')
      .eq('chapter_order', chapterNumber)
      .order('topic_order')
    
    if (error) throw error
    return data || []
  }

  // Get specific lesson
  static async getLesson(chapterNumber, topicNumber) {
    const { data, error } = await supabase
      .from('curriculum')
      .select('*')
      .eq('chapter_order', chapterNumber)
      .eq('topic_order', topicNumber)
      .single()
    
    if (error) throw error
    return data
  }

  // Navigation helpers
  static async getNextTopic(currentChapter, currentTopic) {
    // Get all topics ordered by chapter and topic
    const { data, error } = await supabase
      .from('curriculum')
      .select('chapter_order, topic_order')
      .order('chapter_order')
      .order('topic_order')
    
    if (error) throw error
    
    const currentIndex = data.findIndex(item => 
      item.chapter_order === currentChapter && item.topic_order === currentTopic
    )
    
    if (currentIndex === -1 || currentIndex === data.length - 1) return null
    
    const next = data[currentIndex + 1]
    return { chapter: next.chapter_order, topic: next.topic_order }
  }

  static async getPreviousTopic(currentChapter, currentTopic) {
    const { data, error } = await supabase
      .from('curriculum')
      .select('chapter_order, topic_order')
      .order('chapter_order')
      .order('topic_order')
    
    if (error) throw error
    
    const currentIndex = data.findIndex(item => 
      item.chapter_order === currentChapter && item.topic_order === currentTopic
    )
    
    if (currentIndex <= 0) return null
    
    const prev = data[currentIndex - 1]
    return { chapter: prev.chapter_order, topic: prev.topic_order }
  }

  // Get all curriculum data for table of contents
  static async getAllCurriculum() {
    const { data, error } = await supabase
      .from('curriculum')
      .select('*')
      .order('chapter_order')
      .order('topic_order')
    
    if (error) throw error
    return data || []
  }

  // Get chapter data with topics
  static async getChapterWithTopics(chapterNumber) {
    const { data, error } = await supabase
      .from('curriculum')
      .select('*')
      .eq('chapter_order', chapterNumber)
      .order('topic_order')
    
    if (error) throw error
    
    if (!data || data.length === 0) return null
    
    return {
      chapter_number: data[0].chapter_order,
      chapter_title: data[0].chapter_title,
      topics: data
    }
  }
}
