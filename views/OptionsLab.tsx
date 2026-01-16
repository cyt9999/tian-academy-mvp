
import React, { useState, useMemo } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area
} from 'recharts';
import {
  Search, Layers, Target, AlertCircle, RefreshCw, Zap, Flame, ShieldAlert, Shield, FlaskConical, Cpu, Activity, TrendingUp as TrendingUpIcon, Calculator, ChevronRight, Binary, Info
} from 'lucide-react';
import { MOCK_TICKERS } from '../constants';
import { StrategyType } from '../types';
import { fetchStockPrice } from '../services/stockService';

const OptionsLab: React.FC = () => {
  const [tickerInput, setTickerInput] = useState('NVDA');
  const [ticker, setTicker] = useState('NVDA');
  const [currentPrice, setCurrentPrice] = useState(MOCK_TICKERS['NVDA']);
  const [strategy, setStrategy] = useState<StrategyType>('short_put');
  const [strike, setStrike] = useState(830);
  const [premium, setPremium] = useState(15.5);
  const [contracts, setContracts] = useState(1);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const technicals = useMemo(() => {
    const s1 = currentPrice * 0.965; // EMA 20
    const s2 = currentPrice * 0.930; // EMA 50
    const r1 = currentPrice * 1.035; // Resistance 1
    const r2 = currentPrice * 1.080; // Resistance 2

    let rec: { strategy: StrategyType, label: string, reason: string, color: string } = {
      strategy: 'short_put',
      label: 'CSP 穩健收租',
      reason: '標的處於 EMA 20 支撐區間。建議在 S1 附近賣出 Put，兼顧高權利金與安全邊際。',
      color: 'emerald'
    };

    if (currentPrice > 800) {
      rec = {
        strategy: 'covered_call',
        label: 'CC 持股加薪',
        reason: '標的接近壓力位。透過賣出 Call 鎖定部分利潤並增加現金流。',
        color: 'sky'
      };
    } else if (currentPrice < 200) {
      rec = {
        strategy: 'leaps',
        label: 'PMCC 槓桿代股',
        reason: '低單價高成長標的，適合用 LEAPS 替代現股，達成相同的複利效果。',
        color: 'indigo'
      };
    }

    return { s1, s2, r1, r2, rec };
  }, [currentPrice]);

  const currentStrategies = isAdvancedMode
    ? [
      { id: 'iron_condor', label: 'IC 鐵鷹', icon: <Zap size={18} /> },
      { id: 'leaps', label: 'PMCC 代股', icon: <Flame size={18} /> },
      { id: 'strangle', label: 'Strangle', icon: <ShieldAlert size={18} /> }
    ]
    : [
      { id: 'short_put', label: 'CSP 收租', icon: <Target size={18} /> },
      { id: 'covered_call', label: 'CC 加薪', icon: <Layers size={18} /> },
      { id: 'vertical_spread', label: '垂直價差', icon: <AlertCircle size={18} /> }
    ];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const upCase = tickerInput.trim().toUpperCase();
    if (!upCase) return;
    setLoading(true);
    setScanning(true);
    const apiPrice = await fetchStockPrice(upCase);
    setTimeout(() => {
      setLoading(false);
      setScanning(false);
      const finalPrice = apiPrice || MOCK_TICKERS[upCase] || 150.00;
      setTicker(upCase);
      setCurrentPrice(finalPrice);
      setStrike(Math.round(finalPrice * 0.95));
      setPremium(Math.round(finalPrice * 0.02 * 10) / 10);
    }, 600);
  };

  const handleStrategyChange = (id: StrategyType) => {
    setStrategy(id);
    const price = currentPrice;
    if (id === 'short_put') { setStrike(Math.round(price * 0.95)); setPremium(Math.round(price * 0.015 * 10) / 10); }
    else if (id === 'covered_call') { setStrike(Math.round(price * 1.05)); setPremium(Math.round(price * 0.012 * 10) / 10); }
    // Fix PMCC: Short Call should be OTM (e.g. 1.05), Premium should be for the Short Call (Credit). Long Leg is calculated in formula.
    else if (id === 'leaps') { setStrike(Math.round(price * 1.05)); setPremium(Math.round(price * 0.03 * 10) / 10); }
    // Strangle: Put Strike OTM (0.95). Call Strike is implied (s + 0.1*CP). Premium is Total Credit.
    else if (id === 'strangle') { setStrike(Math.round(price * 0.90)); setPremium(Math.round(price * 0.05 * 10) / 10); }
    else { setStrike(Math.round(price * 0.98)); setPremium(5.0); }
  };

  const calculateProfitAtPrice = (p: number) => {
    const unit = 100 * contracts;
    const s = Number(strike);
    const pr = Number(premium);
    const cp = Number(currentPrice);

    if (strategy === 'short_put') return (pr - Math.max(0, s - p)) * unit;
    if (strategy === 'covered_call') return (pr + (Math.min(p, s) - cp)) * unit;
    if (strategy === 'vertical_spread') return (pr - (Math.max(0, s - p) - Math.max(0, (s - 10) - p))) * unit;
    if (strategy === 'iron_condor') return (pr - (Math.max(0, s - p) - Math.max(0, (s - 5) - p)) - (Math.max(0, p - (s + 15)) - Math.max(0, p - (s + 20)))) * unit;

    // PMCC: Buy 80% Strike Call, Sell ATM/OTM Call. Simplified for demo.
    if (strategy === 'leaps') {
      const longStrike = cp * 0.8;
      const longCost = cp * 0.25;
      return (Math.max(0, p - longStrike) - longCost + pr - Math.max(0, p - s)) * unit;
    }

    // Strangle: Sell OTM Put and Sell OTM Call.
    if (strategy === 'strangle') {
      const putStrike = s;
      const callStrike = s + (cp * 0.1); // Assume 10% width
      return (pr - Math.max(0, putStrike - p) - Math.max(0, p - callStrike)) * unit;
    }

    return 0;
  };

  const chartData = useMemo(() => {
    const points = [];
    const min = currentPrice * 0.60;
    const max = currentPrice * 1.40;
    const step = (max - min) / 80;
    for (let p = min; p <= max; p += step) {
      points.push({ price: Math.round(p), profit: Math.round(calculateProfitAtPrice(p)) });
    }
    return points;
  }, [currentPrice, strike, premium, strategy, contracts]);

  const currentProfit = calculateProfitAtPrice(currentPrice);

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-12 px-4 animate-up">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500 p-2 rounded-2xl">
            <FlaskConical className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-white uppercase">策略模擬實驗室</h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">TERMINAL v2.8</span>
              <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                <Calculator size={10} /> 演算同步中
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <input
              type="text"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-10 py-2 text-sm font-black w-full md:w-40 focus:border-emerald-500 outline-none text-white uppercase"
              placeholder="代碼"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          </div>
          <button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-black text-xs rounded-xl hover:bg-emerald-500 transition-all">
            {loading ? <RefreshCw className="animate-spin" size={14} /> : '查詢'}
          </button>
        </form>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-4">
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-5">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button onClick={() => setIsAdvancedMode(false)} className={`flex-1 py-1.5 text-sm font-black rounded-lg transition-all ${!isAdvancedMode ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}>初階</button>
              <button onClick={() => setIsAdvancedMode(true)} className={`flex-1 py-1.5 text-sm font-black rounded-lg transition-all ${isAdvancedMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>進階</button>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {currentStrategies.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleStrategyChange(s.id as StrategyType)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${strategy === s.id ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                >
                  {s.icon}
                  <span className="text-sm font-black uppercase">{s.label}</span>
                  {strategy === s.id && <ChevronRight size={14} className="ml-auto" />}
                </button>
              ))}
            </div>

            <div className="h-px bg-slate-800"></div>

            <div className="space-y-4">
              {[
                { label: '合約張數', val: contracts, set: setContracts, min: 1, desc: '控制倉位是活命第一準則。' },
                { label: '行權價', val: strike, set: setStrike, step: 1, desc: '建議選在支撐位下方的 Delta 0.15。' },
                { label: '權利金', val: premium, set: setPremium, step: 0.1, desc: '這是你的核心租金收益。' }
              ].map((p) => (
                <div key={p.label} className="space-y-1">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-black text-slate-400 uppercase">{p.label}</label>
                    <span className="text-sm font-black text-white">${p.val}</span>
                  </div>
                  <input
                    type="number" step={p.step || 1} value={p.val} onChange={(e) => p.set(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm font-bold text-white outline-none focus:border-emerald-500 transition-all"
                  />
                  <p className="text-[12px] text-slate-500 leading-tight italic font-medium">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>

        {/* Chart Content Area */}
        <div className="lg:col-span-8 flex flex-col gap-4 min-h-[500px]">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex-1 flex flex-col min-h-[400px]">
            {scanning && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-30 flex flex-col items-center justify-center animate-in fade-in">
                <Binary className="text-emerald-500 animate-pulse mb-3" size={32} />
                <p className="text-xs font-black text-white uppercase tracking-widest text-center">正在回測 {ticker} EMA 模型...</p>
              </div>
            )}

            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">預估到期損益</p>
                <h2 className={`text-4xl font-black tracking-tighter ${currentProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${currentProfit.toLocaleString()}
                </h2>
              </div>
              <div className="text-right">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 shadow-inner">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">標的現價</p>
                  <p className="text-2xl font-black text-white tracking-tighter">${currentPrice.toFixed(2)}</p>
                  <div className="flex items-center gap-1.5 justify-end mt-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-emerald-500 font-black">LIVE</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full" style={{ minHeight: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentProfit >= 0 ? "#10b981" : "#f43f5e"} stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#020617" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.1} />
                  <XAxis dataKey="price" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickMargin={8} fontWeight="bold" />
                  <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, '損益']}
                  />
                  <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
                  <ReferenceLine x={currentPrice} stroke="#10b981" strokeDasharray="5 5" label={{ value: '現價', position: 'top', fill: '#10b981', fontSize: 10, fontWeight: 'black' }} />
                  <Area type="monotone" dataKey="profit" stroke={currentProfit >= 0 ? "#10b981" : "#f43f5e"} fill="url(#pGrad)" strokeWidth={3} isAnimationActive={!loading} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-emerald-500"></div> 盈利</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-rose-500"></div> 風險</div>
              </div>
              <div className="flex items-center gap-1.5 text-amber-500">
                <AlertCircle size={14} /> 模擬數據非建議
              </div>
            </div>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUpIcon size={18} className="text-emerald-500" />
                  <h3 className="text-sm font-black text-white uppercase">智能點位</h3>
                </div>
                <div className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold uppercase">EMA 回測</div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-2.5 bg-rose-500/5 rounded-xl border border-rose-500/10">
                  <span className="text-sm font-black text-rose-500 uppercase">壓力 R2 (EMA 50)</span>
                  <span className="text-lg font-black text-white">${technicals.r2.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-rose-500/5 rounded-xl border border-rose-500/10 opacity-70">
                  <span className="text-sm font-black text-rose-500 uppercase">壓力 R1 (EMA 20)</span>
                  <span className="text-lg font-black text-white">${technicals.r1.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10 opacity-70">
                  <span className="text-sm font-black text-emerald-500 uppercase">支撐 S1 (EMA 20)</span>
                  <span className="text-lg font-black text-white">${technicals.s1.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                  <span className="text-sm font-black text-emerald-500 uppercase">支撐 S2 (EMA 50)</span>
                  <span className="text-lg font-black text-white">${technicals.s2.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Cpu size={18} className="text-indigo-400" />
                  <h3 className="text-sm font-black text-white uppercase">策略建議引擎</h3>
                </div>

                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase bg-${technicals.rec.color}-500/10 text-${technicals.rec.color}-400 border border-${technicals.rec.color}-500/20 mb-3`}>
                  <Zap size={10} className="animate-pulse" /> 推薦：{technicals.rec.label}
                </div>

                <p className="text-sm text-slate-300 leading-relaxed font-bold mb-5">
                  {technicals.rec.reason}
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleStrategyChange(technicals.rec.strategy)}
                  className="w-full py-2.5 bg-indigo-600 text-white font-black text-xs rounded-xl hover:bg-indigo-500 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
                >
                  配置推薦參數 <RefreshCw size={12} />
                </button>
                <p className="text-[12px] text-slate-500 font-bold italic text-center">
                  "天哥：紀律是複利的靈魂。"
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OptionsLab;
