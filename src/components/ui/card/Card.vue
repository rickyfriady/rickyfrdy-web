<script setup lang="ts">
import { cn } from '@/utils/cn'
import { computed } from 'vue'

interface Props {
  class?: string
}

const props = defineProps<Props>()

const cardClass = computed(() =>
  cn(
    'rounded-3xl border border-border/80 bg-background/54 shadow-[0_24px_40px_-32px_var(--color-foreground)] backdrop-blur-xl',
    props.class
  )
)
</script>

<template>
  <div :class="cardClass">
    <slot />
  </div>
</template>
