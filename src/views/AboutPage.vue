<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import SkillsTimeline from '@/components/about/SkillsTimeline.vue'
import SkillsMatrix from '@/components/about/SkillsMatrix.vue'
import GitHubHeatmap from '@/components/about/GitHubHeatmap.vue'
import { Code2, Heart, Zap } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-16 md:py-24">
      <div 
        class="max-w-4xl mx-auto"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible="{ opacity: 1, y: 0 }"
      >
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          Hi, I'm <span class="text-accent">Ricki Friadi</span>
        </h1>
        <p class="text-xl md:text-2xl text-muted mb-8">
          A Fullstack Developer who loves building scalable systems
        </p>
      </div>
    </section>

    <!-- Story Section -->
    <section class="container mx-auto px-4 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <!-- Left: Story -->
        <div 
          v-motion
          :initial="{ opacity: 0, x: -50 }"
          :visible="{ opacity: 1, x: 0 }"
          class="space-y-6"
        >
          <h2 class="text-3xl font-bold mb-6">My Story</h2>
          
          <div class="space-y-4 text-muted leading-relaxed">
            <p>
              My journey into software development started 4 years ago when I discovered my passion 
              for solving complex problems through code. What began as curiosity quickly evolved into 
              a deep commitment to mastering the craft of fullstack development.
            </p>
            
            <p>
              I specialize in the <span class="text-foreground font-semibold">Node.js and TypeScript ecosystem</span>, 
              building scalable backend systems and modern frontend applications. I believe in writing clean, 
              maintainable code that not only works but also stands the test of time.
            </p>
            
            <p>
              Throughout my career, I've had the privilege of working on diverse projects—from 
              e-commerce platforms handling thousands of transactions daily to real-time analytics 
              dashboards processing millions of events. Each project has taught me valuable lessons 
              about architecture, performance, and user experience.
            </p>
            
            <p>
              Beyond coding, I'm passionate about continuous learning, sharing knowledge with the 
              developer community, and staying updated with the latest technologies and best practices.
            </p>
          </div>
        </div>

        <!-- Right: Values/Principles -->
        <div 
          v-motion
          :initial="{ opacity: 0, x: 50 }"
          :visible="{ opacity: 1, x: 0 }"
          :delay="200"
          class="space-y-6"
        >
          <h2 class="text-3xl font-bold mb-6">What Drives Me</h2>
          
          <div class="space-y-6">
            <div class="flex gap-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Code2 class="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 class="font-semibold mb-2">Clean Code Philosophy</h3>
                <p class="text-sm text-muted">
                  I believe code is read more than it's written. Every line should be intentional, 
                  clear, and maintainable for the next developer.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Zap class="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 class="font-semibold mb-2">Performance Matters</h3>
                <p class="text-sm text-muted">
                  Users expect fast, responsive applications. I optimize every layer—from database 
                  queries to frontend rendering—to deliver the best experience.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Heart class="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 class="font-semibold mb-2">User-Centric Approach</h3>
                <p class="text-sm text-muted">
                  Technology is just a tool. What matters is solving real problems for real people 
                  in ways that make their lives easier.
                </p>
              </div>
            </div>
          </div>

          <!-- Fun Facts -->
          <div class="mt-8 p-6 rounded-xl bg-secondary/50 border border-border">
            <h4 class="font-semibold mb-3">Beyond Code</h4>
            <ul class="space-y-2 text-sm text-muted">
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <span>Love listening to music while coding (check out my playlist!)</span>
              </li>
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <span>Active in developer communities and open source</span>
              </li>
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <span>Always learning something new—currently exploring serverless architecture</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <Separator class="my-16" />

    <!-- Technical Journey Timeline -->
    <section class="container mx-auto px-4 py-16">
      <SkillsTimeline />
    </section>

    <Separator class="my-16" />

    <!-- Skills Matrix -->
    <section class="container mx-auto px-4 py-16">
      <SkillsMatrix />
    </section>

    <Separator class="my-16" />

    <!-- GitHub Heatmap -->
    <section class="container mx-auto px-4 py-16">
      <div class="max-w-5xl mx-auto">
        <GitHubHeatmap />
      </div>
    </section>

    <!-- CTA -->
    <section class="container mx-auto px-4 py-16 md:py-24">
      <div 
        class="max-w-3xl mx-auto text-center bg-gradient-to-br from-accent/10 to-secondary/50 rounded-2xl p-12 border border-accent/20"
        v-motion
        :initial="{ opacity: 0, scale: 0.95 }"
        :visible="{ opacity: 1, scale: 1 }"
      >
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Let's Build Something Together
        </h2>
        <p class="text-lg text-muted mb-8">
          I'm always interested in hearing about new projects and opportunities.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/contact"
            class="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors h-11 px-8 bg-accent text-dark-base hover:bg-accent/90"
          >
            Get In Touch
          </a>
          <a 
            href="/projects"
            class="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors h-11 px-8 border-2 border-accent bg-transparent hover:bg-accent hover:text-dark-base"
          >
            View My Projects
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
