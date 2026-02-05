<script setup lang="ts">
import { TrendingUp, Users, Award, Play, AlertCircle, Calendar, Clock, Plus } from 'lucide-vue-next'
import { MOCK_LESSONS } from '@/constants'

const TIAN_AVATAR = "https://yt3.googleusercontent.com/nDtRiMCLFt8YctXzJVUr2ZJ0d43GW_x9CRScw1C_pVqFkxh1fxu0dXqy7kk6ws-0jtmgChQLsw=s900-c-k-c0x00ffffff-no-rj"

const stats = [
  { title: '預期複利收益', value: '$12,450', change: '+12%', icon: 'TrendingUp', color: 'text-emerald-500 bg-emerald-500' },
  { title: '學習總時數', value: '48.5h', change: '+3h', icon: 'Play', color: 'text-sky-500 bg-sky-500' },
  { title: '完成作業數', value: '12 / 15', change: '80%', icon: 'Award', color: 'text-amber-500 bg-amber-500' },
  { title: '社群影響力', value: 'Top 5%', change: 'Impact', icon: 'Users', color: 'text-indigo-500 bg-indigo-500' },
]

const calendarItems = [
  { status: 'live' as const, date: 'May 12', time: '20:00', title: '財報季：NVDA 佈局' },
  { date: 'May 15', time: '21:30', title: '新手：Sell Put 選股' },
  { date: 'May 18', time: '20:00', title: '進階：垂直價差防禦' },
]
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
    <section class="space-y-4">
      <div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs shadow-sm">
        <AlertCircle :size="18" class="flex-shrink-0" />
        <p>
          <span class="font-bold">天哥提醒：</span> 教學用版本，數據為模擬值，僅供學習使用。
        </p>
      </div>

      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 md:w-16 md:h-16 rounded-2xl border-2 border-emerald-500 overflow-hidden shadow-lg shadow-emerald-500/20">
            <img :src="TIAN_AVATAR" alt="Tian" class="w-full h-full object-cover" />
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-bold mb-1 tracking-tight">早安，Enrique 同學</h1>
            <p class="text-slate-500 text-sm font-medium italic">"慢慢來，比較快。今天的進步是明天的複利。"</p>
          </div>
        </div>
        <div class="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span class="text-xs font-bold text-slate-300 tracking-wider uppercase">Streak: 12 Days 🔥</span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="stat in stats"
          :key="stat.title"
          class="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-emerald-500/30 transition-all group"
        >
          <div class="flex justify-between items-start mb-4">
            <div :class="['p-2.5 rounded-xl bg-opacity-10 text-opacity-100', stat.color]">
              <TrendingUp v-if="stat.icon === 'TrendingUp'" :size="18" />
              <Play v-if="stat.icon === 'Play'" :size="18" />
              <Award v-if="stat.icon === 'Award'" :size="18" />
              <Users v-if="stat.icon === 'Users'" :size="18" />
            </div>
            <span class="text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-1.5 py-0.5 rounded">
              {{ stat.change }}
            </span>
          </div>
          <h3 class="text-slate-400 text-xs font-medium mb-1">{{ stat.title }}</h3>
          <p class="text-xl font-bold text-slate-100 tracking-tight">{{ stat.value }}</p>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      <div class="lg:col-span-2 space-y-6">
        <h2 class="text-xl font-bold flex items-center gap-2">
          <Play class="text-emerald-500" :size="20" /> 繼續學習
        </h2>

        <div class="grid gap-4">
          <div
            v-for="lesson in MOCK_LESSONS.slice(0, 2)"
            :key="lesson.id"
            class="group bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition-all flex flex-col sm:flex-row items-center p-4 gap-4 shadow-md"
          >
            <div class="relative w-full sm:w-40 aspect-video rounded-xl overflow-hidden flex-shrink-0">
              <img :src="lesson.thumbnail" :alt="lesson.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="flex-1 w-full space-y-2">
              <h3 class="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">{{ lesson.title }}</h3>
              <div class="flex items-center justify-between text-[10px]">
                <span class="text-slate-500 uppercase font-black tracking-widest">{{ lesson.category }}</span>
                <span class="text-emerald-400 font-bold">65%</span>
              </div>
              <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div class="bg-emerald-500 h-full w-[65%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <h2 class="text-xl font-bold flex items-center gap-2">
          <Calendar class="text-sky-500" :size="20" /> 學院日程
        </h2>

        <div class="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
          <div
            v-for="(item, idx) in calendarItems"
            :key="idx"
            class="p-3 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-emerald-500/30 transition-all flex items-center gap-3 group"
          >
            <div class="flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 min-w-[50px]">
              <span class="text-[8px] text-slate-500 font-bold uppercase">{{ item.date.split(' ')[0] }}</span>
              <span class="text-base font-bold text-white leading-none">{{ item.date.split(' ')[1] }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <span v-if="item.status === 'live'" class="text-[8px] font-bold text-white bg-rose-600 px-1 py-0.5 rounded uppercase tracking-wider">
                  Live
                </span>
                <span class="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                  <Clock :size="10" /> {{ item.time }}
                </span>
              </div>
              <h4 class="text-sm font-bold text-slate-200 line-clamp-1">{{ item.title }}</h4>
            </div>
            <button class="p-2 text-slate-500 hover:text-emerald-500 transition-all">
              <Plus :size="16" />
            </button>
          </div>

          <button class="w-full mt-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-all border border-slate-700">
            完整課程表
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
