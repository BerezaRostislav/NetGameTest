<template>
  <div>
    <pre>
      {{ noteStore }}
    </pre>
  </div>
</template>

<script setup>
import { useNoteStore } from '@/stores/notes.ts';

const noteStore = useNoteStore();

const showDeleteConfirmation = () => {
  noteStore.deleteConfirmation = true;
};
</script>