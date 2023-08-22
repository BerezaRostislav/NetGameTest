<template>
  <v-text-field
    v-model="searchText"
    variant="outlined"
    class="search-field"
    label="Search"
    clearable
    prepend-inner-icon="mdi-magnify"
  />
</template>

<script setup>
import { ref, watch } from 'vue';
import { useNoteStore } from '@/stores/notes.ts';

const noteStore = useNoteStore();
const searchText = ref('');

watch(searchText, (newSearchText) => {
  noteStore.searchNotes(newSearchText);

  if (!newSearchText) {
    noteStore.initialize();
  }
});
</script>

<style lang="scss">

.search-field {
  width: 300px;
  min-width: 140px;
}

</style>