<script setup lang="ts">
import { useId } from 'vue'

const props = defineProps<{
  modelValue: string | number | null
  label?: string
  options: { value: string | number; label: string }[]
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
}>()
defineEmits<{ 'update:modelValue': [value: string] }>()

const selectId = props.label ? useId() : undefined
</script>

<template>
  <div class="field">
    <label v-if="label" :for="selectId" class="field__label">
      {{ label }}
      <span v-if="required" class="field__required">*</span>
    </label>
    <select
      :id="selectId"
      :value="modelValue ?? ''"
      :required="required"
      :disabled="disabled"
      class="field__input field__select"
      :class="{ 'field__input--error': error }"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
    <p v-if="error" class="field__error">{{ error }}</p>
  </div>
</template>
