import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Zap, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'exercise' | 'result';
}

interface ChatInterfaceProps {
  onExerciseStart?: (exerciseType: string) => void;
}

export default function ChatInterface({ onExerciseStart }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'مرحباً! أنا المحلل العصبي المتقدم. سأساعدك في اكتشاف أنماط سلوكك وتحليل قدراتك العقلية. هل أنت مستعد للبدء؟',
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate assistant response
    setTimeout(() => {
      const responses = [
        {
          content: 'ممتاز! دعنا نبدأ بتمرين تحليل الألوان. هذا التمرين سيساعدني على فهم تفضيلاتك الحسية.',
          type: 'exercise' as const,
        },
        {
          content: 'الآن دعنا نختبر قدرتك على التركيز. سأعرض عليك سلسلة من الكلمات وأريد منك أن تختار الكلمات ذات الصلة.',
          type: 'exercise' as const,
        },
        {
          content: 'ممتاز! الآن دعنا نختبر قدرتك على التعرف على الأنماط. سأعرض عليك نمطاً وأريد منك أن تتوقع الخطوة التالية.',
          type: 'exercise' as const,
        },
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: randomResponse.content,
        timestamp: new Date(),
        type: randomResponse.type,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);

      if (randomResponse.type === 'exercise') {
        onExerciseStart?.(randomResponse.type);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#050508] to-[#020203] relative">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-[#00f3ff]/10 border border-[#00f3ff]/30 text-[#e0e0e0]'
                  : 'glass-card border-[#ff00e5]/30'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs text-[#64748b] mt-2 block">
                {message.timestamp.toLocaleTimeString('ar-SA', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-end">
            <div className="glass-card border-[#ff00e5]/30 px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#00f3ff]" />
                <span className="text-sm text-[#e0e0e0]">جاري التحليل...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-[#00f3ff]/20 p-4 bg-[#050508]/50 backdrop-blur">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            disabled={isLoading}
            className="flex-1 bg-[#00f3ff]/5 border-[#00f3ff]/30 text-[#e0e0e0] placeholder-[#64748b]"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="neural-btn px-4 py-2 h-10"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

        {/* Quick Actions */}
        <div className="mt-3 flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-[#00f3ff]/30 text-[#00f3ff] hover:bg-[#00f3ff]/10"
            onClick={() => {
              setInput('ابدأ بتمرين جديد');
            }}
          >
            <Zap className="w-3 h-3 mr-1" />
            تمرين جديد
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-[#ff00e5]/30 text-[#ff00e5] hover:bg-[#ff00e5]/10"
            onClick={() => {
              setInput('أرني النتائج');
            }}
          >
            عرض النتائج
          </Button>
        </div>
      </div>
    </div>
  );
}
