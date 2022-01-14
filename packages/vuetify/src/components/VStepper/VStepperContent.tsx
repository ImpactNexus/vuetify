// Styles
import './VStepperContent.sass'

// Components
import { VWindowItem } from '@/components/VWindow'
import { VExpandTransition } from '@/components/transitions'

// Composables
import { useLazy } from '@/composables/lazy'

// Utilities
import { computed, inject } from 'vue'
import { defineComponent } from '@/util'
import { VStepperGroupProvideSymbol, VStepperProvideSymbol } from './VStepper'

export const VStepperContent = defineComponent({
  name: 'VStepperContent',

  inheritAttrs: false,

  props: {
    step: {
      type: Number,
      required: true,
    },
    value: null,
    eager: Boolean,
  },

  setup (props, { slots, emit }) {
    const group = inject(VStepperGroupProvideSymbol)

    if (!group) throw new Error('foo')

    const groupItemId = computed(() => group.findId(props.value))
    const isOpen = computed(() => {
      const id = groupItemId.value
      return id != null ? group.isSelected(id) : false
    })
    const { hasContent, onAfterLeave } = useLazy(props, isOpen)

    const stepper = inject(VStepperProvideSymbol)

    if (!stepper) throw new Error('foo')

    return () => {
      const content = slots[`content.${props.value}`]
        ? slots[`content.${props.value}`]!(group)
        : slots.content
          ? slots.content(group)
          : null

      if (stepper.direction.value === 'vertical') {
        return (
          <div
            class={[
              'v-stepper-content',
              'v-stepper-content--vertical',
            ]}
          >
            <VExpandTransition onAfterLeave={ onAfterLeave }>
              <div
                class="v-stepper-content__wrapper"
                v-show={ isOpen.value }
              >
                { hasContent && content }
              </div>
            </VExpandTransition>
          </div>
        )
      }

      return (
        <VWindowItem
          value={ groupItemId.value }
          class={[
            'v-stepper-content',
            'v-stepper-content--horizontal',
          ]}
        >
          { content }
        </VWindowItem>
      )
    }
  },
})
