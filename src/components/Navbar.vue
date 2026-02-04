<script setup lang="ts">
import { Bell } from 'lucide-vue-next'

const TIAN_AVATAR = "https://yt3.googleusercontent.com/nDtRiMCLFt8YctXzJVUr2ZJ0d43GW_x9CRScw1C_pVqFkxh1fxu0dXqy7kk6ws-0jtmgChQLsw=s900-c-k-c0x00ffffff-no-rj"
</script>

<template>
  <header class="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-2">
        <div class="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-white text-[10px]">T</div>
        <span class="text-sm font-black tracking-tighter bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent uppercase">
          Tian Academy
        </span>
      </div>
    </div>
    <div class="flex items-center space-x-4">
      <div class="hidden md:block px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[9px] text-slate-500 font-black uppercase tracking-widest">
        MVP Terminal v1.0
      </div>
      <button class="relative p-2 text-slate-500 hover:text-white transition-colors">
        <Bell :size="18" />
        <span class="absolute top-2 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
      </button>
      <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer hover:border-emerald-500 transition-all overflow-hidden">
        <img :src="TIAN_AVATAR" alt="Tian" class="w-full h-full object-cover" />
      </div>
    </div>
  </header>
</template>
