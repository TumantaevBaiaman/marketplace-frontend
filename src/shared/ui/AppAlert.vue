<script setup lang="ts">
defineProps<{
  type?: 'error' | 'success' | 'warning' | 'info'
  message: string
}>()
</script>

<template>
  <div :class="['alert', `alert--${type ?? 'error'}`]">
    <span class="alert__icon">
      <span v-if="type === 'success'">✓</span>
      <span v-else-if="type === 'warning'">⚠</span>
      <span v-else-if="type === 'info'">ℹ</span>
      <span v-else>✕</span>
    </span>
    {{ message }}
  </div>
</template>
