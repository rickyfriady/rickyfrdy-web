<script setup lang="ts">
import { cn } from '@/utils/cn'
import { computed } from 'vue'

interface Props {
  class?: string
  modelValue?: string | number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputClass = computed(() =>
  cn(
    'border-border bg-background text-foreground placeholder:text-muted focus-visible:ring-accent/50 flex h-11 w-full rounded-xl border px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
    props.class
  )
)
</script>

<template>
  <input
    :class="inputClass"
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
