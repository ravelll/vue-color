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
})
