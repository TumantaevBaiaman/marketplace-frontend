import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '@/entities/user'
import { extractApiError } from '@/shared/lib/extractApiError'

export function useRegister() {
  const router = useRouter()
  const error = ref<string | null>(null)
  const loading = ref(false)

  async function register(data: { username: string; email: string; password: string }) {
    error.value = null
    loading.value = true
    try {
      await userApi.register(data)
      await router.push('/login')
    } catch (e) {
      error.value = extractApiError(e, 'Ошибка при регистрации')
    } finally {
      loading.value = false
    }
  }

  return { register, error, loading }
}
