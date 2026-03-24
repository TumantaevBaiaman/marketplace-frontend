<script setup lang="ts">
import { ref } from 'vue'
import { useLogin } from '../model/useLogin'
import { AppInput, AppButton } from '@/shared/ui'

const { login, error, loading } = useLogin()
const email = ref('')
const password = ref('')
</script>

<template>
  <form class="auth-form" @submit.prevent="login(email, password)">
    <h2 class="auth-form__title">Вход</h2>
    <div v-if="error" class="auth-form__error">{{ error }}</div>
    <AppInput v-model="email" label="Email" type="email" required placeholder="you@example.com" />
    <AppInput
      v-model="password"
      label="Пароль"
      type="password"
      required
      placeholder="••••••••"
    />
    <AppButton type="submit" :loading="loading" class="auth-form__submit">Войти</AppButton>
    <p class="auth-form__hint">
      Нет аккаунта? <RouterLink to="/register">Зарегистрироваться</RouterLink>
    </p>
  </form>
</template>
