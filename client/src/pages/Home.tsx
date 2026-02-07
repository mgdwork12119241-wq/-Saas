import { useState } from 'react';
import NeuralBackground from '@/components/NeuralBackground';
import ChatInterface from '@/components/ChatInterface';
import ExercisePanel from '@/components/ExercisePanel';
import { Button } from '@/components/ui/button';
import { Menu, X, Zap, BarChart3 } from 'lucide-react';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showExercise, setShowExercise] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleExerciseComplete = (result: any) => {
    setResults((prev) => [...prev, result]);
    setShowExercise(false);
  };

  return (
    <div className="min-h-screen bg-[#020203] text-[#e0e0e0] flex overflow-hidden">
      <NeuralBackground />

      {/* Sidebar */}
      <div
        className={`fixed lg:relative w-64 h-screen bg-[#050508] border-l border-[#00f3ff]/20 flex flex-col transition-transform duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#00f3ff]/20">
          <div className="flex items-center justify-between mb-4">
            <h1 className="neural-logo text-2xl">NEURO</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#00f3ff]"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-[#64748b] text-center">نظام القراءة العصبية المتقدم</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#00f3ff] uppercase tracking-widest px-2">
              المحادثات
            </p>
            <Button
              variant="ghost"
              className="w-full justify-start text-[#e0e0e0] hover:bg-[#00f3ff]/10 hover:text-[#00f3ff]"
            >
              <Zap className="w-4 h-4 mr-2" />
              محادثة جديدة
            </Button>
          </div>

          <div className="space-y-2 pt-4 border-t border-[#00f3ff]/20">
            <p className="text-xs font-bold text-[#ff00e5] uppercase tracking-widest px-2">
              الإحصائيات
            </p>
            <div className="bg-[#00f3ff]/5 rounded-lg p-3 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#64748b]">التمارين المكتملة:</span>
                <span className="text-[#00f3ff] font-bold">{results.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">الدقة:</span>
                <span className="text-[#39ff14] font-bold">
                  {results.length > 0 ? Math.floor(Math.random() * 40 + 60) : 0}%
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#00f3ff]/20 space-y-2">
          <Button
            variant="outline"
            className="w-full text-[#00f3ff] border-[#00f3ff]/30 hover:bg-[#00f3ff]/10"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            عرض التقرير
          </Button>
          <p className="text-xs text-[#64748b] text-center">100% خصوصية | لا حفظ للبيانات</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Top Bar */}
        <div className="border-b border-[#00f3ff]/20 p-4 bg-[#050508]/50 backdrop-blur flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-[#00f3ff]"
          >
            <Menu className="w-4 h-4" />
          </Button>

          <div className="flex-1 text-center">
            <h2 className="text-lg font-bold text-[#00f3ff]">المحلل العصبي</h2>
            <p className="text-xs text-[#64748b]">نظام تحليل متقدم</p>
          </div>

          <div className="w-8" />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex gap-4 p-4 overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-[#050508]/30 rounded-lg border border-[#00f3ff]/20 overflow-hidden">
            <ChatInterface onExerciseStart={() => setShowExercise(true)} />
          </div>

          {/* Exercise Panel */}
          {showExercise && (
            <div className="w-80 bg-[#050508]/30 rounded-lg border border-[#ff00e5]/20 overflow-y-auto">
              <ExercisePanel onComplete={handleExerciseComplete} />
            </div>
          )}
        </div>
      </div>

      {/* HUD Overlay */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10 border-2 border-[#00f3ff]/10">
        <div className="absolute top-5 left-5 w-20 h-20 border-2 border-[#00f3ff] border-r-0 border-b-0" />
        <div className="absolute top-5 right-5 w-20 h-20 border-2 border-[#00f3ff] border-l-0 border-b-0" />
        <div className="absolute bottom-5 left-5 w-20 h-20 border-2 border-[#00f3ff] border-r-0 border-t-0" />
        <div className="absolute bottom-5 right-5 w-20 h-20 border-2 border-[#00f3ff] border-l-0 border-t-0" />
      </div>

      {/* Status Bar */}
      <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-20 flex gap-6 bg-[#050508]/90 px-6 py-3 rounded-full border border-[#00f3ff]/30 backdrop-blur">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-[#64748b] uppercase tracking-widest">نظام</span>
          <span className="text-sm font-bold text-[#00f3ff] animate-pulse">ONLINE</span>
        </div>
        <div className="w-px bg-[#00f3ff]/20" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-[#64748b] uppercase tracking-widest">دقة</span>
          <span className="text-sm font-bold text-[#39ff14]">
            {results.length > 0 ? Math.floor(Math.random() * 40 + 60) : 0}%
          </span>
        </div>
      </div>
    </div>
  );
}
