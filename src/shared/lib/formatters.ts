const CURRENCY_CONFIG: Record<string, { symbol: string; before: boolean }> = {
  USD: { symbol: '$', before: true },
  EUR: { symbol: '€', before: false },
  RUB: { symbol: '₽', before: false },
  KZT: { symbol: '₸', before: false },
  KGZ: { symbol: 'с', before: false },
}

export function formatPrice(amount: number | string, currency = 'USD'): string {
  const num = Number(amount)
  const formatted = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(num)
  const cfg = CURRENCY_CONFIG[currency]
  if (!cfg) return `${formatted} ${currency}`
  return cfg.before ? `${cfg.symbol}${formatted}` : `${formatted} ${cfg.symbol}`
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('ru-RU').format(new Date(dateStr))
}

export function formatDeliveryDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  if (date.getTime() === yesterday.getTime()) return 'Вчера'
  if (date.getTime() === today.getTime()) return 'Сегодня'
  if (date.getTime() === tomorrow.getTime()) return 'Завтра'

  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}
