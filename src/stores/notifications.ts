import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '@/services/homeworkApi';
import type { Notification } from '@/types';

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);
  const loading = ref(false);

  let pollTimer: ReturnType<typeof setInterval> | null = null;

  async function fetch() {
    loading.value = true;
    try {
      const data = await getNotifications();
      notifications.value = data.notifications;
      unreadCount.value = data.unreadCount;
    } catch {
      // silently fail for polling
    } finally {
      loading.value = false;
    }
  }

  async function markRead(id: string) {
    await markNotificationRead(id);
    const n = notifications.value.find((n) => n.id === id);
    if (n && !n.is_read) {
      n.is_read = true;
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    }
  }

  async function markAllRead() {
    await markAllNotificationsRead();
    notifications.value.forEach((n) => (n.is_read = true));
    unreadCount.value = 0;
  }

  function startPolling(intervalMs = 60000) {
    stopPolling();
    fetch();
    pollTimer = setInterval(fetch, intervalMs);
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    fetch,
    markRead,
    markAllRead,
    startPolling,
    stopPolling,
  };
});
