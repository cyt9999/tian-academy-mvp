
import React from 'react';
import { TrendingUp, Users, Award, Play, AlertCircle, Calendar, Youtube, ExternalLink, Clock, Plus } from 'lucide-react';
import { MOCK_LESSONS } from '../constants';

const TIAN_AVATAR = "https://yt3.googleusercontent.com/nDtRiMCLFt8YctXzJVUr2ZJ0d43GW_x9CRScw1C_pVqFkxh1fxu0dXqy7kk6ws-0jtmgChQLsw=s900-c-k-c0x00ffffff-no-rj";

const StatCard = ({ title, value, change, icon, color }: { title: string, value: string, change: string, icon: React.ReactNode, color: string }) => (
  <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-emerald-500/30 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-1.5 py-0.5 rounded">
        {change}
      </span>
    </div>
    <h3 className="text-slate-400 text-xs font-medium mb-1">{title}</h3>
    <p className="text-xl font-bold text-slate-100 tracking-tight">{value}</p>
  </div>
);

const CalendarItem = ({ date, time, title, status }: { date: string, time: string, title: string, status?: 'live' | 'upcoming' }) => (
  <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-emerald-500/30 transition-all flex items-center gap-3 group">
    <div className="flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 min-w-[50px]">
      <span className="text-[8px] text-slate-500 font-bold uppercase">{date.split(' ')[0]}</span>
      <span className="text-base font-bold text-white leading-none">{date.split(' ')[1]}</span>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        {status === 'live' && (
          <span className="text-[8px] font-bold text-white bg-rose-600 px-1 py-0.5 rounded uppercase tracking-wider">
            Live
          </span>
        )}
        <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
          <Clock size={10} /> {time}
        </span>
      </div>
      <h4 className="text-sm font-bold text-slate-200 line-clamp-1">{title}</h4>
    </div>
    <button className="p-2 text-slate-500 hover:text-emerald-500 transition-all">
      <Plus size={16} />
    </button>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <section className="space-y-4">
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs shadow-sm">
          <AlertCircle size={18} className="flex-shrink-0" />
          <p>
            <span className="font-bold">天哥提醒：</span> 教學用版本，數據為模擬值，僅供學習使用。
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl border-2 border-emerald-500 overflow-hidden shadow-lg shadow-emerald-500/20">
               <img src={TIAN_AVATAR} alt="Tian" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1 tracking-tight">早安，Enrique 同學</h1>
              <p className="text-slate-500 text-sm font-medium italic">"慢慢來，比較快。今天的進步是明天的複利。"</p>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">Streak: 12 Days 🔥</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="預期複利收益" value="$12,450" change="+12%" icon={<TrendingUp size={18} />} color="text-emerald-500 bg-emerald-500" />
          <StatCard title="學習總時數" value="48.5h" change="+3h" icon={<Play size={18} />} color="text-sky-500 bg-sky-500" />
          <StatCard title="完成作業數" value="12 / 15" change="80%" icon={<Award size={18} />} color="text-amber-500 bg-amber-500" />
          <StatCard title="社群影響力" value="Top 5%" change="Impact" icon={<Users size={18} />} color="text-indigo-500 bg-indigo-500" />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Play className="text-emerald-500" size={20} /> 繼續學習
          </h2>
          
          <div className="grid gap-4">
            {MOCK_LESSONS.slice(0, 2).map((lesson) => (
              <div key={lesson.id} className="group bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition-all flex flex-col sm:flex-row items-center p-4 gap-4 shadow-md">
                <div className="relative w-full sm:w-40 aspect-video rounded-xl overflow-hidden flex-shrink-0">
                  <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-1 w-full space-y-2">
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">{lesson.title}</h3>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 uppercase font-black tracking-widest">{lesson.category}</span>
                    <span className="text-emerald-400 font-bold">65%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[65%]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="text-sky-500" size={20} /> 學院日程
          </h2>
          
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
            <CalendarItem status="live" date="May 12" time="20:00" title="財報季：NVDA 佈局" />
            <CalendarItem date="May 15" time="21:30" title="新手：Sell Put 選股" />
            <CalendarItem date="May 18" time="20:00" title="進階：垂直價差防禦" />
            
            <button className="w-full mt-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-all border border-slate-700">
              完整課程表
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
