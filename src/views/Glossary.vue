<script setup lang="ts">
import { ref, computed } from 'vue'
import { Book, Search, ArrowRight, Video, Bot } from 'lucide-vue-next'

const searchQuery = ref('')

const terms = [
  {
    term: '合約張數 (Contracts)',
    definition: '期權交易的基本單位。美股期權 1 張合約通常代表 100 股底層股票的權利。',
    tianTip: '新手建議從 1 張開始，嚴格遵守天哥的倉位管理法，不要一次梭哈。',
    relatedLesson: '第一課：CSP 入門'
  },
  {
    term: '權利金 (Premium)',
    definition: '買方支付給賣方的期權價格。對於賣家（如做 CSP/CC）來說，這就是你的「租金收入」。',
    tianTip: '權利金包含了「時間價值」與「內在價值」，我們複利投資者賺的就是時間的錢。',
    relatedLesson: '第三課：輪轉策略'
  },
  {
    term: '行權價 (Strike Price)',
    definition: '雙方約定在未來買入或賣出股票的價格。',
    tianTip: '選行權價就是選「安全邊際」。天哥常說，選在支撐位下方的行權價，接股才安心。',
    relatedLesson: '第一課：Delta 核心概念'
  },
  {
    term: 'Delta',
    definition: '衡量底層股價變動 1 美元時，期權價格的預期變動量。也常被視為期權到期時處於「實值」的概率。',
    tianTip: '賣 Put 時，Delta 0.15-0.2 是天哥的最愛，這代表你有 80% 以上的機率純收租不接股。',
    relatedLesson: '第一課：Delta 核心概念'
  },
  {
    term: 'Theta',
    definition: '衡量期權價值隨時間流逝的速度。對賣家有利，對買家不利。',
    tianTip: 'Theta 是我們最好的朋友。每天睡覺醒來，Theta 都在幫你賺錢。',
    relatedLesson: '第二課：時間價值的秘密'
  }
]

const filteredTerms = computed(() => {
  if (!searchQuery.value.trim()) return terms
  const q = searchQuery.value.toLowerCase()
  return terms.filter(t =>
    t.term.toLowerCase().includes(q) ||
    t.definition.toLowerCase().includes(q) ||
    t.tianTip.toLowerCase().includes(q)
  )
})
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
    <div class="text-center space-y-4">
      <h1 class="text-3xl font-bold text-white flex items-center justify-center gap-3">
        <Book class="text-emerald-500" /> 期權辭典
      </h1>
      <p class="text-slate-400">掌握基礎術語，是開啟複利之門的第一把鑰匙。</p>
    </div>

    <div class="relative mb-12">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜尋術語... (例如: Delta, 權利金)"
        class="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-12 text-sm focus:outline-none focus:border-emerald-500"
      />
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" :size="18" />
    </div>

    <div class="grid gap-6">
      <div
        v-for="(item, i) in filteredTerms"
        :key="i"
        class="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 hover:border-slate-700 transition-all group"
      >
        <h3 class="text-xl font-bold text-emerald-400 mb-4">{{ item.term }}</h3>
        <p class="text-slate-300 mb-6 leading-relaxed">{{ item.definition }}</p>

        <div class="bg-slate-950/50 border border-slate-800/50 rounded-2xl p-5 mb-6">
          <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Bot :size="12" /> 天哥心法
          </p>
          <p class="text-sm text-slate-400 italic">「{{ item.tianTip }}」</p>
        </div>

        <router-link to="/academy" class="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors">
          <Video :size="14" /> 相關教學：{{ item.relatedLesson }} <ArrowRight :size="12" />
        </router-link>
      </div>
    </div>
  </div>
</template>
