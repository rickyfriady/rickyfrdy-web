<script setup lang="ts">
import FeaturedProjects from '@/components/page/home/FeaturedProjects.vue'
import JourneyLab from '@/components/page/home/JourneyLab.vue'
import JourneyStrip from '@/components/page/home/JourneyStrip.vue'
import ProjectCTA from '@/components/page/home/ProjectCTA.vue'
import QuickStats from '@/components/page/home/QuickStats.vue'
import { Button } from '@/components/ui/button'
import { useHead } from '@unhead/vue'
import { User } from 'lucide-vue-next'
import { ref } from 'vue'

useHead({
  title: 'Ricki Friadi — Fullstack Developer',
  meta: [
    {
      name: 'description',
      content:
        'Portfolio of Ricki Friadi, a Fullstack Developer specializing in Vue 3, TypeScript, and NestJS with 3+ years building scalable systems at PT. Pegadaian.'
    },
    { property: 'og:title', content: 'Ricki Friadi — Fullstack Developer' },
    {
      property: 'og:description',
      content:
        'Portfolio of Ricki Friadi, a Fullstack Developer specializing in Vue 3, TypeScript, and NestJS with 3+ years building scalable systems.'
    },
    { property: 'og:url', content: 'https://rickifriadi.dev/' },
    { name: 'twitter:title', content: 'Ricki Friadi — Fullstack Developer' },
    {
      name: 'twitter:description',
      content: 'Fullstack Developer specializing in Vue 3, TypeScript, and NestJS.'
    }
  ],
  link: [{ rel: 'canonical', href: 'https://rickifriadi.dev/' }]
})

const photoError = ref(false)
const photoSrc = `${import.meta.env.BASE_URL}photo.jpg`

const stack = ['TypeScript', 'Vue 3', 'React', 'NestJS', 'PostgreSQL', 'Redis']
</script>

<template>
  <div class="space-y-3 px-4 py-4">
    <!-- Profile Header — glass card -->
    <section
      class="glass-card p-5"
      v-motion
      :initial="{ opacity: 0, y: 12 }"
      :visible="{ opacity: 1, y: 0 }"
      :duration="600"
    >
      <div class="flex items-center gap-4">
        <!-- Circular photo -->
        <div
          class="h-16 w-16 shrink-0 overflow-hidden rounded-full"
          style="border: 2px solid color-mix(in oklch, var(--color-border) 60%, transparent)"
        >
          <img
            v-show="!photoError"
            :src="photoSrc"
            alt="Ricki Friadi"
            class="h-full w-full object-cover"
            @error="photoError = true"
          />
          <div
            v-if="photoError"
            class="bg-secondary flex h-full w-full items-center justify-center"
          >
            <User class="text-muted h-8 w-8" />
          </div>
        </div>

        <!-- Name + role -->
        <div class="min-w-0 flex-1">
          <h1 class="title-display text-2xl leading-none">Ricki Friadi</h1>
          <p class="text-muted mt-1 font-mono text-xs">Fullstack Developer</p>
        </div>

        <!-- Availability badge — glass pill -->
        <div
          class="hidden shrink-0 items-center gap-1.5 rounded-full px-3 py-1 sm:flex"
          style="
            background: color-mix(in oklch, var(--color-accent) 12%, transparent);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid color-mix(in oklch, var(--color-accent) 30%, transparent);
          "
        >
          <span class="bg-accent h-1.5 w-1.5 animate-pulse rounded-full" />
          <span class="text-accent font-mono text-[10px] tracking-[0.1em] uppercase"
            >Open to Work</span
          >
        </div>
      </div>
    </section>

    <!-- Info grid — glass card -->
    <div class="glass-card overflow-hidden">
      <QuickStats />
    </div>

    <!-- Stat cards — glass panels side by side -->
    <div
      class="grid grid-cols-2 gap-3"
      v-motion
      :initial="{ opacity: 0 }"
      :visible="{ opacity: 1 }"
      :delay="150"
    >
      <div class="glass-card px-5 py-5">
        <p class="text-muted font-mono text-[10px] tracking-[0.14em] uppercase">Projects Shipped</p>
        <p class="title-display mt-1 text-4xl">25</p>
      </div>
      <div class="glass-card px-5 py-5">
        <p class="text-muted font-mono text-[10px] tracking-[0.14em] uppercase">Years Experience</p>
        <p class="title-display mt-1 text-4xl">3+</p>
      </div>
    </div>

    <!-- About prose — glass card -->
    <section
      class="glass-card p-5"
      v-motion
      :initial="{ opacity: 0 }"
      :visible="{ opacity: 1 }"
      :delay="100"
    >
      <h2 class="text-foreground mb-3 text-base font-semibold">About</h2>
      <p class="text-muted text-sm leading-relaxed">
        Fullstack Engineer with 3+ years building end-to-end web solutions using TypeScript as the
        core language. Expert in crafting dynamic frontend interfaces with Vue.js and React, and
        developing robust backend services with NestJS and Express. Currently at PT. Pegadaian
        contributing to Micro-Frontend Architecture and microservices at scale.
      </p>
      <p class="text-muted mt-3 text-sm leading-relaxed">
        Currently
        <span
          style="
            background: color-mix(in oklch, var(--color-accent) 12%, transparent);
            border: 1px solid color-mix(in oklch, var(--color-accent) 28%, transparent);
          "
          class="text-accent rounded px-1.5 py-0.5 font-mono text-[11px]"
          >open to work</span
        >
        and building with
        <span
          v-for="tech in stack"
          :key="tech"
          class="border-border bg-secondary mx-0.5 rounded border px-1.5 py-0.5 font-mono text-xs"
          >{{ tech }}</span
        >.
      </p>
    </section>

    <!-- § 02 — Journey Lab — glass card -->
    <section class="glass-card overflow-hidden">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 02 — Journey Lab</span>
      </div>
      <JourneyLab />
    </section>

    <!-- § 03 — What Shaped My Work — glass card -->
    <section class="glass-card overflow-hidden">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 03 — What Shaped My Work</span>
      </div>
      <JourneyStrip />
    </section>

    <!-- Investigation Board -->
    <ProjectCTA />

    <!-- § 04 — Selected Work — glass card -->
    <section class="glass-card overflow-hidden">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 04 — Selected Work</span>
      </div>
      <FeaturedProjects />
    </section>

    <!-- Final CTA — glass panel -->
    <section class="glass-panel py-12 text-center">
      <p class="eyebrow mb-4">Collaboration</p>
      <h2 class="title-display" style="font-size: clamp(2rem, 5vw, 3.5rem)">
        Ready To Build<br />Your Next Product?
      </h2>
      <p class="text-muted mx-auto mt-4 mb-8 max-w-sm text-sm">
        From architecture to interface polish — software that scales and still feels crafted.
      </p>
      <div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button size="lg" as="a" href="/contact">Start a Project</Button>
        <Button size="lg" variant="outline" as="a" href="/about">Read My Story</Button>
      </div>
    </section>
  </div>
</template>
