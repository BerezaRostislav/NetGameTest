<template>
  <v-container class="editor">
    <v-row justify="space-between" class="mb-2">
      <v-col cols="auto">
        <v-btn @click="editMode = !editMode" flat density="comfortable" icon="mdi-pencil"></v-btn>
      </v-col>
      <v-col cols="auto">
        <SearchInput />
      </v-col>
    </v-row>

    <v-row v-if="CreatedTime">
      <v-col class="date">
        {{ CreatedTime }}
      </v-col>
    </v-row>

    <div v-if="editMode" class="input-area">
      <v-textarea
        v-model="editedText"
        clearable
        no-resize
        variant="solo"
        @input="saveNote"
        class="text-area"
        bg-color="white"
      />
    </div>
    <div v-else>
      <MarkdownCompiler :markdownString="editedText" />
    </div>

  </v-container>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useNoteStore } from '@/stores/notes.ts';


const noteStore = useNoteStore();
const editedText = ref('');
const editMode = ref(true);
const searchText = ref('');

const CreatedTime = computed(() => {
  return noteStore.activeNote ? noteStore.activeNote.created_time : '';
});

watch(() => noteStore.activeNote, (newActiveNote) => {
  if (newActiveNote) {
    editedText.value = newActiveNote.short_text;
  } else {
    editedText.value = '';
  }
});

watch(editedText, () => {
  if (noteStore.activeNote && editMode) {
    saveNote();
  }
});

function saveNote() {
  if (noteStore.activeNote) {
    noteStore.activeNote.short_text = editedText.value;
    noteStore.activeNote.title = noteStore.generateTitleFromFirstLineAndWords(noteStore.activeNote.short_text);
    noteStore.saveNoteObjectsToIndexedDB(noteStore.noteObjects);
  }
}
</script>

<style lang="scss">

.editor {

  .date {
    text-align: center;
    font-weight: bold;
    color: darkgray;
    margin-bottom: 16px;
  }

  .input-area {
    
    .v-field__outline {
      display: none !important;
    }
    textarea {
      height: 80vh !important;  
    }
  }

}

</style>