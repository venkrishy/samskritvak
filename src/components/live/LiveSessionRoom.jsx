import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { supabase } from '../../lib/supabase.js'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx'
import { Button } from '../ui/button.jsx'
import { Input } from '../ui/input.jsx'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Users, 
  MessageCircle,
  Share2,
  Settings,
  Maximize,
  Minimize
} from 'lucide-react'

export default function LiveSessionRoom({ sessionId, courseId, isInstructor = false }) {
  const { user } = useAuth()
  const [session, setSession] = useState(null)
  const [participants, setParticipants] = useState([])
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [whiteboardOpen, setWhiteboardOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const videoRef = useRef(null)
  const chatRef = useRef(null)

  useEffect(() => {
    if (sessionId) {
      loadSession()
    }
  }, [sessionId])

  useEffect(() => {
    // Scroll chat to bottom when new messages arrive
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chatMessages])

  const loadSession = async () => {
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .select(`
          *,
          courses(title, slug),
          profiles!live_sessions_instructor_id_fkey(display_name, email)
        `)
        .eq('id', sessionId)
        .single()

      if (error) {
        console.error('Error loading session:', error)
        return
      }

      setSession(data)
    } catch (error) {
      console.error('Error loading session:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVideoToggle = () => {
    setIsVideoOn(!isVideoOn)
    // In a real implementation, you would toggle the video stream here
  }

  const handleAudioToggle = () => {
    setIsAudioOn(!isAudioOn)
    // In a real implementation, you would toggle the audio stream here
  }

  const handleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)
    // In a real implementation, you would start/stop screen sharing here
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    // In a real implementation, you would toggle fullscreen mode here
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now(),
      user_id: user.id,
      user_name: user.user_metadata?.full_name || user.email,
      message: newMessage.trim(),
      timestamp: new Date().toISOString()
    }

    setChatMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading session...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Session Not Found</h1>
          <p className="text-gray-400">The live session you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-900 text-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-lg font-semibold">{session.title}</h1>
              <p className="text-sm text-gray-400">
                {session.courses?.title} • {session.profiles?.display_name || session.profiles?.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreen}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWhiteboardOpen(!whiteboardOpen)}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              Whiteboard
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Video Area */}
        <div className={`flex-1 flex flex-col ${whiteboardOpen ? 'w-2/3' : 'w-full'}`}>
          {/* Video Grid */}
          <div className="flex-1 bg-gray-800 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
              {/* Instructor Video */}
              <div className="bg-gray-700 rounded-lg flex items-center justify-center relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">
                      {session.profiles?.display_name?.charAt(0) || session.profiles?.email?.charAt(0) || 'I'}
                    </span>
                  </div>
                  <p className="text-sm font-medium">
                    {session.profiles?.display_name || session.profiles?.email}
                  </p>
                  <p className="text-xs text-gray-400">Instructor</p>
                </div>
                
                {!isVideoOn && (
                  <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
                    <VideoOff className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Student Videos */}
              {participants.map((participant, index) => (
                <div key={participant.id} className="bg-gray-700 rounded-lg flex items-center justify-center relative">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg font-bold">
                        {participant.name?.charAt(0) || participant.email?.charAt(0) || 'S'}
                      </span>
                    </div>
                    <p className="text-xs font-medium">{participant.name || participant.email}</p>
                  </div>
                  
                  {!participant.videoOn && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
                      <VideoOff className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}

              {/* Placeholder for more participants */}
              {participants.length < 5 && (
                <div className="bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
                  <div className="text-center text-gray-400">
                    <Users className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Waiting for participants...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-800 border-t border-gray-700 px-4 py-3">
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={handleVideoToggle}
                className={`${isVideoOn ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-700'} text-white`}
              >
                {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              
              <Button
                onClick={handleAudioToggle}
                className={`${isAudioOn ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-700'} text-white`}
              >
                {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              
              <Button
                onClick={handleScreenShare}
                className={`${isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-500'} text-white`}
              >
                <Share2 className="h-5 w-5" />
              </Button>
              
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <PhoneOff className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Whiteboard Panel */}
        {whiteboardOpen && (
          <div className="w-1/3 bg-white border-l border-gray-300">
            <div className="h-full flex flex-col">
              <div className="bg-gray-100 border-b border-gray-300 px-4 py-2">
                <h3 className="font-semibold text-gray-900">Whiteboard</h3>
              </div>
              
              <div className="flex-1 bg-white">
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📝</span>
                    </div>
                    <p className="text-sm">Whiteboard integration coming soon</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Powered by Excalidraw
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="bg-gray-700 border-b border-gray-600 px-4 py-3">
            <h3 className="font-semibold flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Chat
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={chatRef}>
            {chatMessages.map((message) => (
              <div key={message.id} className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold">
                    {message.user_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">{message.user_name}</p>
                  <p className="text-sm text-white">{message.message}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-700 p-4">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
