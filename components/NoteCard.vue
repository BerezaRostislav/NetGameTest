<template>
  <div class="note-card" :class="{ 'active': isActive }">
    <div class="title">{{ note.title }}</div>
    <div class="info">
      <span class="created-time">{{ formatTime(note.created_time) }}</span>
      <span class="short-text">{{ note.short_text }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface Note {
  title: string;
  created_time: string;
  short_text: string;
}

export default defineComponent ({
  props: {
    note: {
      required: true,
      type: Object as PropType<Note>
    },
    isActive: Boolean
  },
  methods: {
    formatTime(time: string): string {
      const [datePart, timePart] = time.split(' ');
      const [hours, minutes] = timePart.split(':');
      return `${hours}:${minutes}`;
    }
  }
})
</script>

<style lang="scss" scoped>
.note-card {
  padding: 1.5rem 1rem;
  margin: 10px;
  font-weight: bold;
  

  &:not(:last-child) {
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc;
  }

  &:hover,&.active {
    border-radius: 8px;
    background-color: rgb(251, 229, 155);
    cursor: pointer;
  }

  .title {
    font-size: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .info {
    display: flex;
    align-items: center;
    margin-top: 5px;

    .created-time {
      margin-right: 10px;
    }

    .short-text {
      color: darkgray;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>