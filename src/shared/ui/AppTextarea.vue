<script setup lang="ts">
import { useId } from 'vue'

const props = defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  rows?: number
  error?: string
  required?: boolean
}>()
defineEmits<{ 'update:modelValue': [value: string] }>()

const textareaId = props.label ? useId() : undefined
</script>

<template>
  <div class="field">
    <label v-if="label" :for="textareaId" class="field__label">
      {{ label }}
      <span v-if="required" class="field__required">*</span>
    </label>
    <textarea
      :id="textareaId"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows ?? 4"
      :required="required"
      class="field__input field__textarea"
      :class="{ 'field__input--error': error }"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <p v-if="error" class="field__error">{{ error }}</p>
  </div>
</template>
