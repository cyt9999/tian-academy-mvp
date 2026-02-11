import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getMe } from '@/services/homeworkApi';
import type { UserProfile } from '@/types';

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isStudent = computed(() => profile.value?.role === 'student');
  const isTutor = computed(() => profile.value?.role === 'tutor');
  const role = computed(() => profile.value?.role || null);

  async function fetchProfile() {
    if (loading.value) return;
    loading.value = true;
    error.value = null;

    try {
      profile.value = await getMe();
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  }

  function clear() {
    profile.value = null;
    error.value = null;
  }

  return { profile, loading, error, isStudent, isTutor, role, fetchProfile, clear };
});
