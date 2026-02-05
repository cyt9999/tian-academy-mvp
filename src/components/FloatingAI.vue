<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { X, Send, RefreshCw, ExternalLink } from 'lucide-vue-next'
import { askTianAI } from '../services/geminiService'
import type { Message } from '@/types'

const TIAN_AVATAR = "https://yt3.googleusercontent.com/nDtRiMCLFt8YctXzJVUr2ZJ0d43GW_x9CRScw1C_pVqFkxh1fxu0dXqy7kk6ws-0jtmgChQLsw=s900-c-k-c0x00ffffff-no-rj"

const isOpen = ref(false)
const messages = ref<Message[]>([
  {
    role: 'assistant',
    content: '你好！我是天哥的智慧替身。在這裡你可以問我任何關於期權、複利投資以及我的課程內容。今天想聊聊什麼標的？',
    timestamp: Date.now()
  }
])
const input = ref('')
const isTyping = ref(false)
const chatEndRef = ref<HTMLDivElement>()

const scrollToBottom = () => {
  nextTick(() => {
    chatEndRef.value?.scrollIntoView({ behavior: 'smooth' })
  })
}

watch([messages, isOpen], () => {
  if (isOpen.value) scrollToBottom()
})

const handleSend = async () => {
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

const resetChat = () => {
  messages.value = [{ role: 'assistant', content: '對話已重置。', timestamp: Date.now() }]
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') handleSend()
}
</script>

<template>
  <div class="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 flex flex-col items-end">
    <div v-if="isOpen" class="w-[calc(100vw-32px)] md:w-[400px] h-[500px] md:h-[600px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
      <!-- Header -->
      <div class="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 rounded-xl border border-emerald-500 overflow-hidden">
            <img :src="TIAN_AVATAR" alt="Tian" class="w-full h-full object-cover" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-white">天哥智慧替身</h4>
            <p class="text-[10px] text-emerald-500">Online | AI Assistant</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button @click="resetChat" class="p-1.5 text-slate-500 hover:text-white transition-colors">
            <RefreshCw :size="14" />
          </button>
          <button @click="isOpen = false" class="p-1.5 text-slate-500 hover:text-white transition-colors">
            <X :size="18" />
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-900/50">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
        >
          <div :class="[
            'p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] shadow-lg',
            msg.role === 'user'
              ? 'bg-emerald-600 text-white rounded-tr-none'
              : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
          ]">
            {{ msg.content }}
            <div v-if="msg.role === 'assistant'" class="mt-2 pt-2 border-t border-slate-700/50 flex gap-2">
              <span class="text-[9px] text-emerald-400 flex items-center gap-1"><ExternalLink :size="8" /> 課程 #12</span>
            </div>
          </div>
        </div>
        <div v-if="isTyping" class="flex justify-start">
          <div class="bg-slate-800 p-3 rounded-2xl rounded-tl-none flex space-x-1">
            <div class="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
            <div class="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          </div>
        </div>
        <div ref="chatEndRef"></div>
      </div>

      <!-- Input Area -->
      <div class="p-4 bg-slate-950 border-t border-slate-800">
        <div class="relative">
          <input
            v-model="input"
            @keydown="handleKeydown"
            placeholder="詢問複利心法..."
            class="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-4 pr-10 text-xs focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
          />
          <button
            @click="handleSend"
            :disabled="!input.trim() || isTyping"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-500 text-white rounded-lg disabled:opacity-50"
          >
            <Send :size="14" />
          </button>
        </div>
      </div>
    </div>

    <button
      v-else
      @click="isOpen = true"
      class="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 hover:scale-110 transition-transform animate-bounce-slow overflow-hidden border-2 border-emerald-400 relative"
    >
      <img :src="TIAN_AVATAR" alt="Tian Bot" class="w-full h-full object-cover" />
      <span class="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
    </button>
  </div>
</template>
