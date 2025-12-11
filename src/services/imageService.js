import { supabase } from '@/lib/supabase'

export class ImageService {
  /**
   * Get all images from the database
   */
  static async getAllImages() {
    try {
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching images:', error)
      return []
    }
  }

  /**
   * Get images by category
   */
  static async getImagesByCategory(category) {
    try {
      const { data, error } = await supabase
        .from('site_images')
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
    try {
      const { data, error } = await supabase
        .from('site_images')
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
    try {
      const { data, error } = await supabase
        .from('site_images')
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
    try {
      const { data, error } = await supabase
        .from('site_images')
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
    try {
      const { data, error } = await supabase
        .from('site_images')
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
    try {
      const { data, error } = await supabase
        .from('site_images')
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
   * Upload a new image (admin only)
   */
  static async uploadImage(imageData) {
    try {
      const { data, error } = await supabase
        .from('site_images')
        .insert([imageData])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  /**
   * Update image metadata (admin only)
   */
  static async updateImage(id, updates) {
    try {
      const { data, error } = await supabase
        .from('site_images')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating image:', error)
      throw error
    }
  }

  /**
   * Delete an image (admin only)
   */
  static async deleteImage(id) {
    try {
      const { data, error } = await supabase
        .from('site_images')
        .update({ is_active: false })
        .eq('id', id)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error deleting image:', error)
      throw error
    }
  }

  /**
   * Get image URL with fallback
   */
  static async getImageUrl(filename, fallback = '/images/placeholder.jpg') {
    try {
      const image = await this.getImageByFilename(filename)
      return image ? image.url : fallback
    } catch (error) {
      console.error('Error getting image URL:', error)
      return fallback
    }
  }
}

export default ImageService

