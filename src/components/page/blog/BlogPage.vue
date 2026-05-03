<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Blog — Ricki Friadi',
  meta: [
    {
      name: 'description',
      content:
        'Technical articles about Vue 3, TypeScript, NestJS, microservices, and web development by Ricki Friadi.'
    },
    { property: 'og:title', content: 'Blog — Ricki Friadi' },
    {
      property: 'og:description',
      content: 'Technical articles about Vue 3, TypeScript, NestJS, and web development.'
    },
    { property: 'og:url', content: 'https://rickifriadi.dev/blog' },
    { name: 'twitter:title', content: 'Blog — Ricki Friadi' },
    {
      name: 'twitter:description',
      content: 'Technical articles about Vue 3, TypeScript, NestJS, and web development.'
    }
  ],
  link: [{ rel: 'canonical', href: 'https://rickifriadi.dev/blog' }]
})
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
