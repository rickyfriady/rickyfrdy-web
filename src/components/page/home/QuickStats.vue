<script setup lang="ts">
import { Briefcase, Clock, MapPin, Zap } from 'lucide-vue-next'

const items = [
  { icon: MapPin, label: 'Jakarta, Indonesia' },
  { icon: Briefcase, label: '3+ years experience' },
  { icon: Zap, label: 'Open to Work' },
  { icon: Clock, label: 'UTC +7 · WIB' }
]
</script>

<template>
  <div class="border-border grid grid-cols-2 border-b">
    <div
      v-for="(item, i) in items"
      :key="item.label"
      class="border-border flex items-center gap-3 px-4 py-3.5"
      :class="{
        'border-r': i % 2 === 0,
        'border-b': i < 2
      }"
    >
      <component :is="item.icon" aria-hidden="true" class="text-muted h-3.5 w-3.5 shrink-0" />
      <span class="text-foreground font-mono text-xs">{{ item.label }}</span>
    </div>
  </div>
</template>
