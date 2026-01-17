<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import InteractiveCodeTerminal from '@/components/home/InteractiveCodeTerminal.vue'
import QuickStats from '@/components/home/QuickStats.vue'
import FeaturedProjects from '@/components/home/FeaturedProjects.vue'
import { ArrowRight, Code2, Database, Layers } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-16 md:py-24">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left: Introduction -->
        <div 
          v-motion
          :initial="{ opacity: 0, x: -50 }"
          :visible="{ opacity: 1, x: 0 }"
          :duration="600"
        >
          <div class="inline-block mb-4">
            <span class="text-sm font-medium text-accent bg-accent/10 px-4 py-2 rounded-full">
              👋 Available for new opportunities
            </span>
          </div>
          
          <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Hi, I'm <span class="text-accent">Ricki Friadi</span>
          </h1>
          
          <h2 class="text-xl md:text-2xl text-muted mb-6">
            Fullstack Developer specializing in <span class="text-foreground font-semibold">Node.js</span> & <span class="text-foreground font-semibold">TypeScript</span>
          </h2>
          
          <p class="text-base md:text-lg text-muted mb-8 leading-relaxed">
            With 4 years of experience building scalable, production-ready systems. 
            I transform complex problems into elegant solutions using modern web technologies.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              as="a" 
              href="/projects"
              class="group"
            >
              View My Work
              <ArrowRight class="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              as="a" 
              href="/contact"
            >
              Let's Talk
            </Button>
          </div>
        </div>

        <!-- Right: Code Terminal -->
        <div
          v-motion
          :initial="{ opacity: 0, x: 50 }"
          :visible="{ opacity: 1, x: 0 }"
          :duration="600"
          :delay="200"
        >
          <InteractiveCodeTerminal />
        </div>
      </div>
    </section>

    <!-- Quick Stats Bar -->
    <section class="bg-secondary/30 border-y border-border">
      <div class="container mx-auto px-4 py-12 md:py-16">
        <QuickStats />
      </div>
    </section>

    <!-- What I Do Best Section -->
    <section class="container mx-auto px-4 py-16 md:py-24">
      <div 
        class="text-center mb-12"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible="{ opacity: 1, y: 0 }"
      >
        <h2 class="text-3xl md:text-4xl font-bold mb-4">What I Do Best</h2>
        <p class="text-muted max-w-2xl mx-auto">
          Full-stack development with a focus on scalability, performance, and user experience
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0 }"
          :delay="100"
          class="p-8 rounded-xl border border-border hover:border-accent hover:shadow-lg transition-all group"
        >
          <div class="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
            <Database class="w-6 h-6 text-accent" />
          </div>
          <h3 class="text-xl font-semibold mb-3">Backend Architecture</h3>
          <p class="text-muted leading-relaxed">
            Building robust APIs, microservices, and database systems with Node.js, Express, and PostgreSQL/MongoDB.
          </p>
        </div>

        <div
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0 }"
          :delay="200"
          class="p-8 rounded-xl border border-border hover:border-accent hover:shadow-lg transition-all group"
        >
          <div class="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
            <Code2 class="w-6 h-6 text-accent" />
          </div>
          <h3 class="text-xl font-semibold mb-3">Frontend Development</h3>
          <p class="text-muted leading-relaxed">
            Creating modern, responsive interfaces with Vue 3, React, TypeScript, and Tailwind CSS.
          </p>
        </div>

        <div
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible="{ opacity: 1, y: 0 }"
          :delay="300"
          class="p-8 rounded-xl border border-border hover:border-accent hover:shadow-lg transition-all group"
        >
          <div class="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
            <Layers class="w-6 h-6 text-accent" />
          </div>
          <h3 class="text-xl font-semibold mb-3">Full Lifecycle</h3>
          <p class="text-muted leading-relaxed">
            From design and development to testing, deployment, and maintenance using Docker, CI/CD, and cloud platforms.
          </p>
        </div>
      </div>
    </section>

    <Separator />

    <!-- Featured Projects Section -->
    <section class="container mx-auto px-4 py-16 md:py-24">
      <FeaturedProjects />
    </section>

    <!-- CTA Section -->
    <section class="container mx-auto px-4 py-16 md:py-24">
      <div 
        class="max-w-3xl mx-auto text-center bg-gradient-to-br from-accent/10 to-secondary/50 rounded-2xl p-12 border border-accent/20"
        v-motion
        :initial="{ opacity: 0, scale: 0.95 }"
        :visible="{ opacity: 1, scale: 1 }"
      >
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Ready to Work Together?
        </h2>
        <p class="text-lg text-muted mb-8">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" as="a" href="/contact">
            Get In Touch
          </Button>
          <Button size="lg" variant="outline" as="a" href="/about">
            Learn More About Me
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>
