<script setup lang="ts">
import { cn } from '@/utils/cn'
import { reactiveOmit } from '@vueuse/core'
import {
  DialogDescription as DialogDescriptionPrimitive,
  type DialogDescriptionProps,
  useForwardProps
} from 'reka-ui'
import { computed } from 'vue'

interface Props extends DialogDescriptionProps {
  class?: string
}

const props = defineProps<Props>()
const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)
const descriptionClass = computed(() => cn('text-muted text-sm leading-relaxed', props.class))
</script>

<template>
  <DialogDescriptionPrimitive v-bind="forwarded" :class="descriptionClass">
    <slot />
  </DialogDescriptionPrimitive>
</template>
