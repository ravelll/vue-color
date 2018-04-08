import { shallow } from '@vue/test-utils'
import { createRenderer } from 'vue-server-renderer'

import EditableInput from '../../../src/components/common/EditableInput'

describe('EditableInput.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(EditableInput, {
      propsData: {
        label: 'test'
      }
    })
  })

  test('renders correctly', () => {
    const renderer = createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) throw new Error(err)
      expect(str).toMatchSnapshot()
    })
  })

  test('checks if value is classified as a Number.', () => {
    wrapper.setProps({
      value: 50
    })
    expect(wrapper.vm.isNumber).toBe(true)

    wrapper.setProps({
      value: 0
    })
    expect(wrapper.vm.isNumber).toBe(true)

    wrapper.setProps({
      value: -0.1
    })
    expect(wrapper.vm.isNumber).toBe(true)

    wrapper.setProps({
      value: '#ffffff'
    })
    expect(wrapper.vm.isNumber).toBe(false)

    wrapper.setProps({
      value: '#1E7349'
    })
    expect(wrapper.vm.isNumber).toBe(false)

    wrapper.setProps({
      value: '10%'
    })
    expect(wrapper.vm.isNumber).toBe(false)
  })

  test('emit', () => {
    const stub = jest.fn()
    wrapper.vm.$on('change', stub)

    wrapper.vm.handleChange(1)
    expect(stub).toBeCalledWith({ test: 1 })
  })

  test('should not exceed max and min', () => {
    const stub = jest.fn()
    wrapper.vm.$on('change', stub)

    wrapper.setProps({
      value: 50,
      max: 100,
      min: 0
    })

    const input = wrapper.find('input')

    input.element.value = 101
    input.trigger('input')
    expect(stub).not.toHaveBeenCalled()

    input.element.value = -1
    input.trigger('input')
    expect(stub).not.toHaveBeenCalled()
  })

  test('handle key down', () => {
    const stub = jest.fn()
    wrapper.vm.$on('change', stub)

    wrapper.setProps({
      value: 1
    })
    const input = wrapper.find('input')

    input.trigger('keydown.up')
    expect(stub).toBeCalledWith({ test: 2 })

    input.trigger('keydown.down')
    expect(stub).toBeCalledWith({ test: 0 })

    wrapper.setProps({
      arrowOffset: 0.01
    })
    input.trigger('keydown.up')
    expect(stub).toBeCalledWith({ test: 1.01 })
    input.trigger('keydown.down')
    expect(stub).toBeCalledWith({ test: 0.99 })
  })
})
