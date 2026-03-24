import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppInput from './AppInput.vue'

describe('AppInput', () => {
  it('renders label when prop provided', () => {
    const wrapper = mount(AppInput, { props: { modelValue: '', label: 'Email' } })
    expect(wrapper.find('label').text()).toBe('Email')
  })

  it('does not render label when prop omitted', () => {
    const wrapper = mount(AppInput, { props: { modelValue: '' } })
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('label for matches input id', () => {
    const wrapper = mount(AppInput, { props: { modelValue: '', label: 'Email' } })
    const labelFor = wrapper.find('label').attributes('for')
    const inputId = wrapper.find('input').attributes('id')
    expect(labelFor).toBeTruthy()
    expect(labelFor).toBe(inputId)
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(AppInput, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('test@example.com')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test@example.com'])
  })

  it('shows error message when error prop set', () => {
    const wrapper = mount(AppInput, {
      props: { modelValue: '', error: 'Обязательное поле' },
    })
    expect(wrapper.find('.field__error').text()).toBe('Обязательное поле')
    expect(wrapper.find('input').classes()).toContain('field__input--error')
  })

  it('passes type prop to input', () => {
    const wrapper = mount(AppInput, { props: { modelValue: '', type: 'password' } })
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  it('defaults to type="text"', () => {
    const wrapper = mount(AppInput, { props: { modelValue: '' } })
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })
})
