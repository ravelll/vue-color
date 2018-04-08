import { shallow } from '@vue/test-utils'
import { createRenderer } from 'vue-server-renderer'

import Checkboard from '../../../src/components/common/Checkboard'

describe('Checkboard.vue', () => {
  let wrapper
  let renderer

  beforeEach(() => {
    wrapper = shallow(Checkboard)
    renderer = createRenderer()
  })

  test('renders correctly', () => {
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) throw new Error(err)
      expect(str).toMatchSnapshot()
    })
  })
})
