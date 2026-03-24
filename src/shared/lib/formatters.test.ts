import { describe, it, expect } from 'vitest'
import { formatPrice, formatDeliveryDate } from './formatters'

describe('formatPrice', () => {
  it('formats USD with symbol before', () => {
    expect(formatPrice(1000, 'USD')).toBe('$1\u00a0000')
  })

  it('formats RUB with symbol after', () => {
    expect(formatPrice(500, 'RUB')).toBe('500 ₽')
  })

  it('formats KZT with symbol after', () => {
    expect(formatPrice(2500, 'KZT')).toBe('2\u00a0500 ₸')
  })

  it('falls back to currency code for unknown currency', () => {
    expect(formatPrice(100, 'GBP')).toContain('GBP')
  })

  it('accepts string amount', () => {
    expect(formatPrice('250', 'USD')).toBe('$250')
  })
})

describe('formatDeliveryDate', () => {
  it('returns "Сегодня" for today', () => {
    const today = new Date().toISOString().slice(0, 10)
    expect(formatDeliveryDate(today)).toBe('Сегодня')
  })

  it('returns "Завтра" for tomorrow', () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
    expect(formatDeliveryDate(tomorrow)).toBe('Завтра')
  })

  it('returns "Вчера" for yesterday', () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    expect(formatDeliveryDate(yesterday)).toBe('Вчера')
  })

  it('returns formatted date for other dates', () => {
    const result = formatDeliveryDate('2024-06-15')
    expect(result).toMatch(/\d+/)
  })
})
