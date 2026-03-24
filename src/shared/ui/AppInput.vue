<script setup lang="ts">
import { useId } from 'vue'

const props = defineProps<{
  modelValue: string | number
  label?: string
  type?: string
  placeholder?: string
  error?: string
  required?: boolean
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()

const inputId = props.label ? useId() : undefined
</script>

<template>
  <div class="field">
    <label v-if="label" :for="inputId" class="field__label">{{ label }}</label>
    <input
      :id="inputId"
      :value="modelValue"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      :required="required"
      class="field__input"
      :class="{ 'field__input--error': error }"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="field__error">{{ error }}</p>
  </div>
</template>
