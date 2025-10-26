'use client'

import { useState, useRef } from 'react'
import { imageApi } from '@/lib/api'

interface CameraProps {
  prompt?: string
  onSuccess?: () => void
  onFailure?: () => void
}

export default function Camera({ prompt = 'Unknown item', onSuccess, onFailure }: CameraProps) {
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [resultMessage, setResultMessage] = useState('')
  const [stream, setStream] = useState<MediaStream | null>(null)

  // Start the camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })

      setStream(mediaStream)
      setShowCamera(true)
      setResultMessage('')

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          console.log('Camera started!')
        }
      }, 100)
    } catch (error) {
      alert('Could not access camera: ' + (error as Error).message)
    }
  }

  // Stop the camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop()
      })
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  // Capture a still image from the video
  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext('2d')
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
    }

    const imageData = canvas.toDataURL('image/png')
    setCapturedImage(imageData)
    setShowCamera(false)
    
    // Turn off the webcam after photo capture
    stopCamera()
    
    console.log('Photo captured and camera stopped!')
  }

  // Convert Base64 image to Blob for upload
  const dataURLtoBlob = (dataUrl: string): Blob => {
    const arr = dataUrl.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }

  // Send image to backend for recognition
  const sendToAPI = async () => {
    if (!capturedImage) return alert('No image captured yet!')

    try {
      setResultMessage('Processing...')
      
      // Call the backend API to upload the image
      const response = await imageApi.uploadImage(prompt, capturedImage)
      
      if (response.success) {
        setResultMessage('Great job! You found it!')
        onSuccess?.()
      } else {
        setResultMessage('Try again! Keep looking.')
        onFailure?.()
      }
    } catch (error: any) {
      console.error('Upload failed:', error)
      setResultMessage('Error sending image. Try again!')
      onFailure?.()
    }
  }

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null)
    setResultMessage('')
    startCamera() // Restart the camera
  }

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <div className="camera-container">
        <h3 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'var(--font-weight-bold)', 
          color: 'var(--primary-green)', 
          marginBottom: 'var(--spacing-xl)', 
          textAlign: 'center' 
        }}>
          📸 Camera
        </h3>

        {!showCamera && !capturedImage && (
          <div className="text-center">
            <button 
              className="btn btn-primary"
              onClick={startCamera}
            >
              📷 Start Camera
            </button>
          </div>
        )}

        {showCamera && (
          <div className="text-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="camera-video"
              style={{ 
                width: '100%', 
                maxWidth: '400px', 
                margin: '0 auto var(--spacing-lg)', 
                maxHeight: '300px',
                display: 'block'
              }}
            />
            <button 
              className="btn btn-primary"
              onClick={capturePhoto}
            >
              📸 Capture Photo
            </button>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {capturedImage && (
          <div className="text-center">
            <h4 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 'var(--font-weight-semibold)', 
              color: 'var(--primary-green)', 
              marginBottom: 'var(--spacing-lg)' 
            }}>
              Preview
            </h4>
            <img
              src={capturedImage}
              alt="Captured"
              style={{ 
                width: '100%', 
                maxWidth: '400px', 
                margin: '0 auto var(--spacing-lg)', 
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                maxHeight: '300px',
                display: 'block'
              }}
            />
            <div className="camera-controls">
              <button 
                className="btn btn-secondary"
                onClick={retakePhoto}
              >
                🔁 Retake
              </button>
              <button 
                className="btn btn-primary"
                onClick={sendToAPI}
                disabled={!!resultMessage && resultMessage !== 'Error sending image. Try again!'}
              >
                🚀 Send to API
              </button>
            </div>
          </div>
        )}

        {resultMessage && (
          <div style={{
            marginTop: 'var(--spacing-xl)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            fontWeight: 'var(--font-weight-semibold)',
            ...(resultMessage.includes('Great job') 
              ? { backgroundColor: 'var(--light-green)', color: 'var(--primary-green)' }
              : resultMessage.includes('Try again')
              ? { backgroundColor: '#FEF3C7', color: '#92400E' }
              : resultMessage.includes('Error')
              ? { backgroundColor: '#FEF2F2', color: '#DC2626' }
              : { backgroundColor: '#DBEAFE', color: '#1D4ED8' })
          }}>
            {resultMessage}
          </div>
        )}
      </div>
    </div>
  )
}