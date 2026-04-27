<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="min-h-screen">
    <section class="container mx-auto px-4 pt-16 pb-24 md:px-8 md:pt-24">
      <div class="chapter-heading">
        <span class="chapter-label">§ 01 — Field Notes</span>
      </div>

      <div
        class="mx-auto max-w-xl"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible="{ opacity: 1, y: 0 }"
        :duration="600"
      >
        <h1 class="title-display text-5xl md:text-7xl">Coming Soon.</h1>
        <p class="text-muted mt-6 text-base leading-relaxed md:text-lg">
          Writing in progress — essays on systems, interfaces, and engineering craft.
        </p>
        <div class="mt-10">
          <Button variant="outline" as="a" href="/" aria-label="Back to Home">
            ← Back to Home
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>
