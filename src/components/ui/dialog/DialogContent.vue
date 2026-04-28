<script setup lang="ts">
import { cn } from '@/utils/cn'
import { reactiveOmit } from '@vueuse/core'
import {
  DialogContent as DialogContentPrimitive,
  DialogOverlay as DialogOverlayPrimitive,
  DialogPortal as DialogPortalPrimitive,
  useForwardPropsEmits,
  type DialogContentEmits,
  type DialogContentProps
} from 'reka-ui'
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false
})

interface Props extends DialogContentProps {
  class?: string
  overlayClass?: string
}

const props = defineProps<Props>()
const emits = defineEmits<DialogContentEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'overlayClass')
const forwarded = useForwardPropsEmits(delegatedProps, emits)

const contentClass = computed(() =>
  cn(
    'border-border bg-secondary fixed top-[50%] left-[50%] z-[100] w-[calc(100vw-1rem)] max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-2xl border shadow-2xl focus:outline-none',
    props.class
  )
)

const overlayClass = computed(() =>
  cn('bg-foreground/45 fixed inset-0 z-[95] backdrop-blur-sm', props.overlayClass)
)
</script>

<template>
  <DialogPortalPrimitive>
    <DialogOverlayPrimitive :class="overlayClass" />
    <DialogContentPrimitive v-bind="forwarded" :class="contentClass">
      <slot />
    </DialogContentPrimitive>
  </DialogPortalPrimitive>
</template>
