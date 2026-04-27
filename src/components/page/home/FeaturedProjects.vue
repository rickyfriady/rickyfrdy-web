<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-vue-next'

interface Project {
  id: string
  title: string
  category: string
  description: string
  technologies: string[]
  metric?: string
  image?: string
  slug: string
}

const featuredProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    category: 'SaaS / E-Commerce',
    description:
      'Full-stack e-commerce solution with payment integration, inventory management, and real-time order tracking.',
    technologies: ['Node.js', 'TypeScript', 'PostgreSQL', 'Vue 3', 'Redis'],
    metric: 'Handles 10K+ daily transactions',
    slug: 'ecommerce-platform'
  },
  {
    id: '2',
    title: 'Microservices API Gateway',
    category: 'Backend Infrastructure',
    description:
      'Scalable API gateway with rate limiting, authentication, load balancing, and service discovery.',
    technologies: ['Express', 'JWT', 'Docker', 'Kubernetes', 'MongoDB'],
    metric: 'Reduced response time by 60%',
    slug: 'api-gateway'
  },
  {
    id: '3',
    title: 'Real-time Analytics Dashboard',
    category: 'Data / Frontend',
    description:
      'Interactive dashboard with WebSocket updates, data visualization, and custom reporting features.',
    technologies: ['Socket.io', 'Chart.js', 'React', 'Tailwind', 'Node.js'],
    metric: 'Processing 1M+ events/day',
    slug: 'analytics-dashboard'
  }
]
</script>

<template>
  <div class="space-y-6">
    <article
      v-for="(project, index) in featuredProjects"
      :key="project.id"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visible="{ opacity: 1, y: 0 }"
      :delay="index * 120"
      class="group border-border hover:border-accent/40 overflow-hidden rounded-2xl border transition-all duration-500"
      :style="{ transitionTimingFunction: 'var(--ease-out-quart)' }"
    >
      <!-- File-path header -->
      <div class="border-border border-b px-6 py-2.5">
        <span class="text-muted font-mono text-xs">~/projects/{{ project.slug }}/</span>
      </div>

      <!-- Full-bleed image (if available) -->
      <div v-if="project.image" class="aspect-video w-full overflow-hidden">
        <img
          :src="project.image"
          :alt="project.title"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>

      <!-- Card body -->
      <div class="p-6 md:p-8">
        <!-- Title renders large when no image -->
        <h3
          v-if="!project.image"
          class="title-display group-hover:text-accent text-3xl transition-colors duration-300 md:text-4xl"
        >
          {{ project.title }}
        </h3>
        <h3
          v-else
          class="title-display group-hover:text-accent text-2xl transition-colors duration-300 md:text-3xl"
        >
          {{ project.title }}
        </h3>

        <p class="eyebrow mt-2 mb-3">{{ project.category }}</p>
        <p class="text-muted text-sm leading-relaxed">{{ project.description }}</p>

        <div class="mt-5 flex flex-wrap gap-2">
          <Badge
            v-for="tech in project.technologies.slice(0, 4)"
            :key="tech"
            variant="secondary"
            class="normal-case"
          >
            {{ tech }}
          </Badge>
        </div>

        <p v-if="project.metric" class="text-accent mt-5 font-mono text-sm font-semibold">
          → {{ project.metric }}
        </p>

        <div class="mt-6">
          <Button variant="outline" size="sm" as="a" :href="`/projects/${project.slug}`">
            Read Case Study
            <ExternalLink class="ml-2 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </article>

    <div>
      <Button size="lg" variant="outline" as="a" href="/projects">View Full Portfolio</Button>
    </div>
  </div>
</template>
