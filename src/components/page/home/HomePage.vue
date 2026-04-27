<script setup lang="ts">
import FeaturedProjects from '@/components/page/home/FeaturedProjects.vue'
import JourneyLab from '@/components/page/home/JourneyLab.vue'
import JourneyStrip from '@/components/page/home/JourneyStrip.vue'
import ProjectCTA from '@/components/page/home/ProjectCTA.vue'
import QuickStats from '@/components/page/home/QuickStats.vue'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero: full-width typographic statement, no right column -->
    <section class="container mx-auto px-4 pt-16 pb-10 md:px-8 md:pt-24 md:pb-14">
      <div
        v-motion
        :initial="{ opacity: 0, y: 24 }"
        :visible="{ opacity: 1, y: 0 }"
        :duration="700"
      >
        <p class="eyebrow mb-6">Fullstack Developer · Jakarta</p>

        <h1
          class="title-display"
          style="font-size: clamp(3.2rem, 8vw, 8rem); line-height: 0.92; letter-spacing: -0.02em"
        >
          Engineering Systems,<br />
          <span class="title-accent text-accent">Designing Presence.</span>
        </h1>

        <hr class="border-border my-6" />

        <p
          v-motion
          :initial="{ opacity: 0 }"
          :visible="{ opacity: 1 }"
          :delay="300"
          class="text-muted font-mono text-xs tracking-[0.18em] uppercase"
        >
          Ricki Friadi&nbsp;·&nbsp;Available for Work&nbsp;·&nbsp;2026
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <Button size="lg" as="a" href="/works">
            Explore Works
            <ArrowRight class="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" as="a" href="/contact"> Start a Conversation </Button>
        </div>
      </div>
    </section>

    <!-- Quick Stats -->
    <section class="container mx-auto px-4 md:px-8">
      <QuickStats />
    </section>

    <!-- § 02 — Journey Lab -->
    <section class="container mx-auto px-4 py-12 md:px-8 md:py-16">
      <div class="chapter-heading">
        <span class="chapter-label">§ 02 — Journey Lab</span>
      </div>
      <JourneyLab />
    </section>

    <!-- § 03 — What Shaped My Work -->
    <section class="container mx-auto px-4 py-12 md:px-8 md:py-16">
      <div class="chapter-heading">
        <span class="chapter-label">§ 03 — What Shaped My Work</span>
      </div>
      <JourneyStrip />
    </section>

    <!-- Investigation Board (untouched) -->
    <ProjectCTA />

    <!-- § 04 — Selected Work -->
    <section class="container mx-auto px-4 py-12 md:px-8 md:py-16">
      <div class="chapter-heading">
        <span class="chapter-label">§ 04 — Selected Work</span>
      </div>
      <FeaturedProjects />
    </section>

    <!-- Final CTA -->
    <section class="container mx-auto px-4 py-16 md:px-8 md:py-24">
      <div
        class="mx-auto max-w-3xl text-center"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible="{ opacity: 1, y: 0 }"
      >
        <p class="eyebrow mb-4">Collaboration</p>
        <h2 class="title-display" style="font-size: clamp(2rem, 5vw, 4.5rem); line-height: 0.95">
          Ready To Build<br />Your Next Product?
        </h2>
        <p class="text-muted mx-auto mt-6 mb-10 max-w-xl text-base md:text-lg">
          From architecture to interface polish — software that scales and still feels crafted.
        </p>
        <div class="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" as="a" href="/contact">Start a Project</Button>
          <Button size="lg" variant="outline" as="a" href="/about">Read My Story</Button>
        </div>
      </div>
    </section>
  </div>
</template>
