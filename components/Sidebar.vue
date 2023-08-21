<template>
  <v-container>
    <v-row align="center" justify="start">
      <v-col cols="auto">
        <v-btn @click="addNote" density="comfortable" icon="mdi-plus" ></v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn @click="deleteActiveNote" :disabled="!activeNote" density="comfortable" icon="mdi-trash-can-outline"></v-btn>
      </v-col>
    </v-row>
    <NoteCard
      v-for="note in noteObjects"
      :key="note.id"
      :note="note"
      :isActive="activeNote === note"
      @click="setActiveNote(note)"
    />
    </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

interface Note {
  id: number;
  title: string;
  created_time: string;
  short_text: string;
}

export default defineComponent({

  setup() {
    const noteObjects: Note[] = [
      // Your initial notes
    ]

    const noteObjectsRef = ref<Note[]>(noteObjects)
    const activeNote = ref<Note | null>(null)

    const addNote = () => {
      const currentTime = new Date()
      const formattedTime = `${currentTime.getHours()}:${currentTime.getMinutes()}`

      const newNote: Note = {
        id: noteObjectsRef.value.length,
        title: 'title',
        created_time: formattedTime,
        short_text: 'short text'
      }

      noteObjectsRef.value.push(newNote)
    }

    const deleteActiveNote = () => {
      if (activeNote.value) {
        const index = noteObjectsRef.value.findIndex(note => note === activeNote.value)
        if (index !== -1) {
          noteObjectsRef.value.splice(index, 1)
          activeNote.value = null
        }
      }
    }

    const setActiveNote = (note: Note) => {
      activeNote.value = note === activeNote.value ? null : note
    }

    return {
      noteObjects: noteObjectsRef,
      activeNote,
      addNote,
      setActiveNote,
      deleteActiveNote
    }
  }
})
</script>