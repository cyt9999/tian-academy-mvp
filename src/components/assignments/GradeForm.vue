<script setup lang="ts">
import { ref } from 'vue'
import { useAssignmentStore } from '@/stores/assignments'

const props = defineProps<{
  assignmentId: string
  submissionId: string
}>()

const emit = defineEmits<{
  graded: []
}>()

const store = useAssignmentStore()
const grade = ref('')
const feedback = ref('')
const submitting = ref(false)
const error = ref('')

const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-']

const handleSubmit = async () => {
  if (!grade.value) {
    error.value = '請選擇成績'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    await store.gradeSubmission(props.assignmentId, props.submissionId, {
      grade: grade.value,
      feedback: feedback.value || undefined,
    })
    emit('graded')
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="space-y-3">
    <p class="text-xs font-bold text-slate-500 uppercase">批改作業</p>

    <!-- Grade selection -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="g in gradeOptions"
        :key="g"
        @click="grade = g"
        :class="[
          'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
          grade === g
            ? 'bg-emerald-500 text-white'
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
        ]"
      >
        {{ g }}
      </button>
    </div>

    <!-- Feedback -->
    <textarea
      v-model="feedback"
      placeholder="回饋評語（選填）"
      rows="2"
      class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none"
    />

    <!-- Error -->
    <p v-if="error" class="text-xs text-rose-400">{{ error }}</p>

    <!-- Submit -->
    <button
      @click="handleSubmit"
      :disabled="!grade || submitting"
      :class="[
        'w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2',
        !grade || submitting
          ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
          : 'bg-emerald-500 hover:bg-emerald-600 text-white'
      ]"
    >
      <div v-if="submitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      <span v-else>送出批改</span>
    </button>
  </div>
</template>
