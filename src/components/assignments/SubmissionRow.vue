<script setup lang="ts">
import { ref } from 'vue'
import { FileText, Download, ChevronDown, ChevronUp } from 'lucide-vue-next'
import type { Submission } from '@/types'
import GradeForm from './GradeForm.vue'

const props = defineProps<{
  submission: Submission
  assignmentId: string
}>()

const emit = defineEmits<{
  graded: []
}>()

const expanded = ref(false)

const formatDate = (d: string | null) => {
  if (!d) return ''
  return new Date(d).toLocaleString('zh-TW', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}
</script>

<template>
  <div class="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
    <!-- Header row -->
    <div
      class="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-900/60 transition-colors"
      @click="expanded = !expanded"
    >
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold text-slate-400">
          {{ submission.student?.nickname?.[0] || '?' }}
        </div>
        <div>
          <p class="text-sm font-medium">{{ submission.student?.nickname || '學生' }}</p>
          <p class="text-[10px] text-slate-500">{{ formatDate(submission.submitted_at) }}</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <span
          v-if="submission.status === 'graded'"
          class="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full"
        >
          {{ submission.grade }}
        </span>
        <span
          v-else
          class="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded-full"
        >
          待批改
        </span>
        <component :is="expanded ? ChevronUp : ChevronDown" :size="16" class="text-slate-500" />
      </div>
    </div>

    <!-- Expanded detail -->
    <div v-if="expanded" class="border-t border-slate-800 p-4 space-y-4">
      <!-- File download -->
      <div class="flex items-center gap-3">
        <FileText :size="16" class="text-slate-500" />
        <a
          v-if="submission.file_signed_url"
          :href="submission.file_signed_url"
          target="_blank"
          class="text-sm text-emerald-400 hover:underline flex items-center gap-1"
        >
          {{ submission.file_name }}
          <Download :size="12" />
        </a>
        <span v-else class="text-sm text-slate-400">{{ submission.file_name }}</span>
      </div>

      <!-- Comment -->
      <p v-if="submission.comment" class="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl">
        {{ submission.comment }}
      </p>

      <!-- Existing grade display -->
      <div v-if="submission.status === 'graded'" class="p-3 bg-slate-950 rounded-xl">
        <div class="flex items-center justify-between mb-1">
          <p class="text-[10px] font-bold text-emerald-500 uppercase">已批改</p>
          <p class="text-lg font-bold text-emerald-400">{{ submission.grade }}</p>
        </div>
        <p v-if="submission.feedback" class="text-xs text-slate-300">{{ submission.feedback }}</p>
      </div>

      <!-- Grade form for ungraded submissions -->
      <GradeForm
        v-else
        :assignment-id="assignmentId"
        :submission-id="submission.id"
        @graded="emit('graded')"
      />
    </div>
  </div>
</template>
