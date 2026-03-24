import { useRouter } from 'vue-router'
import { useUserStore } from '@/entities/user'

export function useLogout() {
  const store = useUserStore()
  const router = useRouter()

  function logout() {
    store.logout()
    router.push('/login')
  }

  return { logout }
}
