<script setup lang="ts">
import { ref, computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  MarkLineComponent
} from 'echarts/components'
import {
  Info,
  ArrowUpRight,
  ThumbsUp,
  XCircle,
  Plus,
  Trash2,
  Calendar,
  Settings2
} from 'lucide-vue-next'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, MarkLineComponent])

interface ParameterRow {
  id: string
  startAge: number
  endAge: number
  amount: number
  cpiAdjust?: boolean
  startOfYear?: boolean
}

const currentAge = ref(30)
const retireAge = ref(45)
const lifeExpectancy = ref(85)
const brokerageBalance = ref(1000000)
const retirementBalance = ref(500000)
const annualROI = ref(8)
const inflationRate = ref(2.5)

const withdrawals = ref<ParameterRow[]>([
  { id: 'w1', startAge: 45, endAge: 85, amount: 600000, cpiAdjust: true, startOfYear: false }
])
const brokerageContribs = ref<ParameterRow[]>([
  { id: 'bc1', startAge: 30, endAge: 45, amount: 300000 }
])
const retirementContribs = ref<ParameterRow[]>([
  { id: 'rc1', startAge: 30, endAge: 45, amount: 150000 }
])

const addRow = (type: 'w' | 'bc' | 'rc') => {
  const newRow = { id: Math.random().toString(36).substr(2, 9), startAge: currentAge.value, endAge: retireAge.value, amount: 0 }
  if (type === 'w') withdrawals.value.push({ ...newRow, cpiAdjust: true, startOfYear: false })
  else if (type === 'bc') brokerageContribs.value.push(newRow)
  else if (type === 'rc') retirementContribs.value.push(newRow)
}

const removeRow = (type: 'w' | 'bc' | 'rc', id: string) => {
  if (type === 'w') withdrawals.value = withdrawals.value.filter(r => r.id !== id)
  else if (type === 'bc') brokerageContribs.value = brokerageContribs.value.filter(r => r.id !== id)
  else if (type === 'rc') retirementContribs.value = retirementContribs.value.filter(r => r.id !== id)
}

const updateRow = (type: 'w' | 'bc' | 'rc', id: string, field: keyof ParameterRow, value: any) => {
  const list = type === 'w' ? withdrawals : type === 'bc' ? brokerageContribs : retirementContribs
  const row = list.value.find(r => r.id === id)
  if (row) (row as any)[field] = value
}

const calculationData = computed(() => {
  let results: { age: number; balance: number; isRetired: boolean }[] = []
  let balance = Number(brokerageBalance.value) + Number(retirementBalance.value)
  const roi = Number(annualROI.value) / 100
  const inf = Number(inflationRate.value) / 100

  for (let age = currentAge.value; age <= lifeExpectancy.value; age++) {
    const yearIdx = age - currentAge.value

    const yearlyContrib =
      brokerageContribs.value.filter(r => age >= r.startAge && age < r.endAge).reduce((sum, r) => sum + Number(r.amount), 0) +
      retirementContribs.value.filter(r => age >= r.startAge && age < r.endAge).reduce((sum, r) => sum + Number(r.amount), 0)

    const yearlyWithdrawal = withdrawals.value
      .filter(r => age >= r.startAge && age < r.endAge)
      .reduce((sum, r) => {
        const base = Number(r.amount)
        return sum + (r.cpiAdjust ? base * Math.pow(1 + inf, yearIdx) : base)
      }, 0)

    balance = balance * (1 + roi) + yearlyContrib - yearlyWithdrawal

    results.push({
      age,
      balance: Math.max(0, Math.round(balance)),
      isRetired: age >= retireAge.value
    })
  }
  return results
})

const finalBalance = computed(() => calculationData.value[calculationData.value.length - 1].balance)
const isSuccessful = computed(() => finalBalance.value > 0)

const chartOption = computed(() => ({
  animation: true,
  grid: { left: 70, right: 20, top: 20, bottom: 40 },
  xAxis: {
    type: 'category',
    data: calculationData.value.map(d => d.age),
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#475569', fontSize: 11, fontWeight: 'bold' },
    splitLine: { show: false }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#475569', fontSize: 11, formatter: (v: number) => `$${(v / 1000000).toFixed(1)}M` },
    splitLine: { lineStyle: { color: '#1e293b', type: 'dashed', opacity: 0.3 } }
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#020617',
    borderColor: '#1e293b',
    borderRadius: 12,
    textStyle: { fontSize: 12, fontWeight: 'bold', color: '#e2e8f0' },
    formatter: (params: any) => {
      const d = params[0]
      return `年齡: ${d.name} 歲<br/>餘額: $${Number(d.value).toLocaleString()}`
    }
  },
  series: [{
    type: 'line',
    data: calculationData.value.map(d => d.balance),
    smooth: true,
    lineStyle: { color: isSuccessful.value ? '#10b981' : '#f43f5e', width: 3 },
    areaStyle: {
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: isSuccessful.value ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)' },
          { offset: 1, color: 'rgba(2,6,23,0)' }
        ]
      }
    },
    symbol: 'none',
    markLine: {
      silent: true,
      symbol: 'none',
      data: [{
        xAxis: retireAge.value - currentAge.value,
        lineStyle: { color: '#f59e0b', type: 'dashed', width: 1 },
        label: { formatter: '退休', position: 'start', color: '#f59e0b', fontSize: 10, fontWeight: 'bold' }
      }]
    }
  }]
}))

const globalVars = computed(() => [
  { label: '當前年齡', val: currentAge.value, key: 'currentAge' },
  { label: '計畫退休年齡', val: retireAge.value, key: 'retireAge' },
  { label: '個人帳戶初始 ($)', val: brokerageBalance.value, key: 'brokerageBalance' },
  { label: '退休帳戶初始 ($)', val: retirementBalance.value, key: 'retirementBalance' },
  { label: '平均年回報率 (%)', val: annualROI.value, key: 'annualROI' },
])

const updateGlobal = (key: string, val: number) => {
  if (key === 'currentAge') currentAge.value = val
  else if (key === 'retireAge') retireAge.value = val
  else if (key === 'brokerageBalance') brokerageBalance.value = val
  else if (key === 'retirementBalance') retirementBalance.value = val
  else if (key === 'annualROI') annualROI.value = val
}
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6 pb-12 px-4 animate-up">
    <!-- 1. Global Variables -->
    <section class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div class="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Settings2 class="text-sky-500" :size="20" />
        <h2 class="text-sm font-black text-white uppercase tracking-widest">① 全局變量 (Global Variables)</h2>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div v-for="item in globalVars" :key="item.key" class="space-y-1.5">
          <label class="text-[11px] font-black text-slate-500 uppercase">{{ item.label }}</label>
          <input
            type="number"
            :value="item.val"
            @input="updateGlobal(item.key, Number(($event.target as HTMLInputElement).value))"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-bold text-white outline-none focus:border-sky-500 transition-all"
          />
        </div>
      </div>
    </section>

    <!-- 2. Variable Parameters -->
    <section class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-8">
      <div class="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Calendar class="text-emerald-500" :size="20" />
        <h2 class="text-sm font-black text-white uppercase tracking-widest">② 可變參數 (Staged Parameters)</h2>
      </div>

      <!-- Withdrawals -->
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-sm font-black text-rose-400 uppercase tracking-tight">提款 (Withdrawals / Expenses)</h3>
          <button @click="addRow('w')" class="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-500 rounded-lg text-xs font-black hover:bg-rose-500/20 transition-all">
            <Plus :size="14" /> 添加區段
          </button>
        </div>
        <div class="space-y-3">
          <div v-for="row in withdrawals" :key="row.id" class="grid grid-cols-12 gap-3 items-center bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
            <div class="col-span-3 flex gap-2">
              <input type="number" placeholder="起" :value="row.startAge" @input="updateRow('w', row.id, 'startAge', Number(($event.target as HTMLInputElement).value))" class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-bold text-white" />
              <input type="number" placeholder="迄" :value="row.endAge" @input="updateRow('w', row.id, 'endAge', Number(($event.target as HTMLInputElement).value))" class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-bold text-white" />
            </div>
            <div class="col-span-3">
              <input type="number" placeholder="年提款額 ($)" :value="row.amount" @input="updateRow('w', row.id, 'amount', Number(($event.target as HTMLInputElement).value))" class="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-bold text-rose-400" />
            </div>
            <div class="col-span-5 flex items-center gap-4 px-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" :checked="row.cpiAdjust" @change="updateRow('w', row.id, 'cpiAdjust', ($event.target as HTMLInputElement).checked)" class="rounded border-slate-800 bg-slate-900 text-sky-500 focus:ring-sky-500" />
                <span class="text-[10px] font-black text-slate-500 uppercase">CPI 調節</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" :checked="row.startOfYear" @change="updateRow('w', row.id, 'startOfYear', ($event.target as HTMLInputElement).checked)" class="rounded border-slate-800 bg-slate-900 text-sky-500 focus:ring-sky-500" />
                <span class="text-[10px] font-black text-slate-500 uppercase">年初發生</span>
              </label>
            </div>
            <button @click="removeRow('w', row.id)" class="col-span-1 flex justify-center text-slate-600 hover:text-rose-500 transition-colors">
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- Contributions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-800/50">
        <!-- Brokerage -->
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-black text-emerald-400 uppercase tracking-tight">個人帳戶存入 (Brokerage)</h3>
            <button @click="addRow('bc')" class="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20"><Plus :size="14" /></button>
          </div>
          <div v-for="row in brokerageContribs" :key="row.id" class="flex gap-2 items-center bg-slate-950/30 p-2 rounded-xl border border-slate-800">
            <input type="number" :value="row.startAge" @input="updateRow('bc', row.id, 'startAge', Number(($event.target as HTMLInputElement).value))" class="w-16 bg-slate-900 border border-slate-800 rounded p-1.5 text-[10px] font-bold text-white text-center" />
            <span class="text-slate-700 text-xs">~</span>
            <input type="number" :value="row.endAge" @input="updateRow('bc', row.id, 'endAge', Number(($event.target as HTMLInputElement).value))" class="w-16 bg-slate-900 border border-slate-800 rounded p-1.5 text-[10px] font-bold text-white text-center" />
            <input type="number" :value="row.amount" @input="updateRow('bc', row.id, 'amount', Number(($event.target as HTMLInputElement).value))" class="flex-1 bg-slate-900 border border-slate-800 rounded p-1.5 text-xs font-bold text-emerald-400" />
            <button @click="removeRow('bc', row.id)" class="text-slate-600 hover:text-rose-500"><Trash2 :size="14" /></button>
          </div>
        </div>
        <!-- Retirement -->
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-black text-sky-400 uppercase tracking-tight">退休帳戶存入 (Retirement)</h3>
            <button @click="addRow('rc')" class="p-1.5 bg-sky-500/10 text-sky-500 rounded-lg hover:bg-sky-500/20"><Plus :size="14" /></button>
          </div>
          <div v-for="row in retirementContribs" :key="row.id" class="flex gap-2 items-center bg-slate-950/30 p-2 rounded-xl border border-slate-800">
            <input type="number" :value="row.startAge" @input="updateRow('rc', row.id, 'startAge', Number(($event.target as HTMLInputElement).value))" class="w-16 bg-slate-900 border border-slate-800 rounded p-1.5 text-[10px] font-bold text-white text-center" />
            <span class="text-slate-700 text-xs">~</span>
            <input type="number" :value="row.endAge" @input="updateRow('rc', row.id, 'endAge', Number(($event.target as HTMLInputElement).value))" class="w-16 bg-slate-900 border border-slate-800 rounded p-1.5 text-[10px] font-bold text-white text-center" />
            <input type="number" :value="row.amount" @input="updateRow('rc', row.id, 'amount', Number(($event.target as HTMLInputElement).value))" class="flex-1 bg-slate-900 border border-slate-800 rounded p-1.5 text-xs font-bold text-sky-400" />
            <button @click="removeRow('rc', row.id)" class="text-slate-600 hover:text-rose-500"><Trash2 :size="14" /></button>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Results and Visuals -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div :class="[
        'p-6 rounded-3xl border-2 flex flex-col items-center justify-center text-center shadow-xl transition-all',
        isSuccessful ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'
      ]">
        <ThumbsUp v-if="isSuccessful" class="text-emerald-500 mb-2" :size="40" />
        <XCircle v-else class="text-rose-500 mb-2" :size="40" />
        <h3 :class="['text-xl font-black uppercase', isSuccessful ? 'text-emerald-400' : 'text-rose-400']">
          {{ isSuccessful ? '躺平策略大獲全勝' : '自由之路仍有缺口' }}
        </h3>
        <p class="text-xs text-slate-400 font-bold mt-2 leading-relaxed">
          {{ isSuccessful
            ? "天哥心法：保持複利節奏，你已贏過時間。"
            : "天哥提醒：需提高 ROI 或延後退休。期權收租是你的最佳槓桿。" }}
        </p>
      </div>

      <div class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col min-h-[400px]">
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-3">
            <ArrowUpRight class="text-sky-400" :size="20" />
            <h3 class="text-sm font-black text-white uppercase tracking-widest">複利軌跡模擬 (FIRE Trajectory)</h3>
          </div>
          <div class="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center">
            <p class="text-[10px] font-black text-slate-500 uppercase mb-0.5">終局剩餘淨值</p>
            <p :class="['text-xl font-black', finalBalance > 0 ? 'text-emerald-400' : 'text-rose-500']">
              ${{ finalBalance.toLocaleString() }}
            </p>
          </div>
        </div>

        <div class="flex-1 w-full min-h-[280px]">
          <v-chart :option="chartOption" autoresize style="width: 100%; height: 100%" />
        </div>

        <div class="mt-4 flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800">
          <div class="flex items-center gap-2">
            <Info class="text-sky-500" :size="16" />
            <p class="text-[11px] text-slate-500 font-bold italic">
              動態複利模擬：所有收支以年度為單位進行月複利迭代。
            </p>
          </div>
          <p class="text-[10px] text-slate-600 font-black uppercase">Tian Academy MVP v2.8</p>
        </div>
      </div>
    </div>
  </div>
</template>
