import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';

interface AudioAnalyzerProps {
  onAnalysisComplete?: (data: any) => void;
}

declare global {
  interface Window {
    Meyda: any;
  }
}

export default function AudioAnalyzer({ onAnalysisComplete }: AudioAnalyzerProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const meydaRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const animationIdRef = useRef<number | undefined>(undefined);

  const startAudioAnalysis = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass() as AudioContext;
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      analyzerRef.current = analyzer;

      source.connect(analyzer);
      analyzer.fftSize = 512;

      if (window.Meyda) {
        meydaRef.current = window.Meyda.createMeydaAnalyzer({
          audioContext: audioContext,
          source: source,
          bufferSize: 512,
          featureExtractors: ['energy', 'spectralCentroid', 'zcr'],
          callback: (features: any) => {
            setAnalysisData({
              energy: (features.energy * 100).toFixed(2),
              spectralCentroid: features.spectralCentroid.toFixed(0),
              zcr: (features.zcr * 100).toFixed(2),
              timestamp: new Date(),
            });
          },
        });

        meydaRef.current.start();
      }

      setIsActive(true);
      visualizeAudio();
    } catch (error) {
      console.error('خطأ في الوصول للميكروفون:', error);
      alert('يرجى السماح بالوصول للميكروفون');
    } finally {
      setIsLoading(false);
    }
  };

  const stopAudioAnalysis = () => {
    if (meydaRef.current) {
      meydaRef.current.stop();
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }

    setIsActive(false);
  };

  const visualizeAudio = () => {
    if (!analyzerRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);

    const draw = () => {
      if (!analyzerRef.current) return;

      analyzerRef.current.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgba(2, 2, 3, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / dataArray.length) * 2.5;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        const hue = (i / dataArray.length) * 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      if (isActive) {
        animationIdRef.current = requestAnimationFrame(draw);
      }
    };

    draw();
  };

  useEffect(() => {
    return () => {
      if (isActive) {
        stopAudioAnalysis();
      }
    };
  }, [isActive]);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-[#ff00e5] mb-2">تحليل الصوت</h3>
        <p className="text-sm text-[#94a3b8]">تحليل خصائص الصوت والطاقة الصوتية</p>
      </div>

      <div className="bg-[#ff00e5]/5 border border-[#ff00e5]/30 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          className="w-full h-40"
        />
      </div>

      {analysisData && (
        <div className="bg-[#ff00e5]/5 border border-[#ff00e5]/30 rounded-lg p-3 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-[#64748b]">الطاقة:</span>
            <span className="text-[#ff00e5] font-bold">{analysisData.energy}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748b]">مركز الطيف:</span>
            <span className="text-[#39ff14] font-bold">{analysisData.spectralCentroid} Hz</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748b]">معدل العبور:</span>
            <span className="text-[#00f3ff] font-bold">{analysisData.zcr}%</span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {!isActive ? (
          <Button
            onClick={startAudioAnalysis}
            disabled={isLoading}
            className="neural-btn flex-1"
          >
            <Mic className="w-4 h-4 mr-2" />
            {isLoading ? 'جاري التحميل...' : 'بدء الميكروفون'}
          </Button>
        ) : (
          <Button
            onClick={stopAudioAnalysis}
            className="neural-btn flex-1 bg-red-600/20 border-red-600/50 text-red-400 hover:bg-red-600/30"
          >
            <MicOff className="w-4 h-4 mr-2" />
            إيقاف الميكروفون
          </Button>
        )}
        {analysisData && (
          <Button
            onClick={() => {
              onAnalysisComplete?.(analysisData);
              stopAudioAnalysis();
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
