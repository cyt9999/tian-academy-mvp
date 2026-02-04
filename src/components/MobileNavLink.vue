<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  to: string
  label: string
  active: boolean
}>()
</script>

<template>
  <RouterLink
    :to="to"
    :class="[
      'flex flex-col items-center justify-center flex-1 py-2 transition-all',
      active ? 'text-emerald-400' : 'text-slate-500'
    ]"
  >
    <div :class="[active ? 'scale-110' : 'scale-100', 'transition-transform mb-1']">
      <slot name="icon" />
    </div>
    <span class="text-[10px] font-black uppercase tracking-tighter">{{ label }}</span>
  </RouterLink>
</template>
