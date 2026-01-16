
import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, ExternalLink, Bot, Sparkles, RefreshCw } from 'lucide-react';
import { askTianAI } from '../services/geminiService';
import { Message } from '../types';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '你好！我是天哥的智慧替身。在這裡你可以問我任何關於期權、複利投資以及我的課程內容。今天想聊聊什麼標的？', 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
    const response = await askTianAI(input, history);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: Date.now() }]);
  };

  const handleClear = () => {
    setMessages([{ 
      role: 'assistant', 
      content: '對話已重置。你好，我是天哥，準備好開始複利之旅了嗎？', 
      timestamp: Date.now() 
    }]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Bot className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              天哥智慧替身
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full border border-emerald-500/20">Powered by Gemini</span>
            </h1>
            <p className="text-xs text-slate-500">基於天哥數百小時影片教學訓練的 AI 導師</p>
          </div>
        </div>
        <button 
          onClick={handleClear}
          className="p-2 text-slate-500 hover:text-emerald-400 transition-colors"
          title="重置對話"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${
                  msg.role === 'user' ? 'bg-slate-700 text-white' : 'bg-emerald-500 text-white'
                }`}>
                  {msg.role === 'user' ? '我' : '天'}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                }`}>
                  {msg.content}
                  {msg.role === 'assistant' && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50 flex flex-wrap gap-2">
                      <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-emerald-400 flex items-center gap-1">
                        <ExternalLink size={10} /> 影片來源: 期權實戰課程 #12
                      </span>
                      <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-amber-400 flex items-center gap-1">
                        <Sparkles size={10} /> 複利建議
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-4 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">天</div>
                <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700 flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-slate-950/50 border-t border-slate-800">
          <div className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="輸入你的期權疑問，例如：'Sell Put 要選多少 Delta 比較好？'"
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-emerald-500 transition-all resize-none max-h-32 group-hover:border-slate-600 shadow-inner"
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-3 bottom-3 p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Delta 0.15 心法', '如何滾倉？', 'IV 高時怎麼做？', 'CSP 的風險'].map((suggest) => (
              <button 
                key={suggest}
                onClick={() => setInput(suggest)}
                className="text-[10px] px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-400 hover:bg-slate-700 hover:text-emerald-400 transition-all"
              >
                {suggest}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
