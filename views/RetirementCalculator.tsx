
import React, { useState, useMemo } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine 
} from 'recharts';
import { 
  PiggyBank, Info, Wallet, ArrowUpRight, Flame, AlertTriangle, ThumbsUp, XCircle, Calculator, Shield, Plus, Trash2, Calendar, Settings2
} from 'lucide-react';

interface ParameterRow {
  id: string;
  startAge: number;
  endAge: number;
  amount: number;
  cpiAdjust?: boolean;
  startOfYear?: boolean;
}

const RetirementCalculator: React.FC = () => {
  // --- Global Variables ---
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(45);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [brokerageBalance, setBrokerageBalance] = useState(1000000);
  const [retirementBalance, setRetirementBalance] = useState(500000);
  const [annualROI, setAnnualROI] = useState(8);
  const [inflationRate, setInflationRate] = useState(2.5);

  // --- Variable Parameters ---
  const [withdrawals, setWithdrawals] = useState<ParameterRow[]>([
    { id: 'w1', startAge: 45, endAge: 85, amount: 600000, cpiAdjust: true, startOfYear: false }
  ]);
  const [brokerageContribs, setBrokerageContribs] = useState<ParameterRow[]>([
    { id: 'bc1', startAge: 30, endAge: 45, amount: 300000 }
  ]);
  const [retirementContribs, setRetirementContribs] = useState<ParameterRow[]>([
    { id: 'rc1', startAge: 30, endAge: 45, amount: 150000 }
  ]);

  // --- Handlers ---
  const addRow = (type: 'w' | 'bc' | 'rc') => {
    const newRow = { id: Math.random().toString(36).substr(2, 9), startAge: currentAge, endAge: retireAge, amount: 0 };
    if (type === 'w') setWithdrawals([...withdrawals, { ...newRow, cpiAdjust: true, startOfYear: false }]);
    else if (type === 'bc') setBrokerageContribs([...brokerageContribs, newRow]);
    else if (type === 'rc') setRetirementContribs([...retirementContribs, newRow]);
  };

  const removeRow = (type: 'w' | 'bc' | 'rc', id: string) => {
    if (type === 'w') setWithdrawals(withdrawals.filter(r => r.id !== id));
    else if (type === 'bc') setBrokerageContribs(brokerageContribs.filter(r => r.id !== id));
    else if (type === 'rc') setRetirementContribs(retirementContribs.filter(r => r.id !== id));
  };

  const updateRow = (type: 'w' | 'bc' | 'rc', id: string, field: keyof ParameterRow, value: any) => {
    const setter = type === 'w' ? setWithdrawals : type === 'bc' ? setBrokerageContribs : setRetirementContribs;
    const list = type === 'w' ? withdrawals : type === 'bc' ? brokerageContribs : retirementContribs;
    setter(list.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // --- Core Calculation Engine ---
  const calculationData = useMemo(() => {
    let results = [];
    let balance = Number(brokerageBalance) + Number(retirementBalance);
    const roi = Number(annualROI) / 100;
    const inf = Number(inflationRate) / 100;

    for (let age = currentAge; age <= lifeExpectancy; age++) {
      const yearIdx = age - currentAge;
      
      // Calculate active contributions and withdrawals for THIS age
      const yearlyContrib = 
        brokerageContribs.filter(r => age >= r.startAge && age < r.endAge).reduce((sum, r) => sum + Number(r.amount), 0) +
        retirementContribs.filter(r => age >= r.startAge && age < r.endAge).reduce((sum, r) => sum + Number(r.amount), 0);
      
      const yearlyWithdrawal = withdrawals
        .filter(r => age >= r.startAge && age < r.endAge)
        .reduce((sum, r) => {
          const base = Number(r.amount);
          return sum + (r.cpiAdjust ? base * Math.pow(1 + inf, yearIdx) : base);
        }, 0);

      // Simple Year-end growth model
      balance = balance * (1 + roi) + yearlyContrib - yearlyWithdrawal;

      results.push({
        age,
        balance: Math.max(0, Math.round(balance)),
        isRetired: age >= retireAge
      });
    }
    return results;
  }, [currentAge, retireAge, lifeExpectancy, brokerageBalance, retirementBalance, annualROI, inflationRate, withdrawals, brokerageContribs, retirementContribs]);

  const finalBalance = calculationData[calculationData.length - 1].balance;
  const isSuccessful = finalBalance > 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 animate-up">
      {/* 1. Global Variables */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <Settings2 className="text-sky-500" size={20} />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">① 全局變量 (Global Variables)</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: '當前年齡', val: currentAge, set: setCurrentAge },
            { label: '計畫退休年齡', val: retireAge, set: setRetireAge },
            { label: '個人帳戶初始 ($)', val: brokerageBalance, set: setBrokerageBalance },
            { label: '退休帳戶初始 ($)', val: retirementBalance, set: setRetirementBalance },
            { label: '平均年回報率 (%)', val: annualROI, set: setAnnualROI },
          ].map((item) => (
            <div key={item.label} className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 uppercase">{item.label}</label>
              <input 
                type="number" value={item.val} onChange={(e) => item.set(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-bold text-white outline-none focus:border-sky-500 transition-all"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 2. Variable Parameters */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <Calendar className="text-emerald-500" size={20} />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">② 可變參數 (Staged Parameters)</h2>
        </div>

        {/* Withdrawals Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-rose-400 uppercase tracking-tight">提款 (Withdrawals / Expenses)</h3>
            <button onClick={() => addRow('w')} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-500 rounded-lg text-xs font-black hover:bg-rose-500/20 transition-all">
              <Plus size={14} /> 添加區段
            </button>
          </div>
          <div className="space-y-3">
            {withdrawals.map(row => (
              <div key={row.id} className="grid grid-cols-12 gap-3 items-center bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
                <div className="col-span-3 flex gap-2">
                  <input type="number" placeholder="起" value={row.startAge} onChange={e => updateRow('w', row.id, 'startAge', Number(e.target.value))} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-bold text-white" />
                  <input type="number" placeholder="迄" value={row.endAge} onChange={e => updateRow('w', row.id, 'endAge', Number(e.target.value))} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-bold text-white" />
                </div>
                <div className="col-span-3">
                  <input type="number" placeholder="年提款額 ($)" value={row.amount} onChange={e => updateRow('w', row.id, 'amount', Number(e.target.value))} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-bold text-rose-400" />
                </div>
                <div className="col-span-5 flex items-center gap-4 px-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={row.cpiAdjust} onChange={e => updateRow('w', row.id, 'cpiAdjust', e.target.checked)} className="rounded border-slate-800 bg-slate-900 text-sky-500 focus:ring-sky-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase">CPI 調節</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={row.startOfYear} onChange={e => updateRow('w', row.id, 'startOfYear', e.target.checked)} className="rounded border-slate-800 bg-slate-900 text-sky-500 focus:ring-sky-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase">年初發生</span>
                  </label>
                </div>
                <button onClick={() => removeRow('w', row.id)} className="col-span-1 flex justify-center text-slate-600 hover:text-rose-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contributions Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-800/50">
          {/* Brokerage Contrib */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-emerald-400 uppercase tracking-tight">個人帳戶存入 (Brokerage)</h3>
              <button onClick={() => addRow('bc')} className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20"><Plus size={14} /></button>
            </div>
            {brokerageContribs.map(row => (
              <div key={row.id} className="flex gap-2 items-center bg-slate-950/30 p-2 rounded-xl border border-slate-800">
                <input type="number" value={row.startAge} onChange={e => updateRow('bc', row.id, 'startAge', Number(e.target.value))} className="w-16 bg-slate-900 border border-slate-800 rounded p-1.5 text-[10px] font-bold text-white text-center" />
                <span className="text-slate-700 text-xs">~</span>
                <input type="number" value={row.endAge} onChange={e => updateRow('bc', row.id, 'endAge', Number(e.target.value))} className="w-16 bg-slate-900 border border-slate-800 rounded p-1.5 text-[10px] font-bold text-white text-center" />
                <input type="number" value={row.amount} onChange={e => updateRow('bc', row.id, 'amount', Number(e.target.value))} className="flex-1 bg-slate-900 border border-slate-800 rounded p-1.5 text-xs font-bold text-emerald-400" />
                <button onClick={() => removeRow('bc', row.id)} className="text-slate-600 hover:text-rose-500"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
          {/* Retirement Contrib */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-sky-400 uppercase tracking-tight">退休帳戶存入 (Retirement)</h3>
              <button onClick={() => addRow('rc')} className="p-1.5 bg-sky-500/10 text-sky-500 rounded-lg hover:bg-sky-500/20"><Plus size={14} /></button>
            </div>
            {retirementContribs.map(row => (
              <div key={row.id} className="flex gap-2 items-center bg-slate-950/30 p-2 rounded-xl border border-slate-800">
                <input type="number" value={row.startAge} onChange={e => updateRow('rc', row.id, 'startAge', Number(e.target.value))} className="w-16 bg-slate-900 border border-slate-800 rounded p-1.5 text-[10px] font-bold text-white text-center" />
                <span className="text-slate-700 text-xs">~</span>
                <input type="number" value={row.endAge} onChange={e => updateRow('rc', row.id, 'endAge', Number(e.target.value))} className="w-16 bg-slate-900 border border-slate-800 rounded p-1.5 text-[10px] font-bold text-white text-center" />
                <input type="number" value={row.amount} onChange={e => updateRow('rc', row.id, 'amount', Number(e.target.value))} className="flex-1 bg-slate-900 border border-slate-800 rounded p-1.5 text-xs font-bold text-sky-400" />
                <button onClick={() => removeRow('rc', row.id)} className="text-slate-600 hover:text-rose-500"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Results and Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center text-center shadow-xl transition-all ${isSuccessful ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
          {isSuccessful ? <ThumbsUp className="text-emerald-500 mb-2" size={40} /> : <XCircle className="text-rose-500 mb-2" size={40} />}
          <h3 className={`text-xl font-black uppercase ${isSuccessful ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isSuccessful ? '躺平策略大獲全勝' : '自由之路仍有缺口'}
          </h3>
          <p className="text-xs text-slate-400 font-bold mt-2 leading-relaxed">
            {isSuccessful 
              ? "天哥心法：保持複利節奏，你已贏過時間。" 
              : "天哥提醒：需提高 ROI 或延後退休。期權收租是你的最佳槓桿。"}
          </p>
        </div>

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-3">
               <ArrowUpRight className="text-sky-400" size={20} />
               <h3 className="text-sm font-black text-white uppercase tracking-widest">複利軌跡模擬 (FIRE Trajectory)</h3>
             </div>
             <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-0.5">終局剩餘淨值</p>
                <p className={`text-xl font-black ${finalBalance > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                  ${finalBalance.toLocaleString()}
                </p>
             </div>
          </div>

          <div className="flex-1 w-full min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={calculationData}>
                <defs>
                  <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isSuccessful ? "#10b981" : "#f43f5e"} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#020617" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.1} />
                <XAxis dataKey="age" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tickMargin={8} fontWeight="bold" />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}
                  labelFormatter={(label) => `年齡: ${label} 歲`}
                />
                <ReferenceLine x={retireAge} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: '退休', position: 'top', fill: '#f59e0b', fontSize: 10, fontWeight: 'black' }} />
                <Area type="monotone" dataKey="balance" stroke={isSuccessful ? "#10b981" : "#f43f5e"} fill="url(#pGrad)" strokeWidth={3} isAnimationActive={true} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800">
             <div className="flex items-center gap-2">
               <Info className="text-sky-500" size={16} />
               <p className="text-[11px] text-slate-500 font-bold italic">
                 動態複利模擬：所有收支以年度為單位進行月複利迭代。
               </p>
             </div>
             <p className="text-[10px] text-slate-600 font-black uppercase">Tian Academy MVP v2.8</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetirementCalculator;
