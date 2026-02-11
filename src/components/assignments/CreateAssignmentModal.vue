<script setup lang="ts">
import { ref } from 'vue'
import { X, Upload, FileUp } from 'lucide-vue-next'
import { useAssignmentStore } from '@/stores/assignments'

const emit = defineEmits<{
  close: []
  created: []
}>()

const store = useAssignmentStore()
const title = ref('')
const description = ref('')
const dueDate = ref('')
const file = ref<File | null>(null)
const submitting = ref(false)
const error = ref('')

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) file.value = input.files[0]
}

const handleSubmit = async () => {
  if (!title.value.trim()) {
    error.value = '請輸入作業標題'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    await store.createAssignment({
      title: title.value.trim(),
      description: description.value.trim() || undefined,
      due_date: dueDate.value || undefined,
      file: file.value || undefined,
    })
    emit('created')
    emit('close')
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="emit('close')">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold">建立新作業</h2>
        <button @click="emit('close')" class="text-slate-500 hover:text-white transition-colors">
          <X :size="20" />
        </button>
      </div>

      <div class="space-y-4">
        <!-- Title -->
        <div>
          <label class="block text-xs text-slate-500 mb-1.5 font-medium">作業標題 *</label>
          <input
            v-model="title"
            type="text"
            placeholder="例如：第一次 Sell Put 實錄"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-xs text-slate-500 mb-1.5 font-medium">作業說明</label>
          <textarea
            v-model="description"
            placeholder="詳細描述作業要求..."
            rows="3"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none"
          />
        </div>

        <!-- Due date -->
        <div>
          <label class="block text-xs text-slate-500 mb-1.5 font-medium">截止日期</label>
          <input
            v-model="dueDate"
            type="date"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <!-- Attachment -->
        <div>
          <label class="block text-xs text-slate-500 mb-1.5 font-medium">附件（選填）</label>
          <div
            class="border-2 border-dashed border-slate-700 rounded-xl p-4 hover:border-emerald-500/50 transition-all cursor-pointer text-center"
            @click="($refs.fileInput as HTMLInputElement).click()"
          >
            <div v-if="file" class="flex items-center justify-center gap-2 text-emerald-400">
              <FileUp :size="16" />
              <span class="text-sm">{{ file.name }}</span>
              <button @click.stop="file = null" class="text-slate-500 hover:text-rose-400 ml-2">
                <X :size="14" />
              </button>
            </div>
            <div v-else class="flex items-center justify-center gap-2 text-slate-500">
              <Upload :size="16" />
              <span class="text-xs">點擊上傳附件</span>
            </div>
          </div>
          <input ref="fileInput" type="file" class="hidden" @change="handleFileSelect" />
        </div>
      </div>

      <!-- Error -->
      <p v-if="error" class="text-xs text-rose-400 mt-3">{{ error }}</p>

      <!-- Actions -->
      <div class="flex gap-3 mt-6">
        <button
          @click="emit('close')"
          class="flex-1 py-3 rounded-xl border border-slate-700 text-sm text-slate-400 hover:text-white hover:border-slate-600 transition-all"
        >
          取消
        </button>
        <button
          @click="handleSubmit"
          :disabled="submitting || !title.trim()"
          :class="[
            'flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2',
            submitting || !title.trim()
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
          ]"
        >
          <div v-if="submitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span v-else>建立作業</span>
        </button>
      </div>
    </div>
  </div>
</template>
