import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { userApi } from '../api/userApi'
import type { User } from './types'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.is_admin ?? false)

  async function login(email: string, password: string) {
    const data = await userApi.login(email, password)
    token.value = data.access_token
    localStorage.setItem('token', data.access_token)
    await fetchMe()
  }

  async function fetchMe() {
    user.value = await userApi.getMe()
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return { user, token, isAuthenticated, isAdmin, login, fetchMe, logout }
})
