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
  Search,
  Layers,
  Target,
  AlertCircle,
  RefreshCw,
  Zap,
  Flame,
  ShieldAlert,
  FlaskConical,
  Cpu,
  TrendingUp as TrendingUpIcon,
  Calculator,
  ChevronRight,
  Binary
} from 'lucide-vue-next'
import { MOCK_TICKERS } from '../../constants'
import type { StrategyType } from '../../types'
import { fetchStockPrice } from '../services/stockService'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, MarkLineComponent])

const tickerInput = ref('NVDA')
const ticker = ref('NVDA')
const currentPrice = ref(MOCK_TICKERS['NVDA'])
const strategy = ref<StrategyType>('short_put')
const strike = ref(830)
const premium = ref(15.5)
const contracts = ref(1)
const loading = ref(false)
const scanning = ref(false)
const isAdvancedMode = ref(false)

const technicals = computed(() => {
  const s1 = currentPrice.value * 0.965
  const s2 = currentPrice.value * 0.930
  const r1 = currentPrice.value * 1.035
  const r2 = currentPrice.value * 1.080

  let rec: { strategy: StrategyType; label: string; reason: string; color: string } = {
    strategy: 'short_put',
    label: 'CSP 穩健收租',
    reason: '標的處於 EMA 20 支撐區間。建議在 S1 附近賣出 Put，兼顧高權利金與安全邊際。',
    color: 'emerald'
  }

  if (currentPrice.value > 800) {
    rec = {
      strategy: 'covered_call',
      label: 'CC 持股加薪',
      reason: '標的接近壓力位。透過賣出 Call 鎖定部分利潤並增加現金流。',
      color: 'sky'
    }
  } else if (currentPrice.value < 200) {
    rec = {
      strategy: 'leaps',
      label: 'PMCC 槓桿代股',
      reason: '低單價高成長標的，適合用 LEAPS 替代現股，達成相同的複利效果。',
      color: 'indigo'
    }
  }

  return { s1, s2, r1, r2, rec }
})

const currentStrategies = computed(() =>
  isAdvancedMode.value
    ? [
        { id: 'iron_condor', label: 'IC 鐵鷹', icon: 'Zap' },
        { id: 'leaps', label: 'PMCC 代股', icon: 'Flame' },
        { id: 'strangle', label: 'Strangle', icon: 'ShieldAlert' }
      ]
    : [
        { id: 'short_put', label: 'CSP 收租', icon: 'Target' },
        { id: 'covered_call', label: 'CC 加薪', icon: 'Layers' },
        { id: 'vertical_spread', label: '垂直價差', icon: 'AlertCircle' }
      ]
)

const handleSearch = async (e?: Event) => {
  if (e) e.preventDefault()
  const upCase = tickerInput.value.trim().toUpperCase()
  if (!upCase) return
  loading.value = true
  scanning.value = true
  const apiPrice = await fetchStockPrice(upCase)
  setTimeout(() => {
    loading.value = false
    scanning.value = false
    const finalPrice = apiPrice || MOCK_TICKERS[upCase] || 150.00
    ticker.value = upCase
    currentPrice.value = finalPrice
    strike.value = Math.round(finalPrice * 0.95)
    premium.value = Math.round(finalPrice * 0.02 * 10) / 10
  }, 600)
}

const handleStrategyChange = (id: StrategyType) => {
  strategy.value = id
  const price = currentPrice.value
  if (id === 'short_put') { strike.value = Math.round(price * 0.95); premium.value = Math.round(price * 0.015 * 10) / 10 }
  else if (id === 'covered_call') { strike.value = Math.round(price * 1.05); premium.value = Math.round(price * 0.012 * 10) / 10 }
  else if (id === 'leaps') { strike.value = Math.round(price * 1.05); premium.value = Math.round(price * 0.03 * 10) / 10 }
  else if (id === 'strangle') { strike.value = Math.round(price * 0.90); premium.value = Math.round(price * 0.05 * 10) / 10 }
  else { strike.value = Math.round(price * 0.98); premium.value = 5.0 }
}

const calculateProfitAtPrice = (p: number) => {
  const unit = 100 * contracts.value
  const s = Number(strike.value)
  const pr = Number(premium.value)
  const cp = Number(currentPrice.value)

  if (strategy.value === 'short_put') return (pr - Math.max(0, s - p)) * unit
  if (strategy.value === 'covered_call') return (pr + (Math.min(p, s) - cp)) * unit
  if (strategy.value === 'vertical_spread') return (pr - (Math.max(0, s - p) - Math.max(0, (s - 10) - p))) * unit
  if (strategy.value === 'iron_condor') return (pr - (Math.max(0, s - p) - Math.max(0, (s - 5) - p)) - (Math.max(0, p - (s + 15)) - Math.max(0, p - (s + 20)))) * unit
  if (strategy.value === 'leaps') {
    const longStrike = cp * 0.8
    const longCost = cp * 0.25
    return (Math.max(0, p - longStrike) - longCost + pr - Math.max(0, p - s)) * unit
  }
  if (strategy.value === 'strangle') {
    const putStrike = s
    const callStrike = s + (cp * 0.1)
    return (pr - Math.max(0, putStrike - p) - Math.max(0, p - callStrike)) * unit
  }
  return 0
}

const chartData = computed(() => {
  const points: number[][] = []
  const min = currentPrice.value * 0.60
  const max = currentPrice.value * 1.40
  const step = (max - min) / 80
  for (let p = min; p <= max; p += step) {
    points.push([Math.round(p), Math.round(calculateProfitAtPrice(p))])
  }
  return points
})

const currentProfit = computed(() => calculateProfitAtPrice(currentPrice.value))

const chartOption = computed(() => ({
  animation: !loading.value,
  grid: { left: 60, right: 20, top: 20, bottom: 40 },
  xAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#475569', fontSize: 12, fontWeight: 'bold' },
    splitLine: { show: false }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#475569', fontSize: 12, formatter: (v: number) => `$${v}` },
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
      return `價格: $${d.value[0]}<br/>損益: $${d.value[1].toLocaleString()}`
    }
  },
  series: [{
    type: 'line',
    data: chartData.value,
    smooth: true,
    lineStyle: { color: currentProfit.value >= 0 ? '#10b981' : '#f43f5e', width: 3 },
    areaStyle: {
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: currentProfit.value >= 0 ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)' },
          { offset: 1, color: 'rgba(2,6,23,0)' }
        ]
      }
    },
    symbol: 'none',
    markLine: {
      silent: true,
      symbol: 'none',
      data: [
        { yAxis: 0, lineStyle: { color: '#475569', width: 1 } },
        {
          xAxis: currentPrice.value,
          lineStyle: { color: '#10b981', type: 'dashed', width: 1 },
          label: { formatter: '現價', position: 'start', color: '#10b981', fontSize: 10, fontWeight: 'bold' }
        }
      ]
    }
  }]
}))

const params = computed(() => [
  { label: '合約張數', val: contracts.value, key: 'contracts', min: 1, step: 1, desc: '控制倉位是活命第一準則。' },
  { label: '行權價', val: strike.value, key: 'strike', step: 1, desc: '建議選在支撐位下方的 Delta 0.15。' },
  { label: '權利金', val: premium.value, key: 'premium', step: 0.1, desc: '這是你的核心租金收益。' }
])

const updateParam = (key: string, val: number) => {
  if (key === 'contracts') contracts.value = val
  else if (key === 'strike') strike.value = val
  else if (key === 'premium') premium.value = val
}
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-4 pb-12 px-4 animate-up">
    <header class="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-xl">
      <div class="flex items-center gap-4">
        <div class="bg-emerald-500 p-2 rounded-2xl">
          <FlaskConical class="text-white" :size="20" />
        </div>
        <div>
          <h1 class="text-lg font-black text-white uppercase">策略模擬實驗室</h1>
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500 font-bold">TERMINAL v2.8</span>
            <span class="text-xs text-emerald-500 font-bold flex items-center gap-1">
              <Calculator :size="10" /> 演算同步中
            </span>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSearch" class="flex gap-2 w-full md:w-auto">
        <div class="relative flex-1 md:flex-none">
          <input
            type="text"
            v-model="tickerInput"
            class="bg-slate-950 border border-slate-800 rounded-xl px-10 py-2 text-sm font-black w-full md:w-40 focus:border-emerald-500 outline-none text-white uppercase"
            placeholder="代碼"
          />
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" :size="16" />
        </div>
        <button type="submit" class="px-5 py-2 bg-emerald-600 text-white font-black text-xs rounded-xl hover:bg-emerald-500 transition-all">
          <RefreshCw v-if="loading" class="animate-spin" :size="14" />
          <template v-else>查詢</template>
        </button>
      </form>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
      <!-- Sidebar -->
      <aside class="lg:col-span-4 space-y-4">
        <section class="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-5">
          <div class="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button @click="isAdvancedMode = false" :class="['flex-1 py-1.5 text-sm font-black rounded-lg transition-all', !isAdvancedMode ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500']">初階</button>
            <button @click="isAdvancedMode = true" :class="['flex-1 py-1.5 text-sm font-black rounded-lg transition-all', isAdvancedMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500']">進階</button>
          </div>

          <div class="grid grid-cols-1 gap-1.5">
            <button
              v-for="s in currentStrategies"
              :key="s.id"
              @click="handleStrategyChange(s.id as StrategyType)"
              :class="[
                'flex items-center gap-3 p-3 rounded-xl border transition-all text-left',
                strategy === s.id
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                  : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-700'
              ]"
            >
              <Target v-if="s.icon === 'Target'" :size="18" />
              <Layers v-if="s.icon === 'Layers'" :size="18" />
              <AlertCircle v-if="s.icon === 'AlertCircle'" :size="18" />
              <Zap v-if="s.icon === 'Zap'" :size="18" />
              <Flame v-if="s.icon === 'Flame'" :size="18" />
              <ShieldAlert v-if="s.icon === 'ShieldAlert'" :size="18" />
              <span class="text-sm font-black uppercase">{{ s.label }}</span>
              <ChevronRight v-if="strategy === s.id" :size="14" class="ml-auto" />
            </button>
          </div>

          <div class="h-px bg-slate-800"></div>

          <div class="space-y-4">
            <div v-for="p in params" :key="p.label" class="space-y-1">
              <div class="flex justify-between items-end">
                <label class="text-sm font-black text-slate-400 uppercase">{{ p.label }}</label>
                <span class="text-sm font-black text-white">${{ p.val }}</span>
              </div>
              <input
                type="number"
                :step="p.step"
                :value="p.val"
                @input="updateParam(p.key, Number(($event.target as HTMLInputElement).value))"
                class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm font-bold text-white outline-none focus:border-emerald-500 transition-all"
              />
              <p class="text-[12px] text-slate-500 leading-tight italic font-medium">{{ p.desc }}</p>
            </div>
          </div>
        </section>
      </aside>

      <!-- Chart Content Area -->
      <div class="lg:col-span-8 flex flex-col gap-4 min-h-[500px]">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex-1 flex flex-col min-h-[400px]">
          <div v-if="scanning" class="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-30 flex flex-col items-center justify-center animate-in fade-in">
            <Binary class="text-emerald-500 animate-pulse mb-3" :size="32" />
            <p class="text-xs font-black text-white uppercase tracking-widest text-center">正在回測 {{ ticker }} EMA 模型...</p>
          </div>

          <div class="flex justify-between items-start mb-6">
            <div>
              <p class="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">預估到期損益</p>
              <h2 :class="['text-4xl font-black tracking-tighter', currentProfit >= 0 ? 'text-emerald-400' : 'text-rose-400']">
                ${{ currentProfit.toLocaleString() }}
              </h2>
            </div>
            <div class="text-right">
              <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 shadow-inner">
                <p class="text-xs font-black text-slate-500 uppercase tracking-widest">標的現價</p>
                <p class="text-2xl font-black text-white tracking-tighter">${{ currentPrice.toFixed(2) }}</p>
                <div class="flex items-center gap-1.5 justify-end mt-1">
                  <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span class="text-[10px] text-emerald-500 font-black">LIVE</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex-1 w-full" style="min-height: 280px">
            <v-chart :option="chartOption" autoresize style="width: 100%; height: 100%" />
          </div>

          <div class="mt-4 flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <div class="flex gap-4">
              <div class="flex items-center gap-1.5"><div class="w-2.5 h-2.5 rounded bg-emerald-500"></div> 盈利</div>
              <div class="flex items-center gap-1.5"><div class="w-2.5 h-2.5 rounded bg-rose-500"></div> 風險</div>
            </div>
            <div class="flex items-center gap-1.5 text-amber-500">
              <AlertCircle :size="14" /> 模擬數據非建議
            </div>
          </div>
        </div>

        <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <TrendingUpIcon :size="18" class="text-emerald-500" />
                <h3 class="text-sm font-black text-white uppercase">智能點位</h3>
              </div>
              <div class="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold uppercase">EMA 回測</div>
            </div>

            <div class="space-y-1.5">
              <div class="flex items-center justify-between p-2.5 bg-rose-500/5 rounded-xl border border-rose-500/10">
                <span class="text-sm font-black text-rose-500 uppercase">壓力 R2 (EMA 50)</span>
                <span class="text-lg font-black text-white">${{ technicals.r2.toFixed(2) }}</span>
              </div>
              <div class="flex items-center justify-between p-2.5 bg-rose-500/5 rounded-xl border border-rose-500/10 opacity-70">
                <span class="text-sm font-black text-rose-500 uppercase">壓力 R1 (EMA 20)</span>
                <span class="text-lg font-black text-white">${{ technicals.r1.toFixed(2) }}</span>
              </div>
              <div class="flex items-center justify-between p-2.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10 opacity-70">
                <span class="text-sm font-black text-emerald-500 uppercase">支撐 S1 (EMA 20)</span>
                <span class="text-lg font-black text-white">${{ technicals.s1.toFixed(2) }}</span>
              </div>
              <div class="flex items-center justify-between p-2.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                <span class="text-sm font-black text-emerald-500 uppercase">支撐 S2 (EMA 50)</span>
                <span class="text-lg font-black text-white">${{ technicals.s2.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-4">
                <Cpu :size="18" class="text-indigo-400" />
                <h3 class="text-sm font-black text-white uppercase">策略建議引擎</h3>
              </div>

              <div :class="`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase bg-${technicals.rec.color}-500/10 text-${technicals.rec.color}-400 border border-${technicals.rec.color}-500/20 mb-3`">
                <Zap :size="10" class="animate-pulse" /> 推薦：{{ technicals.rec.label }}
              </div>

              <p class="text-sm text-slate-300 leading-relaxed font-bold mb-5">
                {{ technicals.rec.reason }}
              </p>
            </div>

            <div class="space-y-2">
              <button
                @click="handleStrategyChange(technicals.rec.strategy)"
                class="w-full py-2.5 bg-indigo-600 text-white font-black text-xs rounded-xl hover:bg-indigo-500 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                配置推薦參數 <RefreshCw :size="12" />
              </button>
              <p class="text-[12px] text-slate-500 font-bold italic text-center">
                "天哥：紀律是複利的靈魂。"
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
