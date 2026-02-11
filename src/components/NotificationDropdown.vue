<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, Check, CheckCheck } from 'lucide-vue-next'
import { useNotificationStore } from '@/stores/notifications'

const router = useRouter()
const store = useNotificationStore()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

const handleClick = (n: { id: string; reference_id: string | null; is_read: boolean }) => {
  if (!n.is_read) store.markRead(n.id)
  if (n.reference_id) {
    router.push(`/assignments/${n.reference_id}`)
  }
  isOpen.value = false
}

const formatTime = (d: string) => {
  const diff = Date.now() - new Date(d).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '剛剛'
  if (mins < 60) return `${mins} 分鐘前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} 小時前`
  const days = Math.floor(hours / 24)
  return `${days} 天前`
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <!-- Bell button -->
    <button
      @click="toggle"
      class="relative p-2 text-slate-500 hover:text-white transition-colors"
    >
      <Bell :size="18" />
      <span
        v-if="store.unreadCount > 0"
        class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1"
      >
        {{ store.unreadCount > 99 ? '99+' : store.unreadCount }}
      </span>
      <span v-else class="absolute top-2 right-2.5 w-1.5 h-1.5 bg-transparent rounded-full" />
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <p class="text-sm font-bold">通知</p>
        <button
          v-if="store.unreadCount > 0"
          @click="store.markAllRead()"
          class="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
        >
          <CheckCheck :size="12" />
          全部已讀
        </button>
      </div>

      <!-- Notification list -->
      <div class="max-h-80 overflow-y-auto">
        <div
          v-for="n in store.notifications"
          :key="n.id"
          @click="handleClick(n)"
          :class="[
            'flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 last:border-0',
            !n.is_read ? 'bg-emerald-500/5' : ''
          ]"
        >
          <div
            :class="[
              'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
              !n.is_read ? 'bg-emerald-500' : 'bg-transparent'
            ]"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ n.title }}</p>
            <p v-if="n.message" class="text-xs text-slate-400 truncate mt-0.5">{{ n.message }}</p>
            <p class="text-[10px] text-slate-600 mt-1">{{ formatTime(n.created_at) }}</p>
          </div>
          <button
            v-if="!n.is_read"
            @click.stop="store.markRead(n.id)"
            class="text-slate-600 hover:text-emerald-400 transition-colors flex-shrink-0"
          >
            <Check :size="14" />
          </button>
        </div>

        <!-- Empty state -->
        <div v-if="store.notifications.length === 0" class="text-center py-8">
          <p class="text-xs text-slate-500">沒有通知</p>
        </div>
      </div>
    </div>
  </div>
</template>
