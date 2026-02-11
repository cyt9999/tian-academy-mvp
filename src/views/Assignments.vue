<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Loader2 } from 'lucide-vue-next'
import { useAssignmentStore } from '@/stores/assignments'
import { useUserStore } from '@/stores/user'
import AssignmentCard from '@/components/assignments/AssignmentCard.vue'
import CreateAssignmentModal from '@/components/assignments/CreateAssignmentModal.vue'
import type { Assignment } from '@/types'

const router = useRouter()
const store = useAssignmentStore()
const userStore = useUserStore()

const activeTab = ref<'pending' | 'completed'>('pending')
const showCreateModal = ref(false)

const isTutor = computed(() => userStore.isTutor)

onMounted(() => {
  store.fetchAssignments()
})

// Student: split into pending/completed
const pendingAssignments = computed(() =>
  store.assignments.filter((a) => {
    if (isTutor.value) return true
    return !a.my_submission || a.my_submission.status !== 'graded'
  })
)

const completedAssignments = computed(() =>
  store.assignments.filter((a) => {
    if (isTutor.value) return false
    return a.my_submission?.status === 'graded'
  })
)

const displayedAssignments = computed(() =>
  isTutor.value
    ? store.assignments
    : activeTab.value === 'pending'
      ? pendingAssignments.value
      : completedAssignments.value
)

const handleSelect = (assignment: Assignment) => {
  router.push(`/assignments/${assignment.id}`)
}

const handleCreated = () => {
  store.fetchAssignments()
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold">實戰陪跑作業</h1>
        <p class="text-sm text-slate-400">
          {{ isTutor ? '管理作業與批改學生提交' : '上傳交易紀錄，獲取天哥的一對一心法批改' }}
        </p>
      </div>

      <!-- Student tabs -->
      <div v-if="!isTutor" class="flex bg-slate-900 border border-slate-800 p-1 rounded-xl w-full md:w-auto">
        <button
          @click="activeTab = 'pending'"
          :class="[
            'flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all',
            activeTab === 'pending' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
          ]"
        >
          待交作業
        </button>
        <button
          @click="activeTab = 'completed'"
          :class="[
            'flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all',
            activeTab === 'completed' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
          ]"
        >
          已完成
        </button>
      </div>

      <!-- Tutor: create button -->
      <button
        v-if="isTutor"
        @click="showCreateModal = true"
        class="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-all"
      >
        <Plus :size="18" />
        建立作業
      </button>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="flex items-center justify-center py-20">
      <Loader2 :size="32" class="animate-spin text-emerald-500" />
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="text-center py-20">
      <p class="text-rose-400">{{ store.error }}</p>
      <button @click="store.fetchAssignments()" class="mt-3 text-sm text-emerald-400 hover:underline">
        重試
      </button>
    </div>

    <!-- Assignment list -->
    <div v-else class="space-y-4">
      <AssignmentCard
        v-for="a in displayedAssignments"
        :key="a.id"
        :assignment="a"
        :role="isTutor ? 'tutor' : 'student'"
        @select="handleSelect"
      />

      <!-- Empty state -->
      <div v-if="displayedAssignments.length === 0" class="text-center py-16">
        <p class="text-slate-500 text-sm">
          {{ isTutor ? '尚未建立任何作業' : activeTab === 'pending' ? '沒有待交作業' : '尚無已完成的作業' }}
        </p>
      </div>
    </div>

    <!-- Create modal -->
    <CreateAssignmentModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleCreated"
    />
  </div>
</template>
