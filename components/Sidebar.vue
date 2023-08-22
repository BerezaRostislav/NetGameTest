<template>
  <v-container>
    <v-row align="center" justify="start">
      <v-col cols="auto">
        <v-btn @click="noteStore.addNote" flat density="comfortable" icon="mdi-plus"></v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          @click="showDeleteConfirmation"
          flat
          :disabled="!noteStore.activeNote"
          density="comfortable"
          icon="mdi-trash-can-outline"
        ></v-btn>
      </v-col>
    </v-row>
    <NoteCard
      v-for="note in noteStore.noteObjects"
      :key="note.id"
      :note="note"
      :isActive="noteStore.activeNote === note"
      @click="noteStore.setActiveNote(note)"
    />
    <v-dialog v-model="noteStore.deleteConfirmation" max-width="300">
      <v-card>
        <v-card-title>Delete Note?</v-card-title>
        <v-card-actions>
          <v-btn text @click="noteStore.deleteActiveNote">Yes</v-btn>
          <v-btn text @click="noteStore.deleteConfirmation = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { useNoteStore } from '@/stores/notes.ts';

const noteStore = useNoteStore();

const showDeleteConfirmation = () => {
  noteStore.deleteConfirmation = true;
};
</script>