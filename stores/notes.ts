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
    originalNoteObjects: [] as Note[],
    noteObjects: [] as Note[],
    activeNote: null as Note | null,
    deleteConfirmation: false,
  }),

  actions: {
    async initialize() {
      if (typeof window !== 'undefined' && 'indexedDB' in window) {
        this.originalNoteObjects = await this.loadNoteObjectsFromIndexedDB();
        this.noteObjects = this.originalNoteObjects;

        if (this.noteObjects.length > 0) {
          this.activeNote = this.noteObjects[0];
        }
      }
    },

    async openNoteDB() {
      if (typeof window !== 'undefined' && 'indexedDB' in window) {
        const db = await openDB('noteAppDB', 1, {
          upgrade(db) {
            if (!db.objectStoreNames.contains('notes')) {
              db.createObjectStore('notes', { keyPath: 'id' });
            }
          },
        });

        return db;
      }
    },

    async searchNotes(searchText: string) {
      const normalizedSearchText = searchText.toLowerCase();

      if (!normalizedSearchText) {
        this.noteObjects = this.originalNoteObjects;
      } else {
        const filteredNotes = this.originalNoteObjects.filter((note: { short_text: string }) =>
          note.short_text.toLowerCase().includes(normalizedSearchText)
        );
        this.noteObjects = filteredNotes;
      }
    },

    async saveNoteObjectsToIndexedDB(noteObjects: Note[]) {
      if (typeof window !== 'undefined' && 'indexedDB' in window) {
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
      }
    },

    async loadNoteObjectsFromIndexedDB(): Promise<Note[]> {
      if (typeof window !== 'undefined' && 'indexedDB' in window) {
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
      }
      return [];
    },

    async addNote() {
      if (typeof window !== 'undefined' && 'indexedDB' in window) {
        const currentTime = new Date();
        const formattedTime = `${this.formatDate(currentTime)} ${this.formatTime(currentTime)}`;
        const id = this.noteObjects.length;

        const newNote: Note = {
          id: id,
          title: '',
          created_time: formattedTime,
          short_text: '',
        };

        this.noteObjects.push(newNote);
        await this.saveNoteObjectsToIndexedDB(this.noteObjects);

        this.activeNote = newNote;
      }
    },

    async deleteActiveNote() {
      if (typeof window !== 'undefined' && 'indexedDB' in window && this.activeNote) {
        const db = await this.openNoteDB();
        await db.delete('notes', this.activeNote.id);

        const index = this.noteObjects.findIndex((note: any) => note === this.activeNote);
        if (index !== -1) {
          this.noteObjects.splice(index, 1);
          this.deleteConfirmation = false;

          if (this.noteObjects.length > 0) {
            this.activeNote = this.noteObjects[0];
          } else {
            this.activeNote = null;
          }

          await this.saveNoteObjectsToIndexedDB(this.noteObjects);
        }
      }
    },

    setActiveNote(note: Note) {
      this.activeNote = note === this.activeNote ? null : note;
    },

    generateTitleFromFirstLineAndWords(shortText: string): string {
      const firstLine = shortText.split('\n')[0];
      const words = firstLine.split(' ');
      const firstWords = words.slice(0, 4);
      const title = firstWords.join(' ').substr(0, 20);
      return title;
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
