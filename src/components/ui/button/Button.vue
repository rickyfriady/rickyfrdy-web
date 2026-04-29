<script setup lang="ts">
import { cn } from '@/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { computed } from 'vue'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg border text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-accent bg-accent text-background hover:bg-accent-hover hover:-translate-y-px',
        secondary: 'border-border bg-secondary text-foreground hover:border-accent/40',
        outline:
          'border-border bg-background/50 text-foreground hover:border-accent hover:text-accent backdrop-blur-sm',
        ghost: 'border-transparent text-muted hover:bg-secondary hover:text-foreground',
        link: 'border-transparent text-accent underline-offset-4 hover:underline',
        unstyled: ''
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

type ButtonVariants = VariantProps<typeof buttonVariants>

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: string
  asChild?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  as: 'button',
  asChild: false
})

const buttonClass = computed(() =>
  cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)
)
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="buttonClass"
    :style="{ transitionTimingFunction: 'var(--ease-out-quart)' }"
  >
    <slot />
  </Primitive>
</template>
