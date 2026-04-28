<script setup lang="ts">
import {
  DialogTrigger as DialogTriggerPrimitive,
  useForwardProps,
  type DialogTriggerProps
} from 'reka-ui'

const props = defineProps<DialogTriggerProps>()
const forwarded = useForwardProps(props)
</script>

<template>
  <DialogTriggerPrimitive v-bind="forwarded">
    <slot />
  </DialogTriggerPrimitive>
</template>
