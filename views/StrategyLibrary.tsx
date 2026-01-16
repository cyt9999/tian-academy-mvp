
import React from 'react';
import { Shield, TrendingUp, Zap, HelpCircle, Star, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const strategies = [
  {
    title: '現金擔保看跌 (CSP)',
    subtitle: '新手收租首選',
    icon: <Shield className="text-emerald-500" />,
    difficulty: 2,
    capital: '中高',
    principle: '你承諾在某個價格買入股票，對方付你一筆「定金」（權利金）。',
    bestFor: '想低價接好股，或者想穩定賺取現金流的投資者。',
    greekFocus: 'Delta (控制在 0.15 - 0.2 之間)',
    color: 'emerald'
  },
  {
    title: '備兌看漲 (Covered Call)',
    subtitle: '持股加薪計畫',
    icon: <TrendingUp className="text-sky-500" />,
    difficulty: 2,
    capital: '最高 (需持 100 股)',
    principle: '你已經持有股票，再賣出看漲期權，就像把房子租出去收房租。',
    bestFor: '長期持有者，想在股價盤整或緩漲時增加收益。',
    greekFocus: 'Theta (每日時間價值流逝就是你的收入)',
    color: 'sky'
  },
  {
    title: '輪轉策略 (The Wheel)',
    subtitle: '複利終極閉環',
    icon: <Zap className="text-amber-500" />,
    difficulty: 5,
    capital: '高',
    principle: 'CSP 與 CC 的循環切換。接到股票就賣 CC，股票被收走就賣 CSP。',
    bestFor: '想建立長期自動化複利系統的進階玩家。',
    greekFocus: '管理多階段的 Delta 與 Theta 平衡',
    color: 'amber'
  },
  {
    title: '垂直價差 (Spreads)',
    subtitle: '小資金對沖神器',
    icon: <Target className="text-rose-500" />,
    difficulty: 3,
    capital: '低',
    principle: '買入一個期權同時賣出另一個，鎖定風險上限與獲利空間。',
    bestFor: '市場劇烈震盪時，想精確控制虧損的投資者。',
    greekFocus: 'Gamma (注意靠近到期日時的波動風險)',
    color: 'rose'
  }
];

// Fix: Using React.FC to properly type StrategyCard props, which allows standard React props like 'key' during list rendering.
const StrategyCard: React.FC<{ strat: typeof strategies[0] }> = ({ strat }) => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8 hover:border-emerald-500/30 transition-all group flex flex-col h-full relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${strat.color}-500/5 blur-[60px] pointer-events-none`}></div>
    
    <div className="flex items-center gap-4 mb-6">
      <div className={`p-4 rounded-2xl bg-${strat.color}-500/10 text-${strat.color}-500`}>
        {strat.icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">{strat.title}</h3>
        <p className={`text-xs font-bold text-${strat.color}-500/80 uppercase tracking-widest`}>{strat.subtitle}</p>
      </div>
    </div>

    <div className="space-y-4 flex-1">
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">核心原理</p>
        <p className="text-sm text-slate-300 leading-relaxed">{strat.principle}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">適合對象</p>
        <p className="text-sm text-slate-400 leading-relaxed">{strat.bestFor}</p>
      </div>
    </div>

    <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500">難度等級</span>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={10} className={i < strat.difficulty ? 'text-amber-500 fill-amber-500' : 'text-slate-700'} />
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500">資金需求</span>
        <span className="text-slate-200 font-bold">{strat.capital}</span>
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500">Greeks 重點</span>
        <span className={`text-${strat.color}-400 font-bold`}>{strat.greekFocus}</span>
      </div>
    </div>

    <Link to="/lab" className="mt-6 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all group-hover:shadow-lg group-hover:shadow-emerald-500/10">
      前往模擬實驗 <ArrowRight size={14} />
    </Link>
  </div>
);

const StrategyLibrary: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      <header className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white">策略原理圖書館</h1>
        <p className="text-slate-400">
          天哥將複雜的金融工具拆解為直觀的圖卡。
          <br />從零開始，選擇你的第一條複利之路。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
        {strategies.map((strat, i) => (
          <StrategyCard key={i} strat={strat} />
        ))}
      </div>

      <section className="bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-10">
        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-500/20 flex-shrink-0">
          <HelpCircle size={40} className="text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">還是不知道如何開始？</h3>
          <p className="text-slate-400 mb-6 max-w-xl">
            天哥建議新手從 <strong>現金擔保看跌 (CSP)</strong> 開始。這是在「低價接好股」的同時，還能賺取權利金的最穩健方式。
          </p>
          <Link to="/learning" className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors">
            觀看新手教學第一課 <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default StrategyLibrary;
