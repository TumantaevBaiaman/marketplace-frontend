<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
  <button
    :class="['btn', `btn--${variant ?? 'primary'}`, `btn--${size ?? 'md'}`]"
    :disabled="disabled || loading"
    :type="type ?? 'button'"
  >
    <span v-if="loading" class="btn__spinner" />
    <slot />
  </button>
</template>
