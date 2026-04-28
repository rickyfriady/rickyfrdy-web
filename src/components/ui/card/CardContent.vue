<script setup lang="ts">
import { cn } from '@/utils/cn'
import { computed } from 'vue'

interface Props {
  class?: string
}

const props = defineProps<Props>()

const contentClass = computed(() => cn('p-6 pt-0', props.class))
</script>

<template>
  <div :class="contentClass">
    <slot />
  </div>
</template>
