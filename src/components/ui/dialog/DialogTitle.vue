<script setup lang="ts">
import { cn } from '@/utils/cn'
import { reactiveOmit } from '@vueuse/core'
import {
  DialogTitle as DialogTitlePrimitive,
  type DialogTitleProps,
  useForwardProps
} from 'reka-ui'
import { computed } from 'vue'

interface Props extends DialogTitleProps {
  class?: string
}

const props = defineProps<Props>()
const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegatedProps)
const titleClass = computed(() => cn('text-foreground text-2xl font-bold md:text-3xl', props.class))
</script>

<template>
  <DialogTitlePrimitive v-bind="forwarded" :class="titleClass">
    <slot />
  </DialogTitlePrimitive>
</template>
