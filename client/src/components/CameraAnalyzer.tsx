import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff } from 'lucide-react';

interface CameraAnalyzerProps {
  onAnalysisComplete?: (data: any) => void;
}

declare global {
  interface Window {
    faceapi: any;
  }
}

export default function CameraAnalyzer({ onAnalysisComplete }: CameraAnalyzerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
        startFaceAnalysis();
      }
    } catch (error) {
      console.error('خطأ في الوصول للكاميرا:', error);
      alert('يرجى السماح بالوصول للكاميرا');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      setIsActive(false);
    }
  };

  const startFaceAnalysis = async () => {
    if (!window.faceapi || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displaySize = { width: video.width, height: video.height };

    window.faceapi.matchDimensions(canvas, displaySize);

    const analyzeFrame = async () => {
      if (!isActive) return;

      try {
        const detections = await window.faceapi
          .detectAllFaces(video)
          .withFaceLandmarks()
          .withFaceExpressions();

        const resizedDetections = window.faceapi.resizeResults(detections, displaySize);

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          window.faceapi.draw.drawDetections(canvas, resizedDetections);
          window.faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        }

        if (detections.length > 0) {
          const expressions = (detections[0] as any).expressions;
          const dominantExpression = Object.entries(expressions).reduce((a: any, b: any) =>
            a[1] > b[1] ? a : b
          );

          setAnalysisData({
            faceDetected: true,
            expression: (dominantExpression[0] as string),
            confidence: ((dominantExpression[1] as number) * 100).toFixed(2),
            timestamp: new Date(),
          });
        }
      } catch (error) {
        console.error('خطأ في تحليل الوجه:', error);
      }

      if (isActive) {
        requestAnimationFrame(analyzeFrame);
      }
    };

    analyzeFrame();
  };

  useEffect(() => {
    return () => {
      if (isActive) {
        stopCamera();
      }
    };
  }, [isActive]);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-[#00f3ff] mb-2">تحليل الكاميرا</h3>
        <p className="text-sm text-[#94a3b8]">تحليل تعابير الوجه والحالة العاطفية</p>
      </div>

      <div className="relative bg-[#00f3ff]/5 border border-[#00f3ff]/30 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-64 object-cover"
          onLoadedMetadata={() => {
            if (canvasRef.current && videoRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }
          }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>

      {analysisData && (
        <div className="bg-[#00f3ff]/5 border border-[#00f3ff]/30 rounded-lg p-3 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-[#64748b]">التعبير المكتشف:</span>
            <span className="text-[#00f3ff] font-bold capitalize">{analysisData.expression}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748b]">الثقة:</span>
            <span className="text-[#39ff14] font-bold">{analysisData.confidence}%</span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {!isActive ? (
          <Button
            onClick={startCamera}
            disabled={isLoading}
            className="neural-btn flex-1"
          >
            <Camera className="w-4 h-4 mr-2" />
            {isLoading ? 'جاري التحميل...' : 'بدء الكاميرا'}
          </Button>
        ) : (
          <Button
            onClick={stopCamera}
            className="neural-btn flex-1 bg-red-600/20 border-red-600/50 text-red-400 hover:bg-red-600/30"
          >
            <CameraOff className="w-4 h-4 mr-2" />
            إيقاف الكاميرا
          </Button>
        )}
        {analysisData && (
          <Button
            onClick={() => {
              onAnalysisComplete?.(analysisData);
              stopCamera();
            }}
            className="neural-btn flex-1"
          >
            تأكيد
          </Button>
        )}
      </div>
    </div>
  );
}
