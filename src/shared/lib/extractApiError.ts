export function extractApiError(e: unknown, fallback: string): string {
  if (e && typeof e === 'object' && 'response' in e) {
    const detail = (e as any).response?.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) return detail[0]?.msg ?? fallback
  }
  return fallback
}
