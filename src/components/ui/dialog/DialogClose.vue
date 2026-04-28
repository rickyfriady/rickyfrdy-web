<script setup lang="ts">
import { cn } from '@/utils/cn'
import { reactiveOmit } from '@vueuse/core'
import {
  DialogClose as DialogClosePrimitive,
  type DialogCloseProps,
  useForwardProps
} from 'reka-ui'
import { computed } from 'vue'

interface Props extends DialogCloseProps {
  class?: string
}

const props = defineProps<Props>()
const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)
const closeClass = computed(() => cn('inline-flex items-center justify-center', props.class))
</script>

<template>
  <DialogClosePrimitive v-bind="forwarded" :class="closeClass">
    <slot />
  </DialogClosePrimitive>
</template>
