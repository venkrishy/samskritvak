import { supabase } from './supabase'

// Retry configuration
const MAX_RETRIES = 2
const RETRY_DELAY = 1000 // 1 second

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Retry wrapper for Supabase queries
export const supabaseWithRetry = {
  async query(operation) {
    let lastError
    let retryCount = 0

    while (retryCount <= MAX_RETRIES) {
      try {
        console.log(`Attempting Supabase query (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`)
        const result = await operation()
        
        // If successful, return the result
        if (!result.error) {
          console.log(`Supabase query successful on attempt ${retryCount + 1}`)
          return result
        }
        
        // If it's an infinite recursion error, don't retry
        if (result.error?.message?.includes('infinite recursion')) {
          console.error('Infinite recursion detected, not retrying:', result.error)
          return result
        }
        
        // If it's a 500 error, retry
        if (result.error?.status === 500 || result.error?.status === 406) {
          lastError = result.error
          retryCount++
          if (retryCount <= MAX_RETRIES) {
            console.log(`Retrying in ${RETRY_DELAY}ms... (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`)
            await delay(RETRY_DELAY)
            continue
          }
        }
        
        // For other errors, don't retry
        return result
        
      } catch (error) {
        lastError = error
        retryCount++
        
        if (retryCount <= MAX_RETRIES) {
          console.log(`Retrying in ${RETRY_DELAY}ms... (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`)
          await delay(RETRY_DELAY)
          continue
        }
      }
    }
    
    console.error(`Supabase query failed after ${MAX_RETRIES + 1} attempts:`, lastError)
    return { data: null, error: lastError }
  },

  // Wrapper for common Supabase operations
  async from(table) {
    return {
      select: (columns) => ({
        eq: (column, value) => ({
          single: () => this.query(() => supabase.from(table).select(columns).eq(column, value).single())
        }),
        limit: (count) => this.query(() => supabase.from(table).select(columns).limit(count))
      }),
      insert: (data) => this.query(() => supabase.from(table).insert(data)),
      update: (data) => ({
        eq: (column, value) => this.query(() => supabase.from(table).update(data).eq(column, value))
      }),
      delete: () => ({
        eq: (column, value) => this.query(() => supabase.from(table).delete().eq(column, value))
      })
    }
  }
}
