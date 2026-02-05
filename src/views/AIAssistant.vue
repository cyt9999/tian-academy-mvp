<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { Send, Bot, Sparkles, ExternalLink, RefreshCw } from 'lucide-vue-next'
import { askTianAI } from '../services/geminiService'
import type { Message } from '@/types'

const messages = ref<Message[]>([
  {
    role: 'assistant',
    content: '你好！我是天哥的智慧替身。在這裡你可以問我任何關於期權、複利投資以及我的課程內容。今天想聊聊什麼標的？',
    timestamp: Date.now()
  }
])
const input = ref('')
const isTyping = ref(false)
const chatEnd = ref<HTMLDivElement>()

function scrollToBottom() {
  nextTick(() => {
    chatEnd.value?.scrollIntoView({ behavior: 'smooth' })
  })
}

watch(messages, scrollToBottom, { deep: true })

async function handleSend() {
  if (!input.value.trim() || isTyping.value) return

  const userMessage: Message = { role: 'user', content: input.value, timestamp: Date.now() }
  messages.value.push(userMessage)
  const prompt = input.value
  input.value = ''
  isTyping.value = true

  const history = messages.value.slice(-10).map(m => ({ role: m.role, content: m.content }))
  const response = await askTianAI(prompt, history)

  isTyping.value = false
  messages.value.push({ role: 'assistant', content: response, timestamp: Date.now() })
}

function handleClear() {
  messages.value = [{
    role: 'assistant',
    content: '對話已重置。你好，我是天哥，準備好開始複利之旅了嗎？',
    timestamp: Date.now()
  }]
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

function useSuggestion(text: string) {
  input.value = text
}

const suggestions = ['Delta 0.15 心法', '如何滾倉？', 'IV 高時怎麼做？', 'CSP 的風險']
</script>

<template>
  <div class="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Bot class="text-white" :size="28" />
        </div>
        <div>
          <h1 class="text-xl font-bold flex items-center gap-2">
            天哥智慧替身
            <span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full border border-emerald-500/20">Powered by Gemini</span>
          </h1>
          <p class="text-xs text-slate-500">基於天哥數百小時影片教學訓練的 AI 導師</p>
        </div>
      </div>
      <button
        @click="handleClear"
        class="p-2 text-slate-500 hover:text-emerald-400 transition-colors"
        title="重置對話"
      >
        <RefreshCw :size="20" />
      </button>
    </div>

    <div class="flex-1 bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
        >
          <div :class="['flex gap-4 max-w-[85%]', msg.role === 'user' ? 'flex-row-reverse' : '']">
            <div
              :class="[
                'w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold',
                msg.role === 'user' ? 'bg-slate-700 text-white' : 'bg-emerald-500 text-white'
              ]"
            >
              {{ msg.role === 'user' ? '我' : '天' }}
            </div>
            <div
              :class="[
                'p-4 rounded-2xl text-sm leading-relaxed shadow-lg',
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
              ]"
            >
              {{ msg.content }}
              <div v-if="msg.role === 'assistant'" class="mt-3 pt-3 border-t border-slate-700/50 flex flex-wrap gap-2">
                <span class="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-emerald-400 flex items-center gap-1">
                  <ExternalLink :size="10" /> 影片來源: 期權實戰課程 #12
                </span>
                <span class="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-amber-400 flex items-center gap-1">
                  <Sparkles :size="10" /> 複利建議
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Typing indicator -->
        <div v-if="isTyping" class="flex justify-start">
          <div class="flex gap-4 max-w-[85%]">
            <div class="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">天</div>
            <div class="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700 flex space-x-1">
              <div class="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
              <div class="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div class="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        </div>
        <div ref="chatEnd" />
      </div>

      <!-- Input Area -->
      <div class="p-6 bg-slate-950/50 border-t border-slate-800">
        <div class="relative group">
          <textarea
            v-model="input"
            @keydown="handleKeydown"
            placeholder="輸入你的期權疑問，例如：'Sell Put 要選多少 Delta 比較好？'"
            class="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-emerald-500 transition-all resize-none max-h-32 group-hover:border-slate-600 shadow-inner"
            rows="1"
          />
          <button
            @click="handleSend"
            :disabled="!input.trim() || isTyping"
            class="absolute right-3 bottom-3 p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Send :size="18" />
          </button>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          <button
            v-for="suggest in suggestions"
            :key="suggest"
            @click="useSuggestion(suggest)"
            class="text-[10px] px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-400 hover:bg-slate-700 hover:text-emerald-400 transition-all"
          >
            {{ suggest }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
