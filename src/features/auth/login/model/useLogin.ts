import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/entities/user'
import { extractApiError } from '@/shared/lib/extractApiError'

export function useLogin() {
  const store = useUserStore()
  const router = useRouter()
  const error = ref<string | null>(null)
  const loading = ref(false)

  async function login(email: string, password: string) {
    error.value = null
    loading.value = true
    try {
      await store.login(email, password)
      const redirect = store.isAdmin ? '/admin/products' : '/'
      await router.push(redirect)
    } catch (e) {
      error.value = extractApiError(e, 'Неверный email или пароль')
    } finally {
      loading.value = false
    }
  }

  return { login, error, loading }
}
