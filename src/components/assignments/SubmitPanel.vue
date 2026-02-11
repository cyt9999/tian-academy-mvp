<script setup lang="ts">
import { ref } from 'vue'
import { Upload, CheckCircle2, X, FileUp } from 'lucide-vue-next'
import { useAssignmentStore } from '@/stores/assignments'
import type { Assignment } from '@/types'

const props = defineProps<{
  assignment: Assignment
}>()

const emit = defineEmits<{
  submitted: []
  close: []
}>()

const store = useAssignmentStore()
const file = ref<File | null>(null)
const comment = ref('')
const status = ref<'idle' | 'uploading' | 'success' | 'error'>('idle')
const errorMsg = ref('')
const dragOver = ref(false)

const handleDrop = (e: DragEvent) => {
  dragOver.value = false
  const dropped = e.dataTransfer?.files[0]
  if (dropped) file.value = dropped
}

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) file.value = input.files[0]
}

const handleSubmit = async () => {
  if (!file.value) return
  status.value = 'uploading'
  errorMsg.value = ''

  try {
    await store.submitHomework(props.assignment.id, {
      file: file.value,
      comment: comment.value || undefined,
    })
    status.value = 'success'
    emit('submitted')
  } catch (err) {
    status.value = 'error'
    errorMsg.value = (err as Error).message
  }
}
</script>

<template>
  <div class="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold">提交作業</h3>
      <button @click="emit('close')" class="text-slate-500 hover:text-white transition-colors">
        <X :size="18" />
      </button>
    </div>

    <p class="text-sm text-slate-400 mb-1">{{ assignment.title }}</p>
    <p class="text-xs text-slate-500 mb-6">支援圖片、PDF 或文件，最大 10 MB</p>

    <!-- Drop zone -->
    <div
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="handleDrop"
      :class="[
        'border-2 border-dashed rounded-2xl p-6 md:p-8 transition-all cursor-pointer text-center mb-4',
        dragOver ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-700 hover:border-emerald-500/50'
      ]"
      @click="($refs.fileInput as HTMLInputElement).click()"
    >
      <div v-if="file" class="flex items-center justify-center gap-2 text-emerald-400">
        <FileUp :size="20" />
        <span class="text-sm font-medium">{{ file.name }}</span>
        <button @click.stop="file = null" class="text-slate-500 hover:text-rose-400 ml-2">
          <X :size="14" />
        </button>
      </div>
      <div v-else class="flex flex-col items-center gap-2">
        <Upload :size="28" class="text-emerald-500" />
        <p class="text-[10px] text-slate-500">點擊或拖放檔案上傳</p>
      </div>
    </div>

    <input ref="fileInput" type="file" class="hidden" @change="handleFileSelect" />

    <!-- Comment -->
    <textarea
      v-model="comment"
      placeholder="備註（選填）"
      rows="2"
      class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 mb-4 resize-none"
    />

    <!-- Error message -->
    <p v-if="errorMsg" class="text-xs text-rose-400 mb-3">{{ errorMsg }}</p>

    <!-- Submit button -->
    <button
      @click="handleSubmit"
      :disabled="!file || status === 'uploading' || status === 'success'"
      :class="[
        'w-full py-3 md:py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2',
        status === 'success'
          ? 'bg-emerald-500/20 text-emerald-400'
          : status === 'error'
            ? 'bg-rose-500/20 text-rose-400'
            : !file
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
      ]"
    >
      <template v-if="status === 'idle'">上傳作業</template>
      <template v-if="status === 'uploading'">
        <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </template>
      <template v-if="status === 'success'">
        <CheckCircle2 :size="16" /> 提交成功
      </template>
      <template v-if="status === 'error'">重新提交</template>
    </button>
  </div>
</template>
