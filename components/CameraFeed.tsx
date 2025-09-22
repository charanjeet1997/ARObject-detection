
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { identifyObject } from '../services/geminiService';
import type { DetectedObject } from '../types';
import InfoOverlay from './InfoOverlay';
import Loader from './Loader';

const CAPTURE_INTERVAL = 3000; // Capture a frame every 3 seconds

const CameraFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detectedObject, setDetectedObject] = useState<DetectedObject | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const captureFrameAndIdentify = useCallback(async () => {
    if (videoRef.current && canvasRef.current && !isLoading) {
      setIsLoading(true);
      setError(null);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        // Set canvas dimensions to match video to avoid distortion
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
        const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        
        try {
          const result = await identifyObject(base64Image);
          setDetectedObject(result);
        } catch (err) {
          setError("Failed to identify object. Please try again.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
  }, [isLoading]);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Could not access camera. Please check permissions.');
        console.error('Error accessing camera:', err);
      }
    }
    setupCamera();

    const intervalId = setInterval(captureFrameAndIdentify, CAPTURE_INTERVAL);

    return () => {
      clearInterval(intervalId);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Visual scanning effect */}
      <div className="absolute top-0 left-0 w-full h-4 bg-cyan-400/50 animate-scan shadow-[0_0_15px_5px_rgba(0,255,255,0.5)]"></div>

      {isLoading && <Loader />}
      
      {error && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-red-500/80 text-white p-3 rounded-lg z-20">
          {error}
        </div>
      )}
      
      {detectedObject && <InfoOverlay object={detectedObject} />}
    </div>
  );
};

// Simple keyframes for the scanning animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes scan {
    0% { transform: translateY(0); }
    100% { transform: translateY(calc(100vh - 4px)); }
  }
  .animate-scan {
    animation: scan ${CAPTURE_INTERVAL / 1000}s linear infinite;
  }
`;
document.head.appendChild(style);

export default CameraFeed;
