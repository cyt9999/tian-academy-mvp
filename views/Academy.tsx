
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Video, Radio, Database, Archive, ShieldAlert } from 'lucide-react';
import LearningCenter from './LearningCenter';
import KnowledgeBase from './KnowledgeBase';

const Academy: React.FC = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'lessons';
  
  // Detect if we are in a lesson detail view
  const isLessonDetail = location.pathname.includes('/academy/lesson/');

  const tabs = [
    { id: 'lessons', label: '課程影片', icon: <Video size={18} />, path: '/academy' },
    { id: 'live', label: '線上直播', icon: <Radio size={18} />, path: '/academy/live' },
    { id: 'knowledge', label: '天哥知識庫', icon: <Database size={18} />, path: '/academy/knowledge' },
    { id: 'resources', label: '相關資源', icon: <Archive size={18} />, path: '/academy/resources' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-up">
      {/* Only show header if NOT in lesson detail */}
      {!isLessonDetail && (
        <header className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-xl backdrop-blur-md">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">智慧教學中心</h1>
            <p className="text-sm text-slate-400">系統化、圖卡化，天哥帶你一步步建立複利思維。</p>
          </div>
          
          <div className="flex bg-slate-950/80 border border-slate-800 p-1.5 rounded-xl w-full lg:w-auto overflow-x-auto shadow-inner">
            {tabs.map((tab) => {
              const isActive = (tab.id === 'lessons' && (location.pathname === '/academy' || location.pathname === '/academy/')) || currentTab === tab.id;
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-emerald-500 text-white shadow-lg' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </header>
      )}

      <div className="min-h-[500px]">
        <Routes>
          <Route path="/" element={<LearningCenter />} />
          <Route path="/lesson/:id" element={<LearningCenter />} />
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/live" element={<div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-500 shadow-2xl">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
              <Radio size={40} className="text-rose-500 animate-pulse" />
            </div>
            <h2 className="text-lg font-bold text-slate-300">目前 YouTube 頻道暫無直播</h2>
            <p className="text-sm mt-2 max-w-sm mx-auto leading-relaxed">請留意 YouTube 訂閱通知與 Discord 頻道快訊。天哥通常在美股開盤前後進行實戰解析。</p>
            <button className="mt-8 px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all">前往天哥 YouTube 頻道</button>
          </div>} />
          <Route path="/resources" element={<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Delta 概率對照表.pdf', '新手 CSP 紀錄表.xlsx', '複利成長追蹤器.app', '倉位計算工具.exe'].map((item, i) => (
              <div key={i} className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center justify-between group hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg">
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{item}</span>
                <Archive size={18} className="text-slate-600 group-hover:text-emerald-500" />
              </div>
            ))}
          </div>} />
        </Routes>
      </div>

      {!isLessonDetail && (
        <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl flex items-center gap-3 text-amber-500/80">
          <ShieldAlert size={18} className="flex-shrink-0" />
          <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
            版權聲明：本學院所有影音內容僅供付費學員學習使用，嚴禁私自錄屏傳播，違者必究。
          </p>
        </div>
      )}
    </div>
  );
};

export default Academy;
