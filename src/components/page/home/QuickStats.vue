<script setup lang="ts">
const stats = [
  { key: 'experience', value: '4 years' },
  { key: 'shipped', value: '25 projects' },
  { key: 'stack', value: 'Node.js · TypeScript · Vue 3' },
  { key: 'status', value: 'open to work' }
]
</script>

<template>
  <div class="border-border border-y py-5">
    <div
      class="grid grid-cols-1 gap-x-10 gap-y-2.5 sm:grid-cols-2 lg:flex lg:flex-wrap lg:gap-x-12"
    >
      <div
        v-for="(stat, index) in stats"
        :key="stat.key"
        v-motion
        :initial="{ opacity: 0 }"
        :visible="{ opacity: 1 }"
        :delay="index * 60"
        class="flex items-baseline gap-2"
      >
        <span
          class="shrink-0 font-mono text-[11px]"
          style="color: var(--color-muted); min-width: 80px"
          >{{ stat.key }}:</span
        >
        <span class="font-mono text-[11px]" style="color: var(--color-foreground)">{{
          stat.value
        }}</span>
      </div>
    </div>
  </div>
</template>
