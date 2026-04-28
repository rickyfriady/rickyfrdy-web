<script setup lang="ts">
import { cn } from '@/utils/cn'
import { computed } from 'vue'

interface Props {
  class?: string
}

const props = defineProps<Props>()
const footerClass = computed(() =>
  cn('flex items-center justify-between gap-3 p-4 pt-0 md:p-6 md:pt-0', props.class)
)
</script>

<template>
  <div :class="footerClass">
    <slot />
  </div>
</template>
