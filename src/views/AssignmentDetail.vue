<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, FileText, Download, Calendar, Loader2 } from 'lucide-vue-next'
import { useAssignmentStore } from '@/stores/assignments'
import { useUserStore } from '@/stores/user'
import SubmitPanel from '@/components/assignments/SubmitPanel.vue'
import SubmissionRow from '@/components/assignments/SubmissionRow.vue'

const route = useRoute()
const router = useRouter()
const store = useAssignmentStore()
const userStore = useUserStore()

const assignmentId = route.params.id as string
const isTutor = computed(() => userStore.isTutor)

onMounted(() => {
  store.fetchAssignment(assignmentId)
})

const assignment = computed(() => store.currentAssignment)

const formatDate = (d: string | null) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

const handleSubmitted = () => {
  store.fetchAssignment(assignmentId)
}

const handleGraded = () => {
  store.fetchAssignment(assignmentId)
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
    <!-- Back button -->
    <button
      @click="router.push('/assignments')"
      class="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors"
    >
      <ArrowLeft :size="16" />
      返回作業列表
    </button>

    <!-- Loading -->
    <div v-if="store.loading" class="flex items-center justify-center py-20">
      <Loader2 :size="32" class="animate-spin text-emerald-500" />
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="text-center py-20">
      <p class="text-rose-400">{{ store.error }}</p>
    </div>

    <!-- Content -->
    <template v-else-if="assignment">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <!-- Assignment detail -->
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8">
            <h1 class="text-2xl font-bold mb-2">{{ assignment.title }}</h1>

            <div class="flex items-center gap-4 text-xs text-slate-500 mb-4">
              <span v-if="assignment.tutor?.nickname">出題：{{ assignment.tutor.nickname }}</span>
              <span v-if="assignment.due_date" class="flex items-center gap-1">
                <Calendar :size="12" />
                截止：{{ formatDate(assignment.due_date) }}
              </span>
            </div>

            <p v-if="assignment.description" class="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {{ assignment.description }}
            </p>

            <!-- Attachment -->
            <div v-if="assignment.attachment_signed_url" class="mt-4">
              <a
                :href="assignment.attachment_signed_url"
                target="_blank"
                class="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl text-sm text-emerald-400 hover:bg-slate-700 transition-colors"
              >
                <FileText :size="16" />
                附件下載
                <Download :size="12" />
              </a>
            </div>
          </div>

          <!-- Tutor: submissions list -->
          <template v-if="isTutor && assignment.submissions">
            <h2 class="text-lg font-bold">
              學生提交
              <span class="text-sm text-slate-500 font-normal ml-2">{{ assignment.submissions.length }} 份</span>
            </h2>
            <div class="space-y-3">
              <SubmissionRow
                v-for="sub in assignment.submissions"
                :key="sub.id"
                :submission="sub"
                :assignment-id="assignment.id"
                @graded="handleGraded"
              />
            </div>
            <p v-if="assignment.submissions.length === 0" class="text-center text-slate-500 py-8 text-sm">
              尚無學生提交作業
            </p>
          </template>

          <!-- Student: my submission detail -->
          <template v-if="!isTutor && assignment.my_submission">
            <div class="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
              <h3 class="text-sm font-bold text-slate-400 mb-3">我的提交</h3>
              <div class="flex items-center gap-3 mb-3">
                <FileText :size="16" class="text-slate-500" />
                <a
                  v-if="(assignment.my_submission as any).file_signed_url"
                  :href="(assignment.my_submission as any).file_signed_url"
                  target="_blank"
                  class="text-sm text-emerald-400 hover:underline"
                >
                  {{ (assignment.my_submission as any).file_name }}
                </a>
              </div>
              <div v-if="assignment.my_submission.status === 'graded'" class="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div class="flex items-center justify-between mb-2">
                  <p class="text-[10px] font-bold text-emerald-500 uppercase">天哥回饋</p>
                  <p class="text-xl font-bold text-emerald-400">{{ assignment.my_submission.grade }}</p>
                </div>
                <p v-if="(assignment.my_submission as any).feedback" class="text-sm text-slate-300 leading-relaxed">
                  {{ (assignment.my_submission as any).feedback }}
                </p>
              </div>
              <p v-else class="text-xs text-amber-400">作業已提交，等待批改中...</p>
            </div>
          </template>
        </div>

        <!-- Right panel: submit (student only, not yet submitted) -->
        <div v-if="!isTutor">
          <SubmitPanel
            :assignment="assignment"
            @submitted="handleSubmitted"
            @close="router.push('/assignments')"
          />
        </div>
      </div>
    </template>
  </div>
</template>
