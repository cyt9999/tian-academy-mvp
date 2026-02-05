<script setup lang="ts">
import { Book, Shield, TrendingUp, Zap, Target, Star, Search, ArrowRight, Info } from 'lucide-vue-next'
import { STRATEGY_MATRIX } from '@/constants'

const strategies = [
  {
    title: '現金擔保看跌 (CSP)',
    subtitle: '新手收租首選',
    icon: 'Shield',
    difficulty: 2,
    capital: '中高',
    principle: '你承諾在某個價格買入股票，對方付你一筆「定金」（權利金）。',
    bestFor: '想低價接好股，或者想穩定賺取現金流的投資者。',
    greekFocus: 'Delta (建議選 0.15)',
    tianMindset: '想接股才賣 Put，不接股就是純收租。',
    color: 'emerald'
  },
  {
    title: '備兌看漲 (CC)',
    subtitle: '持股加薪計畫',
    icon: 'TrendingUp',
    difficulty: 2,
    capital: '最高 (100股)',
    principle: '你已經持有股票，再賣出看漲期權，就像把房子租出去收房租。',
    bestFor: '長期持有者，想在股價盤整或緩漲時增加額外收益。',
    greekFocus: 'Theta (每日時間流逝收益)',
    tianMindset: '股價不動也能賺，這是我們持股者的額外獎金。',
    color: 'sky'
  },
  {
    title: '輪轉策略 (Wheel)',
    subtitle: '複利終極閉環',
    icon: 'Zap',
    difficulty: 5,
    capital: '高',
    principle: 'CSP 與 CC 的循環切換。接到股票就賣 CC，股票被收走就賣 CSP。',
    bestFor: '想建立長期自動化複利系統的進階玩家。',
    greekFocus: 'Delta/Theta 均衡管理',
    tianMindset: '這是建立資產帝國的基石，持之以恆就是複利。',
    color: 'amber'
  },
  {
    title: '垂直價差 (Spreads)',
    subtitle: '小資避險神器',
    icon: 'Target',
    difficulty: 3,
    capital: '低',
    principle: '買入一個期權同時賣出另一個，鎖定風險上限與獲利空間。',
    bestFor: '市場劇烈震盪時，想精確控制最大虧損的投資者。',
    greekFocus: 'Gamma (防禦風險控制)',
    tianMindset: '買份保險，睡得更香。盈虧比是價差的核心。',
    color: 'rose'
  }
]

const terms = [
  { term: 'Delta', def: '到期處於實值的機率估算。天哥建議 CSP 選 0.15，代表 85% 機率純收租。' },
  { term: 'Theta', def: '時間價值的流逝速度。身為賣家，Theta 是我們每天睡覺都在賺錢的好朋友。' },
  { term: 'IV (隱含波動率)', def: '市場對未來波動的預期。IV 高時權利金更肥，是賣家的進場良機。' },
  { term: 'Strike Price (行權價)', def: '約定買入或賣出的核心價格。選行權價就是選「安全邊際」。' }
]
</script>

<template>
  <div class="space-y-12 pb-10">
    <section>
      <div class="flex items-center gap-2 mb-8 border-b border-slate-800 pb-3">
        <Book class="text-emerald-500" :size="24" />
        <h2 class="text-xl font-bold text-white">策略原理圖書館</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div
          v-for="(s, i) in strategies"
          :key="i"
          class="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] hover:border-emerald-500/30 transition-all group flex flex-col h-full shadow-2xl relative overflow-hidden"
        >
          <div :class="`absolute -top-12 -right-12 w-32 h-32 bg-${s.color}-500/10 blur-[60px] pointer-events-none group-hover:bg-${s.color}-500/20 transition-all`"></div>

          <div class="flex items-center gap-4 mb-6">
            <div :class="`w-12 h-12 rounded-2xl flex items-center justify-center text-${s.color}-500 bg-${s.color}-500/10 border border-${s.color}-500/20 shadow-inner group-hover:scale-110 transition-transform`">
              <Shield v-if="s.icon === 'Shield'" :size="20" />
              <TrendingUp v-if="s.icon === 'TrendingUp'" :size="20" />
              <Zap v-if="s.icon === 'Zap'" :size="20" />
              <Target v-if="s.icon === 'Target'" :size="20" />
            </div>
            <div>
              <h3 class="text-base font-bold text-white leading-tight">{{ s.title }}</h3>
              <p :class="`text-[10px] font-bold text-${s.color}-500 uppercase tracking-widest`">{{ s.subtitle }}</p>
            </div>
          </div>

          <div class="space-y-4 flex-1">
            <div>
              <p class="text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5"><Info :size="10" /> 核心原理</p>
              <p class="text-[12px] text-slate-300 leading-relaxed font-medium">{{ s.principle }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-500 uppercase mb-1.5">適合對象</p>
              <p class="text-[12px] text-slate-400 leading-relaxed">{{ s.bestFor }}</p>
            </div>
          </div>

          <div class="mt-6 pt-5 border-t border-slate-800 space-y-3">
            <div class="flex justify-between items-center text-[10px]">
              <span class="text-slate-500 uppercase font-bold">難度</span>
              <div class="flex gap-0.5">
                <Star
                  v-for="idx in 5"
                  :key="idx"
                  :size="10"
                  :class="idx <= s.difficulty ? 'text-amber-500 fill-amber-500' : 'text-slate-800'"
                />
              </div>
            </div>
            <div class="flex justify-between items-center text-[10px]">
              <span class="text-slate-500 uppercase font-bold">Greeks 重點</span>
              <span :class="`text-${s.color}-400 font-bold`">{{ s.greekFocus }}</span>
            </div>
          </div>

          <router-link
            to="/lab"
            :class="`mt-6 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-${s.color}-600 text-white text-xs font-bold rounded-2xl transition-all shadow-lg`"
          >
            前往模擬實驗 <ArrowRight :size="14" />
          </router-link>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section class="bg-slate-900/40 border-2 border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] pointer-events-none"></div>
        <div class="flex items-center gap-2 mb-8">
          <Zap class="text-emerald-500" :size="20" />
          <h2 class="text-sm font-bold text-white uppercase tracking-widest">策略與 Greeks 實戰矩陣</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="border-b border-slate-800">
              <tr class="text-slate-500 font-bold uppercase tracking-widest">
                <th class="pb-4 pl-2">策略路徑</th>
                <th class="pb-4">資本需求</th>
                <th class="pb-4 text-right pr-2">監控核心</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/50">
              <tr
                v-for="(strat, i) in STRATEGY_MATRIX"
                :key="i"
                class="hover:bg-emerald-500/5 transition-all group"
              >
                <td class="py-4 pl-2 font-bold text-slate-300 group-hover:text-emerald-400 transition-colors">{{ strat.name }}</td>
                <td class="py-4 text-slate-500">{{ strat.capital }}</td>
                <td class="py-4 text-right pr-2 text-emerald-500 font-mono font-bold tracking-tight">{{ strat.greeks }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-6 p-4 bg-slate-950/50 rounded-2xl border border-slate-800 text-[10px] text-slate-500 leading-relaxed font-bold italic">
          "複利不僅僅是利滾利，更是對風險的精確掌控。監控 Greeks，就是監控你的財富自由進度。"
        </div>
      </section>

      <section class="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl flex flex-col">
        <div class="flex items-center gap-2 mb-8">
          <Search class="text-sky-500" :size="20" />
          <h2 class="text-sm font-bold text-white uppercase tracking-widest">期權核心辭典</h2>
        </div>
        <div class="space-y-4 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
          <div
            v-for="(t, i) in terms"
            :key="i"
            class="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 group hover:border-sky-500/30 transition-all shadow-inner"
          >
            <h4 class="text-sm font-bold text-sky-400 mb-2">{{ t.term }}</h4>
            <p class="text-[11px] text-slate-400 leading-relaxed font-medium">{{ t.def }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
