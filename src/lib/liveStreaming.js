// Live Streaming Management
// This file handles live session creation and management

import { supabase } from './supabase.js'

export const liveStreaming = {
  // Create a new live session
  async createSession(courseId, instructorId, title, scheduledAt, durationMinutes = 60) {
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .insert({
          course_id: courseId,
          instructor_id: instructorId,
          title: title,
          scheduled_at: scheduledAt,
          duration_minutes: durationMinutes,
          status: 'scheduled',
          meeting_url: await generateMeetingURL(),
          whiteboard_url: await generateWhiteboardURL()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating live session:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error creating live session:', error)
      throw error
    }
  },

  // Get live sessions for a course
  async getCourseSessions(courseId) {
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .select(`
          *,
          courses(title, slug),
          profiles!live_sessions_instructor_id_fkey(display_name, email)
        `)
        .eq('course_id', courseId)
        .order('scheduled_at', { ascending: true })

      if (error) {
        console.error('Error fetching course sessions:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching course sessions:', error)
      throw error
    }
  },

  // Get upcoming sessions for a user
  async getUpcomingSessions(userId) {
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .select(`
          *,
          courses(title, slug),
          profiles!live_sessions_instructor_id_fkey(display_name, email)
        `)
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })

      if (error) {
        console.error('Error fetching upcoming sessions:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error)
      throw error
    }
  },

  // Start a live session
  async startSession(sessionId) {
    try {
      const { error } = await supabase
        .from('live_sessions')
        .update({ 
          status: 'live',
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)

      if (error) {
        console.error('Error starting session:', error)
        throw error
      }

      return true
    } catch (error) {
      console.error('Error starting session:', error)
      throw error
    }
  },

  // End a live session
  async endSession(sessionId) {
    try {
      const { error } = await supabase
        .from('live_sessions')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)

      if (error) {
        console.error('Error ending session:', error)
        throw error
      }

      return true
    } catch (error) {
      console.error('Error ending session:', error)
      throw error
    }
  },

  // Cancel a live session
  async cancelSession(sessionId) {
    try {
      const { error } = await supabase
        .from('live_sessions')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)

      if (error) {
        console.error('Error cancelling session:', error)
        throw error
      }

      return true
    } catch (error) {
      console.error('Error cancelling session:', error)
      throw error
    }
  },

  // Get session participants
  async getSessionParticipants(sessionId) {
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .select(`
          course_enrollments(
            profiles(display_name, email)
          )
        `)
        .eq('id', sessionId)
        .single()

      if (error) {
        console.error('Error fetching session participants:', error)
        throw error
      }

      return data?.course_enrollments?.map(enrollment => enrollment.profiles) || []
    } catch (error) {
      console.error('Error fetching session participants:', error)
      throw error
    }
  }
}

// Helper function to generate meeting URL
async function generateMeetingURL() {
  // In a real implementation, you would integrate with Daily.co, Agora.io, or similar
  // For now, return a placeholder URL
  const roomId = Math.random().toString(36).substring(2, 15)
  return `https://meet.daily.co/${roomId}`
}

// Helper function to generate whiteboard URL
async function generateWhiteboardURL() {
  // In a real implementation, you would integrate with Excalidraw or similar
  // For now, return a placeholder URL
  const boardId = Math.random().toString(36).substring(2, 15)
  return `https://excalidraw.com/#room=${boardId}`
}

export default liveStreaming
