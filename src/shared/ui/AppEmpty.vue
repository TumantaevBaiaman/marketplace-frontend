<script setup lang="ts">
defineProps<{ message?: string }>()
</script>

<template>
  <div class="empty-state">
    <p class="empty-state__text">{{ message ?? 'Нет данных' }}</p>
  </div>
</template>
