<script setup lang="ts">
import { ref } from 'vue'
import { Upload, CheckCircle2, Clock, MessageSquare } from 'lucide-vue-next'

const activeTab = ref<'todo' | 'completed'>('todo')
const uploadStatus = ref<'idle' | 'uploading' | 'success'>('idle')

const handleUpload = () => {
  uploadStatus.value = 'uploading'
  setTimeout(() => { uploadStatus.value = 'success' }, 1500)
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold">實戰陪跑作業</h1>
        <p class="text-sm text-slate-400">上傳交易紀錄，獲取天哥的一對一心法批改</p>
      </div>
      <div class="flex bg-slate-900 border border-slate-800 p-1 rounded-xl w-full md:w-auto">
        <button
          @click="activeTab = 'todo'"
          :class="[
            'flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all',
            activeTab === 'todo' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
          ]"
        >
          待交作業
        </button>
        <button
          @click="activeTab = 'completed'"
          :class="[
            'flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all',
            activeTab === 'completed' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
          ]"
        >
          已完成
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      <div class="lg:col-span-2 space-y-4">
        <div v-if="activeTab === 'todo'" class="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/30 transition-all cursor-pointer group">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                <Clock :size="24" />
              </div>
              <div>
                <h3 class="font-bold text-base md:text-lg group-hover:text-emerald-400">作業 03：第一次 Sell Put 實錄</h3>
                <p class="text-[10px] md:text-xs text-slate-500">截止日期：2024-05-20</p>
              </div>
            </div>
            <span class="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded-full">進行中</span>
          </div>
          <p class="text-xs md:text-sm text-slate-400 mb-6 leading-relaxed">
            請上傳你在券商模擬帳戶中，根據本週天哥分享的標的選取行權價後的持倉截圖。
          </p>
          <div class="flex items-center gap-4">
            <div class="flex -space-x-2">
              <img
                v-for="i in [1, 2, 3]"
                :key="i"
                :src="`https://picsum.photos/seed/user${i}/32/32`"
                class="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-slate-950"
              />
            </div>
            <span class="text-[10px] text-slate-500">已有 131 位同學提交</span>
          </div>
        </div>

        <div v-else class="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                <CheckCircle2 :size="20" />
              </div>
              <div>
                <h3 class="font-bold text-base md:text-lg">作業 01：複利計畫書</h3>
                <p class="text-[10px] md:text-xs text-slate-500">提交於 2024-05-01</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-slate-500 uppercase">評分</p>
              <p class="text-xl md:text-2xl font-bold text-emerald-400">A+</p>
            </div>
          </div>
          <div class="p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <p class="text-[10px] font-bold text-emerald-500 uppercase mb-2">天哥回饋</p>
            <p class="text-xs md:text-sm text-slate-300 leading-relaxed">計畫做得非常紮實！對於資金分配很有天哥當年的風範。繼續保持。</p>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col items-center text-center shadow-xl">
          <div class="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-4 md:mb-6">
            <Upload :size="28" />
          </div>
          <h3 class="text-lg md:text-xl font-bold mb-1">提交新作業</h3>
          <p class="text-[10px] md:text-xs text-slate-400 mb-6 md:mb-8">支援圖片、PDF 或交易連結</p>

          <div class="w-full space-y-4">
            <div class="border-2 border-dashed border-slate-700 rounded-2xl p-6 md:p-8 hover:border-emerald-500/50 transition-all cursor-pointer">
              <p class="text-[10px] text-slate-500">點擊或拖放檔案上傳</p>
            </div>
            <button
              @click="handleUpload"
              :disabled="uploadStatus !== 'idle'"
              :class="[
                'w-full py-3 md:py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2',
                uploadStatus === 'success'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              ]"
            >
              <template v-if="uploadStatus === 'idle'">上傳並通知天哥</template>
              <template v-if="uploadStatus === 'uploading'">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </template>
              <template v-if="uploadStatus === 'success'">
                <CheckCircle2 :size="16" /> 已推播 Discord
              </template>
            </button>
          </div>
        </div>

        <div class="bg-[#5865F2]/10 border border-[#5865F2]/20 rounded-3xl p-5 flex items-start gap-4">
          <div class="w-10 h-10 bg-[#5865F2] rounded-xl flex items-center justify-center text-white flex-shrink-0">
            <MessageSquare :size="20" />
          </div>
          <div>
            <p class="text-[10px] text-[#5865F2] font-bold uppercase tracking-widest mb-0.5">Discord 聯動</p>
            <p class="text-xs text-slate-400 leading-relaxed">天哥看到你的作業後會直接在 Discord 回覆！</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
