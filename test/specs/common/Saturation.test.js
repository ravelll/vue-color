import { shallow } from '@vue/test-utils'
import { createRenderer } from 'vue-server-renderer'

import Saturation from '../../../src/components/common/Saturation'

describe('Saturation.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(Saturation)
  })

  test('renders correctly', () => {
    const renderer = createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) throw new Error(err)
      expect(str).toMatchSnapshot()
    })
  })

  test('handle change', () => {
    wrapper.vm.$refs.container = { clientWidth: 100, clientHeight: 100, getBoundingClientRect () { return { left: 0, top: 0 } } }
    wrapper.vm.handleChange({pageX: 60, pageY: 60, preventDefault () {}})
    expect(wrapper.vm.$data._color.hex).toBe('#296647')
  })

  test('should not exceed min and max', () => {
    wrapper.vm.$refs.container = { clientWidth: 100, clientHeight: 100, getBoundingClientRect () { return { left: 0, top: 0 } } }

    const stub = jest.fn()
    wrapper.vm.throttle = (fn, data) => fn(data)
    wrapper.vm.colorChange = stub

    wrapper.vm.handleChange({pageX: -100, pageY: 60, preventDefault () {}})

    expect(stub).toBeCalledWith({
      h: wrapper.vm.color.hsv.h,
      s: 0,
      v: 0.4,
      a: wrapper.vm.color.hsv.a,
      source: 'hsva'
    })

    wrapper.vm.handleChange({pageX: 200, pageY: 60, preventDefault () {}})

    expect(stub).toBeCalledWith({
      h: wrapper.vm.color.hsv.h,
      s: 1,
      v: 0.4,
      a: wrapper.vm.color.hsv.a,
      source: 'hsva'
    })

    wrapper.vm.handleChange({pageX: 60, pageY: -100, preventDefault () {}})

    expect(stub).toBeCalledWith({
      h: wrapper.vm.color.hsv.h,
      s: 0.6,
      v: 1,
      a: wrapper.vm.color.hsv.a,
      source: 'hsva'
    })

    wrapper.vm.handleChange({pageX: 60, pageY: 200, preventDefault () {}})

    expect(stub).toBeCalledWith({
      h: wrapper.vm.color.hsv.h,
      s: 0.6,
      v: 0,
      a: wrapper.vm.color.hsv.a,
      source: 'hsva'
    })
  })

  test('pointer moves correctly according to the value of color', () => {
  })
})
