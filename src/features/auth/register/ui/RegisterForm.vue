<script setup lang="ts">
import { ref } from 'vue'
import { useRegister } from '../model/useRegister'
import { AppInput, AppButton } from '@/shared/ui'

const { register, error, loading } = useRegister()
const username = ref('')
const email = ref('')
const password = ref('')
</script>

<template>
  <form
    class="auth-form"
    @submit.prevent="register({ username, email, password })"
  >
    <h2 class="auth-form__title">Регистрация</h2>
    <div v-if="error" class="auth-form__error">{{ error }}</div>
    <AppInput v-model="username" label="Имя пользователя" required placeholder="username" />
    <AppInput v-model="email" label="Email" type="email" required placeholder="you@example.com" />
    <AppInput
      v-model="password"
      label="Пароль"
      type="password"
      required
      placeholder="Минимум 8 символов"
    />
    <AppButton type="submit" :loading="loading" class="auth-form__submit">
      Зарегистрироваться
    </AppButton>
    <p class="auth-form__hint">
      Уже есть аккаунт? <RouterLink to="/login">Войти</RouterLink>
    </p>
  </form>
</template>
