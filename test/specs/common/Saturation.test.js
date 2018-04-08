import { shallow } from 'vue-test-utils'
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
})
