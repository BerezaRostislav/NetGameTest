import { defineStore } from 'pinia';
import { openDB } from 'idb';

interface Note {
  id: number;
  title: string;
  created_time: string;
  short_text: string;
}

export const useNoteStore = defineStore('noteStore', {
  state: () => ({
    noteObjects: [] as Note[],
    activeNote: null as Note | null,
    deleteConfirmation: false,
  }),

  actions: {
    async initialize() {
      this.noteObjects = await this.loadNoteObjectsFromIndexedDB();
    },

    async openNoteDB() {
      const db = await openDB('noteAppDB', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('notes')) {
            db.createObjectStore('notes', { keyPath: 'id' });
          }
        },
      });

      return db;
    },

    async saveNoteObjectsToIndexedDB(noteObjects: Note[]) {
      const db = await this.openNoteDB();
      const tx = db.transaction('notes', 'readwrite');
      const store = tx.objectStore('notes');
      
      const serializedNotes = noteObjects.map((note) => ({
        id: note.id,
        title: note.title,
        created_time: note.created_time,
        short_text: note.short_text,
      }));

      await Promise.all(serializedNotes.map((note) => store.put(note)));
    },

    async loadNoteObjectsFromIndexedDB(): Promise<Note[]> {
      const db = await this.openNoteDB();
      const tx = db.transaction('notes', 'readonly');
      const store = tx.objectStore('notes');
      const serializedNotes: any[] = await store.getAll();
      return serializedNotes.map((note) => ({
        id: note.id,
        title: note.title,
        created_time: note.created_time,
        short_text: note.short_text,
      }));
    },

    async addNote() {
      const currentTime = new Date();
      const formattedTime = `${this.formatDate(currentTime)} ${this.formatTime(currentTime)}`;
      const id = this.noteObjects.length;

      const newNote: Note = {
        id: id,
        title: 'title',
        created_time: formattedTime,
        short_text: 'short text',
      };

      this.noteObjects.push(newNote);
      await this.saveNoteObjectsToIndexedDB(this.noteObjects);
    },

    async deleteActiveNote() {
      if (this.activeNote) {
        const db = await this.openNoteDB();
        await db.delete('notes', this.activeNote.id);

        const index = this.noteObjects.findIndex((note) => note === this.activeNote);
        if (index !== -1) {
          this.noteObjects.splice(index, 1);
          this.activeNote = null;
          this.deleteConfirmation = false;

          await this.saveNoteObjectsToIndexedDB(this.noteObjects);
        }
      }
    },

    setActiveNote(note: Note) {
      this.activeNote = note === this.activeNote ? null : note;
    },

    formatDate(date: Date): string {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },

    formatTime(date: Date): string {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    },
  },
});