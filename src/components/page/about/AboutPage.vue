<script setup lang="ts">
import GitHubHeatmap from '@/components/page/about/GitHubHeatmap.vue'
import SkillsMatrix from '@/components/page/about/SkillsMatrix.vue'
import SkillsTimeline from '@/components/page/about/SkillsTimeline.vue'
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero: full-width, no panel wrapper -->
    <section
      class="container mx-auto px-4 pt-16 pb-12 md:px-8 md:pt-24"
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :visible="{ opacity: 1, y: 0 }"
    >
      <p class="eyebrow mb-4 inline-flex">About</p>
      <h1 class="title-display" style="font-size: clamp(2.8rem, 7vw, 7rem); line-height: 0.93">
        Building Systems With<br />
        <span class="title-accent text-accent">Human-First Clarity.</span>
      </h1>
      <p class="text-muted mt-6 max-w-2xl text-lg md:text-xl">
        A fullstack developer focused on reliable architecture, maintainable code, and interfaces
        that feel intentional.
      </p>
    </section>

    <!-- § 01 — My Story: editorial two-column layout -->
    <section class="container mx-auto px-4 py-12 md:px-8">
      <div class="chapter-heading">
        <span class="chapter-label">§ 01 — My Story</span>
      </div>

      <div class="editorial-grid">
        <!-- Left: story text -->
        <div
          v-motion
          :initial="{ opacity: 0, x: -30 }"
          :visible="{ opacity: 1, x: 0 }"
          class="space-y-4 text-base leading-relaxed"
        >
          <p>
            My journey into software development started 4 years ago when I discovered my passion
            for solving complex problems through code. What began as curiosity quickly evolved into
            a deep commitment to mastering the craft of fullstack development.
          </p>
          <p>
            I specialize in the
            <span class="text-foreground font-semibold">Node.js and TypeScript ecosystem</span>,
            building scalable backend systems and modern frontend applications. I believe in writing
            clean, maintainable code that not only works but also stands the test of time.
          </p>
          <p>
            Throughout my career, I've had the privilege of working on diverse projects — from
            e-commerce platforms handling thousands of transactions daily to real-time analytics
            dashboards processing millions of events. Each project has taught me valuable lessons
            about architecture, performance, and user experience.
          </p>
          <p>
            Beyond coding, I'm passionate about continuous learning, sharing knowledge with the
            developer community, and staying updated with the latest technologies and best
            practices.
          </p>
        </div>

        <!-- Right: annotation sidebar -->
        <div
          v-motion
          :initial="{ opacity: 0, x: 20 }"
          :visible="{ opacity: 1, x: 0 }"
          :delay="150"
          class="space-y-0"
        >
          <p class="eyebrow mb-5">§ Notes</p>

          <div class="border-border space-y-1 border-t pt-4">
            <p class="eyebrow text-foreground">Clean Code Philosophy</p>
            <p class="text-muted text-sm leading-relaxed">
              Code is read more than it's written. Every line should be intentional, clear, and
              maintainable for the next developer.
            </p>
          </div>

          <div class="border-border mt-5 space-y-1 border-t pt-4">
            <p class="eyebrow text-foreground">Performance Matters</p>
            <p class="text-muted text-sm leading-relaxed">
              Users expect fast, responsive applications. I optimize every layer — from database
              queries to frontend rendering.
            </p>
          </div>

          <div class="border-border mt-5 space-y-1 border-t pt-4">
            <p class="eyebrow text-foreground">User-Centric Approach</p>
            <p class="text-muted text-sm leading-relaxed">
              Technology is just a tool. What matters is solving real problems for real people in
              ways that make their lives easier.
            </p>
          </div>

          <!-- Beyond Code: pull-quote style -->
          <div class="border-accent mt-8 border-l-2 py-1 pl-5">
            <p class="eyebrow text-foreground mb-3">Beyond Code</p>
            <ul class="text-muted space-y-2 text-sm">
              <li>Love listening to music while coding</li>
              <li>Active in developer communities and open source</li>
              <li>Currently exploring serverless architecture</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- § 02 — Skills Timeline -->
    <section class="container mx-auto px-4 py-12 md:px-8">
      <div class="chapter-heading">
        <span class="chapter-label">§ 02 — Skills Timeline</span>
      </div>
      <SkillsTimeline />
    </section>

    <!-- § 03 — Skills Matrix -->
    <section class="container mx-auto px-4 py-12 md:px-8">
      <div class="chapter-heading">
        <span class="chapter-label">§ 03 — Skills Matrix</span>
      </div>
      <SkillsMatrix />
    </section>

    <!-- § 04 — GitHub Activity -->
    <section class="container mx-auto px-4 py-12 md:px-8">
      <div class="chapter-heading">
        <span class="chapter-label">§ 04 — GitHub Activity</span>
      </div>
      <div class="mx-auto max-w-5xl">
        <GitHubHeatmap />
      </div>
    </section>

    <!-- Final CTA: plain centered text, no panel wrapper -->
    <section class="container mx-auto px-4 py-14 md:px-8 md:py-20">
      <div
        class="mx-auto max-w-3xl text-center"
        v-motion
        :initial="{ opacity: 0, scale: 0.97 }"
        :visible="{ opacity: 1, scale: 1 }"
      >
        <p class="eyebrow mb-4 inline-flex">Collaboration</p>
        <h2 class="title-display" style="font-size: clamp(2rem, 5vw, 4.5rem)">
          Let's Build Something Together
        </h2>
        <p class="text-muted mx-auto mt-5 mb-8 max-w-2xl text-base md:text-lg">
          I'm always interested in hearing about new projects and opportunities.
        </p>
        <div class="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" as="a" href="/contact">Get In Touch</Button>
          <Button size="lg" variant="outline" as="a" href="/projects">View My Projects</Button>
        </div>
      </div>
    </section>
  </div>
</template>
