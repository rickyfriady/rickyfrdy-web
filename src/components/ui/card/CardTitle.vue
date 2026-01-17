<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  as?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'h3'
})

const titleClass = computed(() => 
  cn('text-2xl font-semibold leading-none tracking-tight', props.class)
)
</script>

<template>
  <component :is="as" :class="titleClass">
    <slot />
  </component>
</template>
