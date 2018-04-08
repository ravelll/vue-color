import { shallow } from 'vue-test-utils'
import { createRenderer } from 'vue-server-renderer'
import randomInt from 'random-int'

import Alpha from '../../../src/components/common/Alpha'

describe('Alpha.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(Alpha)
  })

  test('renders correctly', () => {
    const renderer = createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) throw new Error(err)
      expect(str).toMatchSnapshot()
    })
  })

  test('click', () => {
    wrapper.vm.$refs.container = { clientWidth: 100, getBoundingClientRect () { return { left: 0 } } }
    wrapper.vm.handleChange({pageX: 60, preventDefault () {}})
    expect(wrapper.vm.$data._color.a).toBe(0.6)
  })

  test('should not exceed min and max', () => {
    wrapper.setProps({
      color: {
        h: randomInt(360),
        s: randomInt(100),
        l: randomInt(100),
        a: 0
      }
    })

    const pointer = wrapper.find('.vc-alpha-pointer')
    expect(pointer.element.style.left).toBe('0%')

    wrapper.setProps({
      color: {
        h: randomInt(360),
        s: randomInt(100),
        l: randomInt(100),
        a: 1
      }
    })

    expect(pointer.hasStyle('left', '100%')).toBe(true)

    wrapper.vm.handleChange({pageX: -1, preventDefault () {}})
    expect(wrapper.vm.$data._color.a).toBe(0)

    wrapper.vm.$refs.container = { clientWidth: 100, getBoundingClientRect () { return { left: 0 } } }
    wrapper.vm.handleChange({pageX: 101, preventDefault () {}})
    expect(wrapper.vm.$data._color.a).toBe(1)
    expect(pointer.element.style.left).toBe('100%')
  })
})
