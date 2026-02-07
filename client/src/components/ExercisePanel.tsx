import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Zap } from 'lucide-react';

interface ExercisePanelProps {
  onComplete?: (result: any) => void;
}

export default function ExercisePanel({ onComplete }: ExercisePanelProps) {
  const [currentExercise, setCurrentExercise] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const colors = [
    { name: 'السيان', hex: '#00f3ff' },
    { name: 'الأرجواني', hex: '#ff00e5' },
    { name: 'الأخضر', hex: '#39ff14' },
    { name: 'الأحمر', hex: '#ff0040' },
    { name: 'الأزرق', hex: '#0066ff' },
    { name: 'الأصفر', hex: '#ffff00' },
  ];

  const words = [
    'ذكاء',
    'تحليل',
    'إبداع',
    'تركيز',
    'حدس',
    'منطق',
    'عاطفة',
    'معرفة',
    'تجربة',
    'حكمة',
  ];

  const patterns = [
    { id: 1, position: 'top-10 left-10' },
    { id: 2, position: 'top-10 right-10' },
    { id: 3, position: 'bottom-10 left-10' },
    { id: 4, position: 'bottom-10 right-10' },
    { id: 5, position: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' },
  ];

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setTimeout(() => {
      onComplete?.({
        type: 'color',
        selected: color,
        timestamp: new Date(),
      });
      setCurrentExercise(null);
      setSelectedColor(null);
    }, 500);
  };

  const handleWordToggle = (word: string) => {
    setSelectedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const handlePatternClick = (id: number) => {
    onComplete?.({
      type: 'pattern',
      selected: id,
      timestamp: new Date(),
    });
    setCurrentExercise(null);
  };

  if (!currentExercise) {
    return (
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-[#00f3ff] mb-4">التمارين المتاحة</h3>
        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={() => setCurrentExercise('color')}
            className="neural-btn w-full justify-between py-6"
          >
            <span>تحليل الألوان</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setCurrentExercise('words')}
            className="neural-btn w-full justify-between py-6"
          >
            <span>اختيار الكلمات</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setCurrentExercise('pattern')}
            className="neural-btn w-full justify-between py-6"
          >
            <span>التعرف على الأنماط</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (currentExercise === 'color') {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#00f3ff] mb-2">تمرين تحليل الألوان</h3>
          <p className="text-sm text-[#94a3b8]">اختر اللون الذي يعجبك أكثر</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {colors.map((color) => (
            <button
              key={color.hex}
              onClick={() => handleColorSelect(color.hex)}
              className={`aspect-square rounded-lg border-2 transition-all ${
                selectedColor === color.hex
                  ? 'border-[#39ff14] shadow-lg shadow-[#39ff14]/50 scale-110'
                  : 'border-[#00f3ff]/30 hover:border-[#00f3ff]'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>

        <Button
          variant="outline"
          onClick={() => setCurrentExercise(null)}
          className="w-full text-[#00f3ff] border-[#00f3ff]/30"
        >
          رجوع
        </Button>
      </div>
    );
  }

  if (currentExercise === 'words') {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#00f3ff] mb-2">اختيار الكلمات</h3>
          <p className="text-sm text-[#94a3b8]">اختر الكلمات التي تصفك</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {words.map((word) => (
            <button
              key={word}
              onClick={() => handleWordToggle(word)}
              className={`px-4 py-2 rounded-full text-sm transition-all border ${
                selectedWords.includes(word)
                  ? 'bg-gradient-to-r from-[#00f3ff] to-[#ff00e5] border-[#39ff14] text-[#050508]'
                  : 'bg-[#00f3ff]/5 border-[#00f3ff]/30 text-[#e0e0e0] hover:border-[#00f3ff]'
              }`}
            >
              {word}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              onComplete?.({
                type: 'words',
                selected: selectedWords,
                timestamp: new Date(),
              });
              setCurrentExercise(null);
              setSelectedWords([]);
            }}
            disabled={selectedWords.length === 0}
            className="neural-btn flex-1"
          >
            <Zap className="w-4 h-4 mr-2" />
            تأكيد
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentExercise(null)}
            className="flex-1 text-[#00f3ff] border-[#00f3ff]/30"
          >
            رجوع
          </Button>
        </div>
      </div>
    );
  }

  if (currentExercise === 'pattern') {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#00f3ff] mb-2">التعرف على الأنماط</h3>
          <p className="text-sm text-[#94a3b8]">انقر على النقطة التي تتوقع أنها الخطوة التالية</p>
        </div>

        <div className="relative w-full h-64 bg-[#00f3ff]/5 border border-[#00f3ff]/30 rounded-lg overflow-hidden">
          {patterns.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => handlePatternClick(pattern.id)}
              className={`absolute w-12 h-12 rounded-full border-2 border-[#00f3ff] bg-[#00f3ff]/10 hover:bg-[#00f3ff]/30 transition-all hover:scale-110 ${pattern.position}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          onClick={() => setCurrentExercise(null)}
          className="w-full text-[#00f3ff] border-[#00f3ff]/30"
        >
          رجوع
        </Button>
      </div>
    );
  }

  return null;
}
