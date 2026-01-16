
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  ChevronRight, 
  Clock,
  BookOpen,
  Copy,
  PenLine,
  Save,
  Check
} from 'lucide-react';
import { MOCK_LESSONS } from '../constants';
import { Lesson } from '../types';

const LearningCenter: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const selectedLesson = useMemo(() => 
    MOCK_LESSONS.find(l => l.id === id) || null
  , [id]);

  const handleCopyToNotes = (text: string, time: string, index: number) => {
    setNotes(prev => prev + `\n[${time}] ${text}\n`);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderLessonCard = (lesson: Lesson) => (
    <div 
      key={lesson.id} 
      onClick={() => {
        navigate(`/academy/lesson/${lesson.id}`);
        setNotes('');
      }}
      className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all group cursor-pointer shadow-sm"
    >
      <div className="relative aspect-video">
        <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <Play size={20} fill="white" className="text-white ml-0.5" />
          </div>
        </div>
        <div className="absolute top-3 left-3 px-2 py-0.5 bg-emerald-500 rounded-lg text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
          PHASE {lesson.phase}
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-black text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1 uppercase tracking-tight">{lesson.title}</h3>
        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 font-medium">{lesson.summary}</p>
      </div>
    </div>
  );

  if (selectedLesson) {
    return (
      <div className="max-w-7xl mx-auto animate-up px-1 md:px-0">
        {/* Navigation Header - Minimal */}
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={() => navigate('/academy')}
            className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-widest"
          >
            <ChevronRight size={12} className="rotate-180" /> 返回課程清單
          </button>
          <div className="flex items-center gap-2">
             <span className="text-[8px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-slate-700">
               學員專屬
             </span>
          </div>
        </div>

        {/* Main Content Area: Side-by-side on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          
          {/* Left Column: Video & Metadata (8/12) */}
          <div className="lg:col-span-8 space-y-3">
            {/* Video Player Section */}
            <div className="aspect-video bg-black rounded-3xl border border-slate-800 overflow-hidden relative group shadow-2xl">
              <img src={selectedLesson.thumbnail} alt={selectedLesson.title} className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-transform cursor-pointer">
                  <Play fill="white" className="text-white ml-1" size={24} />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-950/70 backdrop-blur-md p-2.5 rounded-xl border border-white/5">
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-black text-white uppercase tracking-widest truncate max-w-[150px] md:max-w-none">
                     {selectedLesson.title}
                   </span>
                 </div>
                 <span className="text-[10px] font-mono text-slate-400">00:00 / {selectedLesson.duration}</span>
              </div>
            </div>

            {/* Lesson Summary - Concise */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shrink-0">
                  <BookOpen size={16} />
                </div>
                <div>
                  <h2 className="text-base font-black text-white uppercase tracking-tight leading-tight">{selectedLesson.title}</h2>
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">天哥精華課程摘要</p>
                </div>
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed font-medium">
                {selectedLesson.summary}
              </p>
            </div>
          </div>

          {/* Right Column: Sticky Transcription & Notes (4/12) */}
          <div className="lg:col-span-4 lg:sticky lg:top-[70px] space-y-3 h-[calc(100vh-140px)] flex flex-col min-h-[450px]">
            {/* Transcription List */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col flex-[3] overflow-hidden min-h-[200px]">
              <div className="px-3 py-2 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
                <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                  <PenLine size={12} className="text-emerald-500" /> 課程實時筆錄
                </h3>
                <span className="text-[8px] text-slate-500 font-bold uppercase">AI SYNC</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
                {selectedLesson.transcription?.map((line, idx) => (
                  <div key={idx} className="group p-2 bg-slate-950/30 hover:bg-slate-950/60 rounded-xl border border-transparent hover:border-slate-800 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-1 py-0.5 rounded flex items-center gap-1">
                        <Clock size={8} /> {line.time}
                      </span>
                      <button 
                        onClick={() => handleCopyToNotes(line.text, line.time, idx)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-emerald-400 transition-all"
                      >
                        {copiedIndex === idx ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-bold">
                      {line.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Notes Area */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-xl flex flex-col flex-[2] overflow-hidden min-h-[150px]">
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">快速筆記 (WATCH & NOTE)</h4>
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="點擊筆錄快速摘錄..."
                className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-[11px] font-bold text-slate-300 placeholder:text-slate-700 outline-none focus:border-emerald-500 transition-all resize-none shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Materials Section - Full Width Bottom */}
        <div className="mt-6 pt-6 border-t border-slate-800">
           <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-1">學員附件與資源下載</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase">請搭配本週點位進行實戰模擬</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedLesson.materials?.map((m, i) => (
                  <button key={i} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300 rounded-lg border border-slate-700 transition-all flex items-center gap-2">
                     <Save size={12} /> {m}
                  </button>
                ))}
              </div>
              <div className="hidden md:block">
                 <p className="text-[9px] text-emerald-600 font-black uppercase italic text-right max-w-[200px]">
                   "複利是對風險的精確掌控。監控 Greeks，監控你的財富自由進度。"
                 </p>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">複利學習路徑</h1>
          <p className="text-sm text-slate-500 font-medium italic mt-1">從種子到參天大樹，天哥系統化教學體系。</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">已解鎖</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-slate-800"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">未解鎖</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(p => (
          <section key={p} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center font-black text-emerald-500 text-[11px] border border-emerald-500/20">{p}</div>
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {p === 1 ? '複利萌芽' : p === 2 ? '穩健收租' : '策略優化'}
              </h2>
            </div>
            <div className="space-y-4">
              {MOCK_LESSONS.filter(l => l.phase === p).map(renderLessonCard)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default LearningCenter;
