<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

defineProps<{
  title?: string
  size?: 'sm' | 'md' | 'lg'
}>()
const emit = defineEmits<{ close: [] }>()

const modalEl = ref<HTMLElement | null>(null)
let previousFocus: HTMLElement | null = null

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function trapTab(e: KeyboardEvent) {
  if (!modalEl.value) return
  const focusable = Array.from(modalEl.value.querySelectorAll<HTMLElement>(FOCUSABLE))
  if (!focusable.length) { e.preventDefault(); return }
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus() }
  } else {
    if (document.activeElement === last) { e.preventDefault(); first.focus() }
  }
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') { emit('close'); return }
  if (e.key === 'Tab') trapTab(e)
}

onMounted(() => {
  previousFocus = document.activeElement as HTMLElement | null
  document.addEventListener('keydown', onKey)
  document.body.style.overflow = 'hidden'
  const first = modalEl.value?.querySelector<HTMLElement>(FOCUSABLE)
  first?.focus()
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
  previousFocus?.focus()
})
</script>

<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click.self="$emit('close')">
      <div
        ref="modalEl"
        :class="['modal', `modal--${size ?? 'md'}`]"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? 'modal-title' : undefined"
      >
        <div class="modal__header">
          <h3 id="modal-title" class="modal__title">{{ title }}</h3>
          <button class="modal__close" @click="$emit('close')">✕</button>
        </div>
        <div class="modal__body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="modal__footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
