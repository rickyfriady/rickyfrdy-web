<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <div>
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 01 — Field Notes</span>
      </div>

      <div
        class="px-4 pb-12"
        v-motion
        :initial="{ opacity: 0, y: 16 }"
        :visible="{ opacity: 1, y: 0 }"
        :duration="600"
      >
        <h1 class="title-display text-5xl">Coming Soon.</h1>
        <p class="text-muted mt-4 text-sm leading-relaxed">
          Writing in progress — essays on systems, interfaces, and engineering craft.
        </p>
        <div class="mt-8">
          <Button variant="outline" as="a" href="/">← Back to Home</Button>
        </div>
      </div>
    </section>
  </div>
</template>
