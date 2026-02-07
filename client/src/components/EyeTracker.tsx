import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface EyeTrackerProps {
  onAnalysisComplete?: (data: any) => void;
}

declare global {
  interface Window {
    webgazer: any;
  }
}

export default function EyeTracker({ onAnalysisComplete }: EyeTrackerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const gazePointsRef = useRef<Array<{ x: number; y: number }>>([]);

  const startEyeTracking = async () => {
    try {
      setIsLoading(true);

      if (!window.webgazer) {
        console.error('WebGazer not loaded');
        return;
      }

      // Initialize WebGazer
      await window.webgazer
        .setRegression('ridge')
        .headpositionrnn()
        .begin();

      // Set up gaze callback
      window.webgazer.setGazeListener((data: any, elapsedTime: number) => {
        if (data == null) return;

        gazePointsRef.current.push({ x: data.x, y: data.y });

        // Keep only last 100 points
        if (gazePointsRef.current.length > 100) {
          gazePointsRef.current.shift();
        }

        setTrackingData({
          x: data.x.toFixed(0),
          y: data.y.toFixed(0),
          pointsTracked: gazePointsRef.current.length,
          timestamp: new Date(),
        });
      });

      setIsActive(true);
      visualizeGaze();
    } catch (error) {
      console.error('خطأ في تتبع العين:', error);
      alert('يرجى السماح بالوصول للكاميرا لتتبع العين');
    } finally {
      setIsLoading(false);
    }
  };

  const stopEyeTracking = () => {
    if (window.webgazer) {
      window.webgazer.end();
    }
    setIsActive(false);
    gazePointsRef.current = [];
  };

  const visualizeGaze = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 2, 3, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw gaze trail
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();

      gazePointsRef.current.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });

      ctx.stroke();

      // Draw current gaze point
      if (gazePointsRef.current.length > 0) {
        const lastPoint = gazePointsRef.current[gazePointsRef.current.length - 1];

        ctx.fillStyle = 'rgba(0, 243, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ff00e5';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, 20, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (isActive) {
        requestAnimationFrame(draw);
      }
    };

    draw();
  };

  useEffect(() => {
    return () => {
      if (isActive) {
        stopEyeTracking();
      }
    };
  }, [isActive]);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-[#39ff14] mb-2">تتبع العين</h3>
        <p className="text-sm text-[#94a3b8]">تتبع حركة العين والانتباه البصري</p>
      </div>

      <div className="bg-[#39ff14]/5 border border-[#39ff14]/30 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-64 bg-[#050508]"
        />
      </div>

      {trackingData && (
        <div className="bg-[#39ff14]/5 border border-[#39ff14]/30 rounded-lg p-3 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-[#64748b]">موضع العين X:</span>
            <span className="text-[#39ff14] font-bold">{trackingData.x}px</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748b]">موضع العين Y:</span>
            <span className="text-[#39ff14] font-bold">{trackingData.y}px</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748b]">النقاط المتتبعة:</span>
            <span className="text-[#00f3ff] font-bold">{trackingData.pointsTracked}</span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {!isActive ? (
          <Button
            onClick={startEyeTracking}
            disabled={isLoading}
            className="neural-btn flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            {isLoading ? 'جاري التحميل...' : 'بدء تتبع العين'}
          </Button>
        ) : (
          <Button
            onClick={stopEyeTracking}
            className="neural-btn flex-1 bg-red-600/20 border-red-600/50 text-red-400 hover:bg-red-600/30"
          >
            <EyeOff className="w-4 h-4 mr-2" />
            إيقاف التتبع
          </Button>
        )}
        {trackingData && (
          <Button
            onClick={() => {
              onAnalysisComplete?.(trackingData);
              stopEyeTracking();
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
