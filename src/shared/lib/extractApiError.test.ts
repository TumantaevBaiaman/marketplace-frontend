import { describe, it, expect } from 'vitest'
import { extractApiError } from './extractApiError'

describe('extractApiError', () => {
  it('returns fallback for non-object errors', () => {
    expect(extractApiError(null, 'fallback')).toBe('fallback')
    expect(extractApiError('string error', 'fallback')).toBe('fallback')
    expect(extractApiError(undefined, 'fallback')).toBe('fallback')
  })

  it('returns fallback when no response field', () => {
    expect(extractApiError({ message: 'oops' }, 'fallback')).toBe('fallback')
  })

  it('returns string detail from response', () => {
    const err = { response: { data: { detail: 'Неверный пароль' } } }
    expect(extractApiError(err, 'fallback')).toBe('Неверный пароль')
  })

  it('returns first msg from array detail (Pydantic validation)', () => {
    const err = {
      response: { data: { detail: [{ msg: 'field required' }, { msg: 'invalid email' }] } },
    }
    expect(extractApiError(err, 'fallback')).toBe('field required')
  })

  it('returns fallback when array detail has no msg', () => {
    const err = { response: { data: { detail: [{}] } } }
    expect(extractApiError(err, 'fallback')).toBe('fallback')
  })

  it('returns fallback when detail is missing', () => {
    const err = { response: { data: {} } }
    expect(extractApiError(err, 'fallback')).toBe('fallback')
  })
})
