<template>
  <v-container>
    <v-row align="center" justify="start">
      <v-col cols="auto">
        <v-btn @click="addNote" flat density="comfortable" icon="mdi-plus"></v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          @click="showDeleteConfirmation"
          flat
          :disabled="!activeNote"
          density="comfortable"
          icon="mdi-trash-can-outline"
        ></v-btn>
      </v-col>
    </v-row>
    <NoteCard
      v-for="note in noteObjects"
      :key="note.id"
      :note="note"
      :isActive="activeNote === note"
      @click="setActiveNote(note)"
    />
    <v-dialog v-model="deleteConfirmation" max-width="300">
      <v-card>
        <v-card-title>Delete Note?</v-card-title>
        <v-card-actions>
          <v-btn text @click="deleteActiveNote">Yes</v-btn>
          <v-btn text @click="deleteConfirmation = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { openDB } from 'idb';

interface Note {
  id: number;
  title: string;
  created_time: string;
  short_text: string;
}

const dbName = 'noteAppDB';
const storeName = 'notes';

export default defineComponent({
  setup() {
    const noteObjectsRef = ref<Note[]>([]);
    const activeNote = ref<Note | null>(null);
    const deleteConfirmation = ref(false);

    const showDeleteConfirmation = () => {
      deleteConfirmation.value = true;
    };

    async function openNoteDB() {
      const db = await openDB(dbName, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        },
      });

      return db;
    }

    async function saveNoteObjectsToIndexedDB(noteObjects: Note[]) {
      const db = await openNoteDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      
      const serializedNotes = noteObjects.map((note) => {
        return {
          id: note.id,
          title: note.title,
          created_time: note.created_time,
          short_text: note.short_text,
        };
      });

      await Promise.all(serializedNotes.map((note) => store.put(note)));
    }

    async function loadNoteObjectsFromIndexedDB(): Promise<Note[]> {
      const db = await openNoteDB();
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const serializedNotes: any[] = await store.getAll();
      return serializedNotes.map((note) => {
        return {
          id: note.id,
          title: note.title,
          created_time: note.created_time,
          short_text: note.short_text,
        };
      });
    }

    async function addNote() {
      const currentTime = new Date();
      const formattedTime = `${formatDate(currentTime)} ${formatTime(currentTime)}`;
      const id = noteObjectsRef.value.length

      const newNote: Note = {
        id: id,
        title: 'title',
        created_time: formattedTime,
        short_text: 'short text',
      };

      noteObjectsRef.value.push(newNote);
      console.log(noteObjectsRef.value)
      await saveNoteObjectsToIndexedDB(noteObjectsRef.value);
    }

    async function deleteActiveNote() {
      if (activeNote.value) {
        const db = await openNoteDB();
        await db.delete(storeName, activeNote.value.id);

        const index = noteObjectsRef.value.findIndex((note) => note === activeNote.value);
        if (index !== -1) {
          noteObjectsRef.value.splice(index, 1);
          activeNote.value = null;
          deleteConfirmation.value = false;

          await saveNoteObjectsToIndexedDB(noteObjectsRef.value);
        }
      }
    }

    const setActiveNote = (note: Note) => {
      activeNote.value = note === activeNote.value ? null : note;
    };

    const formatDate = (date: Date): string => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const formatTime = (date: Date): string => {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    };

    // Load existing notes from IndexedDB during initialization
    (async () => {
      noteObjectsRef.value = await loadNoteObjectsFromIndexedDB();
    })();

    return {
      noteObjects: noteObjectsRef,
      activeNote,
      deleteConfirmation,
      showDeleteConfirmation,
      addNote,
      deleteActiveNote,
      setActiveNote,
    };
  },
});
</script>