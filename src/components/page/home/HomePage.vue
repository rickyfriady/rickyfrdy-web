<script setup lang="ts">
import FeaturedProjects from '@/components/page/home/FeaturedProjects.vue'
import JourneyLab from '@/components/page/home/JourneyLab.vue'
import JourneyStrip from '@/components/page/home/JourneyStrip.vue'
import ProjectCTA from '@/components/page/home/ProjectCTA.vue'
import QuickStats from '@/components/page/home/QuickStats.vue'
import { Button } from '@/components/ui/button'
import { ArrowRight, User } from 'lucide-vue-next'
import { ref } from 'vue'

const photoError = ref(false)
const photoSrc = `${import.meta.env.BASE_URL}photo.jpg`
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero: two-column on desktop — text left, IDE panel right -->
    <section class="container mx-auto px-4 pt-16 pb-10 md:px-8 md:pt-24 md:pb-14">
      <div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_300px] lg:gap-16">
        <!-- Left: typographic statement -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 24 }"
          :visible="{ opacity: 1, y: 0 }"
          :duration="700"
        >
          <p class="eyebrow mb-6">Fullstack Developer · Jakarta</p>

          <h1
            class="title-display"
            style="
              font-size: clamp(2.6rem, 5vw, 5.5rem);
              line-height: 0.92;
              letter-spacing: -0.02em;
            "
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
            <Button size="lg" variant="outline" as="a" href="/contact">Get in Touch</Button>
          </div>
        </div>

        <!-- Right: IDE file panel — desktop only -->
        <div
          v-motion
          :initial="{ opacity: 0, x: 24 }"
          :visible="{ opacity: 1, x: 0 }"
          :delay="350"
          :duration="700"
          class="hidden self-start lg:block"
        >
          <div
            class="border-border overflow-hidden rounded-lg border"
            style="border-left: 3px solid var(--color-accent)"
          >
            <!-- IDE tab header -->
            <div
              class="border-border flex items-center gap-3 border-b px-4 py-2.5"
              style="background: var(--color-secondary)"
            >
              <span class="font-mono text-[11px]" style="color: var(--color-muted)">
                ~/ricki.jpg
              </span>
              <div class="ml-auto flex items-center gap-1.5">
                <span class="h-2 w-2 rounded-full" style="background: #4ade80"></span>
                <span
                  class="font-mono text-[10px] tracking-[0.12em] uppercase"
                  style="color: var(--color-muted)"
                >
                  available
                </span>
              </div>
            </div>

            <!-- Photo or placeholder -->
            <div class="relative" style="aspect-ratio: 3/4; background: var(--color-secondary)">
              <img
                v-show="!photoError"
                :src="photoSrc"
                alt="Ricki Friadi"
                class="h-full w-full object-cover"
                @error="photoError = true"
              />
              <!-- Warm tint overlay for photo -->
              <div
                v-if="!photoError"
                class="pointer-events-none absolute inset-0"
                style="background: var(--color-accent); opacity: 0.07; mix-blend-mode: multiply"
              />
              <!-- Placeholder when no photo -->
              <div
                v-if="photoError"
                class="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6"
              >
                <div class="border-border rounded-lg border p-5">
                  <User class="h-12 w-12" style="color: var(--color-border)" />
                </div>
                <div class="text-center leading-5" style="font-family: var(--font-mono)">
                  <p class="text-[10px]" style="color: var(--color-accent)">// photo.jpg</p>
                  <p class="text-[10px]" style="color: var(--color-muted)">
                    add to /public/photo.jpg
                  </p>
                </div>
              </div>
            </div>

            <!-- Footer annotation -->
            <div
              class="border-border flex items-center border-t px-4 py-2"
              style="background: var(--color-secondary)"
            >
              <span class="font-mono text-[10px]" style="color: var(--color-muted)">
                <span style="color: var(--color-accent); opacity: 0.7">//</span>
                &nbsp;Jakarta, Indonesia &nbsp;·&nbsp; 2026
              </span>
            </div>
          </div>
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
        <h2 class="title-display" style="font-size: clamp(2rem, 5vw, 4.5rem)">
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
