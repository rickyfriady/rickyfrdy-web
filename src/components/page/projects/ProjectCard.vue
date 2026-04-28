<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Project } from '@/types/project'
import { ExternalLink, Github } from 'lucide-vue-next'

interface Props {
  project: Project
}

defineProps<Props>()
</script>

<template>
  <article
    class="group border-border hover:border-accent/40 flex h-full flex-col rounded-2xl border transition-all duration-500"
    :style="{ transitionTimingFunction: 'var(--ease-out-quart)' }"
  >
    <!-- Thumbnail -->
    <div
      class="bg-secondary text-muted flex aspect-video items-center justify-center rounded-t-2xl"
    >
      <span class="font-mono text-xs tracking-[0.08em] uppercase">{{ project.title }}</span>
      <Badge v-if="project.featured" variant="default" class="absolute top-3 right-3"
        >Featured</Badge
      >
    </div>

    <!-- Content -->
    <div class="flex flex-1 flex-col p-5">
      <h3
        class="title-display group-hover:text-accent text-2xl leading-tight transition-colors duration-300 md:text-3xl"
      >
        {{ project.title }}
      </h3>
      <p class="text-muted mt-2 line-clamp-2 text-sm leading-relaxed">
        {{ project.shortDescription }}
      </p>

      <div class="mt-4 flex flex-wrap gap-1.5">
        <Badge
          v-for="tech in project.technologies.slice(0, 4)"
          :key="tech"
          variant="secondary"
          class="normal-case"
        >
          {{ tech }}
        </Badge>
        <Badge v-if="project.technologies.length > 4" variant="outline">
          +{{ project.technologies.length - 4 }}
        </Badge>
      </div>

      <p v-if="project.keyMetric" class="text-accent mt-4 text-xs font-semibold">
        {{ project.keyMetric }}
      </p>

      <div
        class="text-muted mt-4 flex items-center justify-between text-xs font-medium tracking-wide uppercase"
      >
        <span class="capitalize">{{ project.category.replace('-', ' ') }}</span>
        <span>{{ project.year }}</span>
      </div>

      <!-- Actions -->
      <div class="border-border mt-5 flex gap-2 border-t pt-5">
        <Button variant="outline" class="flex-1" as="a" :href="`/projects/${project.slug}`">
          View Details
          <ExternalLink class="ml-2 h-3.5 w-3.5" />
        </Button>
        <Button
          v-if="project.githubUrl"
          variant="ghost"
          size="icon"
          as="a"
          :href="project.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </article>
</template>
