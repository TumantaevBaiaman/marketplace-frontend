import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppButton from './AppButton.vue'

describe('AppButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(AppButton, { slots: { default: 'Сохранить' } })
    expect(wrapper.text()).toContain('Сохранить')
  })

  it('is disabled when loading=true', () => {
    const wrapper = mount(AppButton, { props: { loading: true } })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('is disabled when disabled=true', () => {
    const wrapper = mount(AppButton, { props: { disabled: true } })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('shows spinner when loading', () => {
    const wrapper = mount(AppButton, { props: { loading: true } })
    expect(wrapper.find('.btn__spinner').exists()).toBe(true)
  })

  it('applies variant class', () => {
    const wrapper = mount(AppButton, { props: { variant: 'danger' } })
    expect(wrapper.find('button').classes()).toContain('btn--danger')
  })

  it('defaults to primary variant', () => {
    const wrapper = mount(AppButton, {})
    expect(wrapper.find('button').classes()).toContain('btn--primary')
  })

  it('sets button type attribute', () => {
    const wrapper = mount(AppButton, { props: { type: 'submit' } })
    expect(wrapper.find('button').attributes('type')).toBe('submit')
  })
})
