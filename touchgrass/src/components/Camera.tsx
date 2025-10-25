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
    <div className="w-full max-w-2xl mx-auto">
      <div className="card">
        <h3 className="text-2xl font-bold text-green-700 mb-6 text-center">
          📸 Camera
        </h3>

        {!showCamera && !capturedImage && (
          <div className="text-center">
            <button 
              className="btn-primary"
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
              className="w-full max-w-md mx-auto rounded-lg mb-4"
              style={{ maxHeight: '300px' }}
            />
            <br />
            <button 
              className="btn-primary"
              onClick={capturePhoto}
            >
              📸 Capture Photo
            </button>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {capturedImage && (
          <div className="text-center">
            <h4 className="text-lg font-semibold text-green-700 mb-4">Preview</h4>
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full max-w-md mx-auto rounded-lg mb-4"
              style={{ maxHeight: '300px' }}
            />
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                className="btn-secondary"
                onClick={retakePhoto}
              >
                🔁 Retake
              </button>
              <button 
                className="btn-primary"
                onClick={sendToAPI}
                disabled={!!resultMessage && resultMessage !== 'Error sending image. Try again!'}
              >
                🚀 Send to API
              </button>
            </div>
          </div>
        )}

        {resultMessage && (
          <div className={`mt-6 p-4 rounded-lg text-center font-semibold ${
            resultMessage.includes('Great job') 
              ? 'bg-green-100 text-green-800' 
              : resultMessage.includes('Try again')
              ? 'bg-yellow-100 text-yellow-800'
              : resultMessage.includes('Error')
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {resultMessage}
          </div>
        )}
      </div>
    </div>
  )
}