<template>
  <div>
    <button @click="addNote">Add Note</button>
    <NoteCard
      v-for="note in noteObjects"
      :key="note.id"
      :note="note"
      :isActive="activeNote === note"
      @click="setActiveNote(note)"
    />
  </div>
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

    const setActiveNote = (note: Note) => {
      activeNote.value = note === activeNote.value ? null : note
    }

    return {
      noteObjects: noteObjectsRef,
      activeNote,
      addNote,
      setActiveNote
    }
  }
})
</script>