<script setup lang="ts">
import { cn } from '@/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import { computed } from 'vue'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-accent text-background',
        secondary: 'border-border bg-secondary text-foreground',
        outline: 'border-border text-foreground',
        destructive: 'border-transparent bg-red-600 text-white'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

type BadgeVariants = VariantProps<typeof badgeVariants>

interface Props {
  variant?: BadgeVariants['variant']
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const badgeClass = computed(() => cn(badgeVariants({ variant: props.variant }), props.class))
</script>

<template>
  <div :class="badgeClass">
    <slot />
  </div>
</template>
