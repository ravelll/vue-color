import { shallow } from '@vue/test-utils'
import { createRenderer } from 'vue-server-renderer'
import randomInt from 'random-int'

import Hue from '../../../src/components/common/Hue'

describe('Hue.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(Hue)
  })

  test('renders correctly', () => {
    const renderer = createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) throw new Error(err)
      expect(str).toMatchSnapshot()
    })
  })

  test('has the right class in vertical mode', () => {
    wrapper.setProps({
      direction: 'vertical'
    })
    expect(wrapper.classes()).toContain('vc-hue--vertical')
  })

  test('should not exceed min and max', () => {
    wrapper.setProps({
      direction: 'vertical',
      color: {
        h: 0,
        s: randomInt(100),
        l: randomInt(100)
      }
    })

    const pointer = wrapper.find('.vc-hue-pointer')
    expect(pointer.element.style.bottom).toBe('0%')

    wrapper.setProps({
      direction: 'horizontal',
      color: {
        h: 360,
        s: randomInt(100),
        l: randomInt(100)
      }
    })

    expect(pointer.element.style.left).toBe('0%')
  })

  test('drag', () => {
    wrapper.setData({ containerSize: 100 })

    /* --- 触发顺序 -- */
    /* PC 拖拽:  mousedown(handleMouseDown) -> onDragStart -> onDragging * n -> onDragEnd */
    /* PC 点击:  mousedown(handleMouseDown) -> onDragStart -> onDragEnd */
    /* mobile 拖拽:  mousedown(handleMouseDown) -> onDragStart -> onDragging * n -> onDragEnd */
    /* mobile 点击:  touchstart(handleMouseDown) -> onDragStart -> onDragEnd */

    wrapper.vm.handleSliderClick({ clientX: 60, clientY: 0, preventDefault () {} })
    expect(wrapper.vm.$data._color.hsl.h).toBe(216)

    wrapper.vm.onDragStart({ clientX: 60, clientY: 0, preventDefault () {} })
    expect(wrapper.vm.$data.startX).toBe(60)
    expect(wrapper.vm.$data.startPosition).toBe(60)
    expect(wrapper.vm.$data.dragging).toBe(true)

    wrapper.vm.onDragging({ clientX: 80, clientY: 0, preventDefault () {} })
    expect(wrapper.vm.$data._color.hsl.h).toBe(288)

    wrapper.vm.onDragEnd()
    expect(wrapper.vm.$data.dragging).toBe(false)
  })

  test('emit', () => {
    const stub = jest.fn()
    wrapper.vm.$on('change', stub)
    wrapper.vm.handleChange(1)

    expect(stub).toBeCalledWith({'a': 1, 'hex': '#4D1C19', 'hsl': {'a': 1, 'h': 3.5999999999999996, 'l': 0.2, 's': 0.5097000000000002}, 'hsv': {'a': 1, 'h': 3.5999999999999996, 's': 0.6752334900973704, 'v': 0.30194000000000004}, 'oldHue': 3.6, 'rgba': {'a': 1, 'b': 25, 'g': 28, 'r': 77}, 'source': 'hsl'})
  })
})
