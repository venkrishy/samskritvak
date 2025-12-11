import { supabase } from '@/lib/supabase'

export class ImageAssetsService {
  /**
   * Get all active image assets
   */
  static async getAllImages() {
    // Return empty array if Supabase not configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('Supabase not configured, returning empty array')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('image_assets')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching image assets:', error)
      return []
    }
  }

  /**
   * Get images by category
   */
  static async getImagesByCategory(category) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) return []

    try {
      const { data, error } = await supabase
        .from('image_assets')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching images by category:', error)
      return []
    }
  }

  /**
   * Get images by page
   */
  static async getImagesByPage(page) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) return []

    try {
      const { data, error } = await supabase
        .from('image_assets')
        .select('*')
        .eq('page', page)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching images by page:', error)
      return []
    }
  }

  /**
   * Get a specific image by filename
   */
  static async getImageByFilename(filename) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) return null

    try {
      const { data, error } = await supabase
        .from('image_assets')
        .select('*')
        .eq('filename', filename)
        .eq('is_active', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching image by filename:', error)
      return null
    }
  }

  /**
   * Get hero images for a specific page
   */
  static async getHeroImage(page) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) return null

    try {
      const { data, error } = await supabase
        .from('image_assets')
        .select('*')
        .eq('page', page)
        .eq('category', 'hero')
        .eq('is_active', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching hero image:', error)
      return null
    }
  }

  /**
   * Get tutor avatar images
   */
  static async getTutorAvatars() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) return []

    try {
      const { data, error } = await supabase
        .from('image_assets')
        .select('*')
        .eq('category', 'tutor')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching tutor avatars:', error)
      return []
    }
  }

  /**
   * Get testimonial avatars
   */
  static async getTestimonialAvatars() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) return []

    try {
      const { data, error } = await supabase
        .from('image_assets')
        .select('*')
        .eq('category', 'avatar')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching testimonial avatars:', error)
      return []
    }
  }

  /**
   * Get background images
   */
  static async getBackgroundImages() {
    if (!supabaseUrl || !supabaseKey) return []

    try {
      const { data, error } = await supabase
        .from('image_assets')
        .select('*')
        .eq('category', 'background')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching background images:', error)
      return []
    }
  }

  /**
   * Get illustrations
   */
  static async getIllustrations() {
    if (!supabaseUrl || !supabaseKey) return []

    try {
      const { data, error } = await supabase
        .from('image_assets')
        .select('*')
        .eq('category', 'illustration')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching illustrations:', error)
      return []
    }
  }

  /**
   * Add a new image asset (admin only)
   */
  static async addImageAsset(imageData) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) throw new Error('Supabase credentials not configured.')
    
    try {
      const { data, error } = await supabase
        .from('image_assets')
        .insert([imageData])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error adding image asset:', error)
      throw error
    }
  }

  /**
   * Update image asset metadata (admin only)
   */
  static async updateImageAsset(id, updates) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) throw new Error('Supabase credentials not configured.')
    
    try {
      const { data, error } = await supabase
        .from('image_assets')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating image asset:', error)
      throw error
    }
  }

  /**
   * Delete an image asset (admin only)
   */
  static async deleteImageAsset(id) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) throw new Error('Supabase credentials not configured.')
    
    try {
      const { data, error } = await supabase
        .from('image_assets')
        .update({ is_active: false })
        .eq('id', id)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error deleting image asset:', error)
      throw error
    }
  }

  /**
   * Get image URL with fallback
   */
  static async getImageUrl(filename, fallback = '/images/placeholder.jpg') {
    try {
      const image = await this.getImageByFilename(filename)
      return image ? image.r2_url : fallback
    } catch (error) {
      console.error('Error getting image URL:', error)
      return fallback
    }
  }

  /**
   * Search images by comments or alt_text
   */
  static async searchImages(query) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) return []
    
    try {
      const { data, error } = await supabase
        .from('image_assets')
        .select('*')
        .or(`comments.ilike.%${query}%,alt_text.ilike.%${query}%,filename.ilike.%${query}%`)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error searching images:', error)
      return []
    }
  }
}

export default ImageAssetsService
