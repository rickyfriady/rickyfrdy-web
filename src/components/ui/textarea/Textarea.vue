<script setup lang="ts">
import { cn } from '@/utils/cn'
import { computed } from 'vue'

interface Props {
  class?: string
  modelValue?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaClass = computed(() =>
  cn(
    'border-border bg-background text-foreground placeholder:text-muted focus-visible:ring-accent/50 flex min-h-28 w-full rounded-xl border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
    props.class
  )
)
</script>

<template>
  <textarea
    :class="textareaClass"
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
