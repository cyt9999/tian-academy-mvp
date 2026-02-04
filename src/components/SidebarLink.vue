<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  to: string
  label: string
  active: boolean
  collapsed: boolean
}>()
</script>

<template>
  <RouterLink
    :to="to"
    :class="[
      'flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300',
      active
        ? 'bg-emerald-500/10 text-emerald-400 border-r-4 border-emerald-500 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]'
        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200',
      collapsed ? 'justify-center space-x-0' : ''
    ]"
  >
    <div :class="[active ? 'scale-110' : '', 'transition-transform']">
      <slot name="icon" />
    </div>
    <span v-if="!collapsed" class="font-bold text-sm tracking-tight">{{ label }}</span>
  </RouterLink>
</template>
