<script setup lang="ts">
import { computed } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-accent text-dark-base',
        secondary: 'border-transparent bg-secondary text-foreground',
        outline: 'text-foreground border-border',
        destructive: 'border-transparent bg-red-500 text-white'
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

const badgeClass = computed(() => 
  cn(badgeVariants({ variant: props.variant }), props.class)
)
</script>

<template>
  <div :class="badgeClass">
    <slot />
  </div>
</template>
