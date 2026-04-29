<script setup lang="ts">
import GitHubHeatmap from '@/components/page/about/GitHubHeatmap.vue'
import SkillsMatrix from '@/components/page/about/SkillsMatrix.vue'
import SkillsTimeline from '@/components/page/about/SkillsTimeline.vue'
import { Button } from '@/components/ui/button'
</script>

<template>
  <div>
    <!-- Hero -->
    <section
      class="border-border border-b px-4 py-8"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visible="{ opacity: 1, y: 0 }"
      :duration="600"
    >
      <p class="eyebrow mb-3">About</p>
      <h1 class="title-display" style="font-size: clamp(2.4rem, 7vw, 4.5rem); line-height: 0.93">
        Building Systems With<br />
        <span class="title-accent text-accent">Human-First Clarity.</span>
      </h1>
      <p class="text-muted mt-4 text-sm leading-relaxed">
        A fullstack developer focused on reliable architecture, maintainable code, and interfaces
        that feel intentional.
      </p>
    </section>

    <!-- § 01 — My Story -->
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 01 — My Story</span>
      </div>

      <div
        class="space-y-4 px-4 pb-8 text-sm leading-relaxed"
        v-motion
        :initial="{ opacity: 0 }"
        :visible="{ opacity: 1 }"
      >
        <p>
          My journey into web development started in 2021 when I joined PT. Sumatera Kalimantan Jaya
          as an intern and shipped a full company profile website in 14 days. That early deadline
          pressure taught me to build fast and iterate — a habit that's stayed with me.
        </p>
        <p>
          After freelancing with
          <span class="text-foreground font-semibold">React, Node.js, and Express</span> for nearly
          two years — integrating MongoDB, MySQL, and PostgreSQL backends for diverse clients — I
          joined <span class="text-foreground font-semibold">PT. Pegadaian</span> in May 2023 as a
          Software Engineer, working on the CSR Web App, B2B Web App, and internal tooling.
        </p>
        <p>
          Since 2024 I've been deep in microservices and Micro-Frontend territory — revamping a
          legacy CodeIgniter monolith into 9 NestJS microservices using the Factory pattern, and
          contributing to a company-wide Micro-Frontend Architecture that lets multiple teams deploy
          independently. I maintain ≥80% unit test coverage with Vitest across all my modules.
        </p>
        <p>
          I use <span class="text-foreground font-semibold">TypeScript</span> as my core language
          across the stack. On the frontend I reach for Vue 3 or React. On the backend, NestJS and
          Express. I care about CI/CD hygiene, clean code, and building things that are actually
          testable.
        </p>
      </div>

      <!-- Annotation notes -->
      <div
        class="border-border border-t px-4 pb-8"
        v-motion
        :initial="{ opacity: 0 }"
        :visible="{ opacity: 1 }"
        :delay="100"
      >
        <p class="eyebrow mt-6 mb-4">§ Notes</p>

        <div class="space-y-4">
          <div class="border-border border-l-2 pl-4">
            <p class="text-foreground text-xs font-semibold tracking-[0.1em] uppercase">
              Clean Code Philosophy
            </p>
            <p class="text-muted mt-1 text-sm leading-relaxed">
              Code is read more than it's written. Every line should be intentional, clear, and
              maintainable for the next developer.
            </p>
          </div>

          <div class="border-border border-l-2 pl-4">
            <p class="text-foreground text-xs font-semibold tracking-[0.1em] uppercase">
              Performance Matters
            </p>
            <p class="text-muted mt-1 text-sm leading-relaxed">
              Users expect fast, responsive applications. I optimize every layer — from database
              queries to frontend rendering.
            </p>
          </div>

          <div class="border-border border-l-2 pl-4">
            <p class="text-foreground text-xs font-semibold tracking-[0.1em] uppercase">
              User-Centric Approach
            </p>
            <p class="text-muted mt-1 text-sm leading-relaxed">
              Technology is just a tool. What matters is solving real problems for real people in
              ways that make their lives easier.
            </p>
          </div>

          <div class="border-accent/40 border-l-2 pl-4">
            <p class="text-foreground mb-2 text-xs font-semibold tracking-[0.1em] uppercase">
              Beyond Code
            </p>
            <ul class="text-muted space-y-1 text-sm">
              <li>Love listening to music while coding</li>
              <li>Active in developer communities and open source</li>
              <li>Currently exploring serverless architecture</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- § 02 — Skills Timeline -->
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 02 — Skills Timeline</span>
      </div>
      <SkillsTimeline />
    </section>

    <!-- § 03 — Skills Matrix -->
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 03 — Skills Matrix</span>
      </div>
      <SkillsMatrix />
    </section>

    <!-- § 04 — GitHub Activity -->
    <section class="border-border border-b">
      <div class="chapter-heading px-4">
        <span class="chapter-label">§ 04 — GitHub Activity</span>
      </div>
      <div class="px-4 pb-6">
        <GitHubHeatmap />
      </div>
    </section>

    <!-- Final CTA -->
    <section class="px-4 py-12 text-center">
      <p class="eyebrow mb-4">Collaboration</p>
      <h2 class="title-display" style="font-size: clamp(1.8rem, 5vw, 3rem)">
        Let's Build Something Together
      </h2>
      <p class="text-muted mx-auto mt-4 mb-8 max-w-sm text-sm">
        I'm always interested in hearing about new projects and opportunities.
      </p>
      <div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button size="lg" as="a" href="/contact">Get In Touch</Button>
        <Button size="lg" variant="outline" as="a" href="/projects">View My Projects</Button>
      </div>
    </section>
  </div>
</template>
