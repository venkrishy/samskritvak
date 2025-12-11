import { useState, useEffect } from 'react'
import { Button } from '../ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx'
import { 
  ExternalLink, 
  Download, 
  Maximize, 
  Minimize, 
  RefreshCw,
  AlertCircle
} from 'lucide-react'

export default function GoogleDocsViewer({ googleDocUrl, title = 'Document' }) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [embedUrl, setEmbedUrl] = useState('')

  useEffect(() => {
    if (googleDocUrl) {
      processGoogleDocUrl(googleDocUrl)
    }
  }, [googleDocUrl])

  const processGoogleDocUrl = (url) => {
    try {
      // Convert Google Docs URL to embeddable format
      let embedUrl = url
      
      // If it's a sharing URL, convert to embed format
      if (url.includes('/document/d/')) {
        const docId = url.match(/\/document\/d\/([a-zA-Z0-9-_]+)/)?.[1]
        if (docId) {
          embedUrl = `https://docs.google.com/document/d/${docId}/preview`
        }
      }
      
      // Ensure it's in preview mode for embedding
      if (!embedUrl.includes('/preview')) {
        embedUrl = embedUrl.replace(/\/edit.*$/, '/preview')
      }
      
      setEmbedUrl(embedUrl)
      setIsLoading(false)
    } catch (error) {
      console.error('Error processing Google Doc URL:', error)
      setHasError(true)
      setIsLoading(false)
    }
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setHasError(false)
    // Force reload by updating the embed URL
    const currentUrl = embedUrl
    setEmbedUrl('')
    setTimeout(() => setEmbedUrl(currentUrl), 100)
  }

  const handleOpenInNewTab = () => {
    window.open(googleDocUrl, '_blank', 'noopener,noreferrer')
  }

  const handleDownload = () => {
    // Convert to downloadable format
    const downloadUrl = googleDocUrl.replace(/\/edit.*$/, '/export?format=pdf')
    window.open(downloadUrl, '_blank', 'noopener,noreferrer')
  }

  if (hasError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            Document Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to load document
            </h3>
            <p className="text-gray-600 mb-4">
              There was an error loading the Google Doc. Please check the URL and try again.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="mr-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button
                variant="outline"
                onClick={handleOpenInNewTab}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      <Card className="w-full h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">
            {title}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenInNewTab}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreen}
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className={`relative ${isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-96'}`}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                  <p className="text-gray-600">Loading document...</p>
                </div>
              </div>
            )}
            
            {embedUrl && (
              <iframe
                src={embedUrl}
                className="w-full h-full border-0"
                title={title}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setHasError(true)
                  setIsLoading(false)
                }}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                allow="fullscreen"
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      {isFullscreen && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            onClick={handleFullscreen}
            className="bg-white shadow-lg"
          >
            <Minimize className="h-4 w-4 mr-2" />
            Exit Fullscreen
          </Button>
        </div>
      )}
    </div>
  )
}
