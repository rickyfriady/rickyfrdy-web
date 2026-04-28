<script setup lang="ts">
import { cn } from '@/utils/cn'
import { computed } from 'vue'

interface Props {
  class?: string
}

const props = defineProps<Props>()

const descriptionClass = computed(() => cn('text-sm text-muted', props.class))
</script>

<template>
  <p :class="descriptionClass">
    <slot />
  </p>
</template>
