import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  listAssignments,
  getAssignment,
  createAssignment as apiCreate,
  deleteAssignment as apiDelete,
  submitHomework as apiSubmit,
  gradeSubmission as apiGrade,
} from '@/services/homeworkApi';
import type { Assignment, Submission } from '@/types';

export const useAssignmentStore = defineStore('assignments', () => {
  const assignments = ref<Assignment[]>([]);
  const currentAssignment = ref<Assignment | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchAssignments() {
    loading.value = true;
    error.value = null;
    try {
      assignments.value = await listAssignments();
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  }

  async function fetchAssignment(id: string) {
    loading.value = true;
    error.value = null;
    try {
      currentAssignment.value = await getAssignment(id);
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  }

  async function createAssignment(data: {
    title: string;
    description?: string;
    due_date?: string;
    file?: File;
  }) {
    const created = await apiCreate(data);
    assignments.value.unshift(created);
    return created;
  }

  async function removeAssignment(id: string) {
    await apiDelete(id);
    assignments.value = assignments.value.filter((a) => a.id !== id);
  }

  async function submitHomework(
    assignmentId: string,
    data: { file: File; comment?: string },
  ): Promise<Submission> {
    const submission = await apiSubmit(assignmentId, data);
    // Refresh list to update status
    await fetchAssignments();
    return submission;
  }

  async function gradeSubmission(
    assignmentId: string,
    submissionId: string,
    data: { grade: string; feedback?: string },
  ): Promise<Submission> {
    const graded = await apiGrade(assignmentId, submissionId, data);
    // Refresh current assignment detail
    if (currentAssignment.value?.id === assignmentId) {
      await fetchAssignment(assignmentId);
    }
    return graded;
  }

  return {
    assignments,
    currentAssignment,
    loading,
    error,
    fetchAssignments,
    fetchAssignment,
    createAssignment,
    removeAssignment,
    submitHomework,
    gradeSubmission,
  };
});
