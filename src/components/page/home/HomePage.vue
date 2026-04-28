<script setup lang="ts">
import FeaturedProjects from '@/components/page/home/FeaturedProjects.vue'
import JourneyLab from '@/components/page/home/JourneyLab.vue'
import JourneyStrip from '@/components/page/home/JourneyStrip.vue'
import ProjectCTA from '@/components/page/home/ProjectCTA.vue'
import QuickStats from '@/components/page/home/QuickStats.vue'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-vue-next'
import { ref } from 'vue'

const photoError = ref(false)
const photoSrc = `${import.meta.env.BASE_URL}photo.jpg`

const stack = ['TypeScript', 'Node.js', 'Vue 3', 'PostgreSQL', 'Docker', 'REST APIs']
</script>

<template>
  <div>
    <!-- Profile Header -->
    <section
      class="border-border border-b px-4 py-6"
      v-motion
      :initial="{ opacity: 0, y: 12 }"
      :visible="{ opacity: 1, y: 0 }"
      :duration="600"
    >
      <div class="flex items-center gap-4">
        <!-- Circular photo -->
        <div class="border-border h-16 w-16 shrink-0 overflow-hidden rounded-full border-2">
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

        <!-- Availability badge -->
        <div
          class="border-accent/30 bg-accent/10 hidden shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 sm:flex"
        >
          <span class="bg-accent h-1.5 w-1.5 animate-pulse rounded-full" />
          <span class="text-accent font-mono text-[10px] tracking-[0.1em] uppercase"
            >Open to Work</span
          >
        </div>
      </div>
    </section>

    <!-- Hatch separator -->
    <div aria-hidden="true" class="hatch-gutter border-border h-5 border-b" />

    <!-- Info grid -->
    <QuickStats />

    <!-- Hatch separator -->
    <div aria-hidden="true" class="hatch-gutter border-border h-5 border-b" />

    <!-- Stat cards -->
    <div
      class="border-border grid grid-cols-2 border-b"
      v-motion
      :initial="{ opacity: 0 }"
      :visible="{ opacity: 1 }"
      :delay="150"
    >
      <div class="border-border border-r px-4 py-5">
        <p class="text-muted font-mono text-[10px] tracking-[0.14em] uppercase">Projects Shipped</p>
        <p class="title-display mt-1 text-4xl">25</p>
      </div>
      <div class="px-4 py-5">
        <p class="text-muted font-mono text-[10px] tracking-[0.14em] uppercase">Years Experience</p>
        <p class="title-display mt-1 text-4xl">4</p>
      </div>
    </div>

    <!-- Hatch separator -->
    <div aria-hidden="true" class="hatch-gutter border-border h-5 border-b" />

    <!-- About prose -->
    <section
      class="border-border border-b px-4 py-6"
      v-motion
      :initial="{ opacity: 0 }"
      :visible="{ opacity: 1 }"
      :delay="100"
    >
      <h2 class="text-foreground mb-3 text-base font-semibold">About</h2>
      <p class="text-muted text-sm leading-relaxed">
        I'm Ricki Friadi, a fullstack developer building reliable systems and clean interfaces
        across the Node.js and TypeScript ecosystem — from backend APIs to frontend experiences. 4
        years of professional experience shipping products.
      </p>
      <p class="text-muted mt-3 text-sm leading-relaxed">
        Currently
        <span
          class="border-accent/30 bg-accent/10 text-accent rounded border px-1.5 py-0.5 font-mono text-[11px]"
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

    <!-- § 02 — Journey Lab -->
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 02 — Journey Lab</span>
      </div>
      <JourneyLab />
    </section>

    <!-- § 03 — What Shaped My Work -->
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 03 — What Shaped My Work</span>
      </div>
      <JourneyStrip />
    </section>

    <!-- Investigation Board -->
    <ProjectCTA />

    <!-- § 04 — Selected Work -->
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 04 — Selected Work</span>
      </div>
      <FeaturedProjects />
    </section>

    <!-- Final CTA -->
    <section class="px-4 py-12 text-center">
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
