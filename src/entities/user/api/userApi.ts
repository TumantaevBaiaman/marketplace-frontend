import { apiClient } from '@/shared/api/client'
import type { User } from '../model/types'

export const userApi = {
  getMe: () => apiClient.get<User>('/auth/me').then((r) => r.data),

  login: (email: string, password: string) =>
    apiClient
      .post<{ access_token: string }>('/auth/login', { email, password })
      .then((r) => r.data),

  register: (data: { username: string; email: string; password: string }) =>
    apiClient.post<User>('/users/register', data).then((r) => r.data),
}
