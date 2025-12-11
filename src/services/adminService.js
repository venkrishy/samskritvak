import { supabase } from '@/lib/supabase'

// ==================== CURRENCIES ====================

export const getCurrencies = async () => {
  try {
    const { data, error } = await supabase
      .from('currencies')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching currencies:', error)
    return { data: null, error }
  }
}

export const createCurrency = async (currency) => {
  try {
    const { data, error } = await supabase
      .from('currencies')
      .insert([currency])
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating currency:', error)
    return { data: null, error }
  }
}

export const updateCurrency = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('currencies')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating currency:', error)
    return { data: null, error }
  }
}

export const deleteCurrency = async (id) => {
  try {
    const { error } = await supabase
      .from('currencies')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting currency:', error)
    return { error }
  }
}

// ==================== COURSE CATEGORIES ====================

export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('course_categories')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { data: null, error }
  }
}

export const createCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from('course_categories')
      .insert([category])
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating category:', error)
    return { data: null, error }
  }
}

export const updateCategory = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('course_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating category:', error)
    return { data: null, error }
  }
}

export const deleteCategory = async (id) => {
  try {
    const { error } = await supabase
      .from('course_categories')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting category:', error)
    return { error }
  }
}

// ==================== COURSES ====================

export const getCourses = async () => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        category:course_categories(id, name, slug)
      `)
      .order('category_id', { ascending: true })
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching courses:', error)
    return { data: null, error }
  }
}

export const createCourse = async (course) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .insert([course])
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating course:', error)
    return { data: null, error }
  }
}

export const updateCourse = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating course:', error)
    return { data: null, error }
  }
}

export const deleteCourse = async (id) => {
  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting course:', error)
    return { error }
  }
}

// ==================== TUTORS ====================

export const getTutors = async () => {
  try {
    const { data, error} = await supabase
      .from('tutors')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching tutors:', error)
    return { data: null, error }
  }
}

export const createTutor = async (tutor) => {
  try {
    const { data, error } = await supabase
      .from('tutors')
      .insert([tutor])
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating tutor:', error)
    return { data: null, error }
  }
}

export const updateTutor = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('tutors')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating tutor:', error)
    return { data, null, error }
  }
}

export const deleteTutor = async (id) => {
  try {
    const { error } = await supabase
      .from('tutors')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting tutor:', error)
    return { error }
  }
}

// ==================== HOMEPAGE CONTENT ====================

export const getHomepageContent = async (sectionType = null) => {
  try {
    let query = supabase
      .from('homepage_content')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (sectionType) {
      query = query.eq('section_type', sectionType)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching homepage content:', error)
    return { data: null, error }
  }
}

export const createHomepageContent = async (content) => {
  try {
    const { data, error } = await supabase
      .from('homepage_content')
      .insert([content])
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error creating homepage content:', error)
    return { data: null, error }
  }
}

export const updateHomepageContent = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('homepage_content')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating homepage content:', error)
    return { data: null, error }
  }
}

export const deleteHomepageContent = async (id) => {
  try {
    const { error } = await supabase
      .from('homepage_content')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting homepage content:', error)
    return { error }
  }
}
