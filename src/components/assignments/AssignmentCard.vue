<script setup lang="ts">
import { computed } from 'vue'
import { Clock, CheckCircle2, FileText } from 'lucide-vue-next'
import type { Assignment } from '@/types'

const props = defineProps<{
  assignment: Assignment
  role: 'student' | 'tutor'
}>()

const emit = defineEmits<{
  select: [assignment: Assignment]
}>()

const status = computed(() => {
  if (props.role === 'tutor') return null
  if (!props.assignment.my_submission) return 'pending'
  return props.assignment.my_submission.status
})

const isPastDue = computed(() => {
  if (!props.assignment.due_date) return false
  return new Date(props.assignment.due_date) < new Date()
})

const formatDate = (d: string | null) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
</script>

<template>
  <div
    class="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/30 transition-all cursor-pointer group"
    @click="emit('select', assignment)"
  >
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-3">
        <div
          :class="[
            'w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center',
            status === 'graded' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
          ]"
        >
          <CheckCircle2 v-if="status === 'graded'" :size="20" />
          <Clock v-else-if="status === 'pending'" :size="20" />
          <FileText v-else :size="20" />
        </div>
        <div>
          <h3 class="font-bold text-base md:text-lg group-hover:text-emerald-400 transition-colors">
            {{ assignment.title }}
          </h3>
          <p v-if="assignment.due_date" class="text-[10px] md:text-xs text-slate-500">
            截止日期：{{ formatDate(assignment.due_date) }}
            <span v-if="isPastDue && status === 'pending'" class="text-rose-400 ml-1">已逾期</span>
          </p>
        </div>
      </div>

      <!-- Student status badge -->
      <template v-if="role === 'student'">
        <span v-if="status === 'graded'" class="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full">
          已批改
        </span>
        <span v-else-if="status === 'submitted'" class="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full">
          已提交
        </span>
        <span v-else class="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded-full">
          待提交
        </span>
      </template>

      <!-- Tutor submission count -->
      <template v-else>
        <span class="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-bold rounded-full">
          {{ assignment.submission_count || 0 }} 份提交
        </span>
      </template>
    </div>

    <p v-if="assignment.description" class="text-xs md:text-sm text-slate-400 leading-relaxed line-clamp-2">
      {{ assignment.description }}
    </p>

    <!-- Grade display for graded submissions -->
    <div
      v-if="role === 'student' && assignment.my_submission?.status === 'graded'"
      class="mt-3 p-3 bg-slate-950 rounded-2xl border border-slate-800"
    >
      <div class="flex items-center justify-between mb-1">
        <p class="text-[10px] font-bold text-emerald-500 uppercase">成績</p>
        <p class="text-lg font-bold text-emerald-400">{{ assignment.my_submission.grade }}</p>
      </div>
    </div>
  </div>
</template>
