<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-vue-next'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  metric?: string
  slug: string
}

const featuredProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with payment integration, inventory management, and real-time order tracking.',
    technologies: ['Node.js', 'TypeScript', 'PostgreSQL', 'Vue 3', 'Redis'],
    metric: 'Handles 10K+ daily transactions',
    slug: 'ecommerce-platform'
  },
  {
    id: '2',
    title: 'Microservices API Gateway',
    description: 'Scalable API gateway with rate limiting, authentication, load balancing, and service discovery.',
    technologies: ['Express', 'JWT', 'Docker', 'Kubernetes', 'MongoDB'],
    metric: 'Reduced response time by 60%',
    slug: 'api-gateway'
  },
  {
    id: '3',
    title: 'Real-time Analytics Dashboard',
    description: 'Interactive dashboard with WebSocket updates, data visualization, and custom reporting features.',
    technologies: ['Socket.io', 'Chart.js', 'React', 'Tailwind', 'Node.js'],
    metric: 'Processing 1M+ events/day',
    slug: 'analytics-dashboard'
  }
]
</script>

<template>
  <div class="space-y-8">
    <div class="text-center">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
      <p class="text-muted max-w-2xl mx-auto">
        A showcase of my recent work building scalable, production-ready applications
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card
        v-for="(project, index) in featuredProjects"
        :key="project.id"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible="{ opacity: 1, y: 0 }"
        :delay="index * 150"
        class="group hover:shadow-lg transition-shadow duration-300"
      >
        <CardHeader>
          <CardTitle class="text-xl group-hover:text-accent transition-colors">
            {{ project.title }}
          </CardTitle>
          <CardDescription>
            {{ project.description }}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div class="flex flex-wrap gap-2 mb-4">
            <Badge 
              v-for="tech in project.technologies.slice(0, 4)" 
              :key="tech"
              variant="secondary"
            >
              {{ tech }}
            </Badge>
          </div>

          <div 
            v-if="project.metric" 
            class="text-sm font-medium text-accent bg-accent/10 px-3 py-2 rounded-lg"
          >
            ⚡ {{ project.metric }}
          </div>
        </CardContent>

        <CardFooter>
          <Button 
            variant="outline" 
            class="w-full group-hover:bg-accent group-hover:text-dark-base group-hover:border-accent transition-all"
            as="a"
            :href="`/projects/${project.slug}`"
          >
            View Details
            <ExternalLink class="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>

    <div class="text-center mt-8">
      <Button 
        size="lg" 
        variant="outline"
        as="a"
        href="/projects"
      >
        View All Projects
      </Button>
    </div>
  </div>
</template>
