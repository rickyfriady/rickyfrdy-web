<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import type { ProjectFilter } from '@/types/project'

interface Props {
  selectedCategory: ProjectFilter
  selectedTech: string
  sortBy: string
  technologies: string[]
  projectCount: number
}

interface Emits {
  (e: 'update:category', value: ProjectFilter): void
  (e: 'update:tech', value: string): void
  (e: 'update:sort', value: 'featured' | 'recent' | 'year'): void
  (e: 'reset'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const categories: { value: ProjectFilter; label: string }[] = [
  { value: 'all', label: 'All Projects' },
  { value: 'web-app', label: 'Web Apps' },
  { value: 'api', label: 'APIs' },
  { value: 'tool', label: 'Tools' },
  { value: 'open-source', label: 'Open Source' }
]

const sortOptions: { value: 'featured' | 'recent' | 'year'; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'recent', label: 'Most Recent' },
  { value: 'year', label: 'By Year' }
]

const popularTechs = ['Node.js', 'TypeScript', 'Vue 3', 'React', 'PostgreSQL', 'MongoDB']
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-muted font-mono text-[11px] tracking-[0.18em] uppercase">
          Showing <span class="text-foreground font-semibold">{{ projectCount }}</span> project{{
            projectCount !== 1 ? 's' : ''
          }}
        </p>
      </div>
      <button
        v-if="selectedCategory !== 'all' || selectedTech !== 'all'"
        @click="emit('reset')"
        class="text-accent text-sm hover:underline"
      >
        Reset
      </button>
    </div>

    <div>
      <h2 class="mb-3 text-xs font-bold tracking-[0.16em] uppercase">Category</h2>
      <div class="flex flex-wrap gap-2">
        <Badge
          v-for="category in categories"
          :key="category.value"
          :variant="selectedCategory === category.value ? 'default' : 'outline'"
          class="hover:bg-accent/10 cursor-pointer normal-case transition-colors"
          @click="emit('update:category', category.value)"
        >
          {{ category.label }}
        </Badge>
      </div>
    </div>

    <div>
      <h2 class="mb-3 text-xs font-bold tracking-[0.16em] uppercase">Technology</h2>
      <div class="flex flex-wrap gap-2">
        <Badge
          :variant="selectedTech === 'all' ? 'default' : 'outline'"
          class="hover:bg-accent/10 cursor-pointer normal-case transition-colors"
          @click="emit('update:tech', 'all')"
        >
          All
        </Badge>
        <Badge
          v-for="tech in popularTechs"
          :key="tech"
          :variant="selectedTech === tech ? 'default' : 'outline'"
          class="hover:bg-accent/10 cursor-pointer normal-case transition-colors"
          @click="emit('update:tech', tech)"
        >
          {{ tech }}
        </Badge>
      </div>
    </div>

    <div>
      <h2 class="mb-3 text-xs font-bold tracking-[0.16em] uppercase">Sort By</h2>
      <div class="flex flex-wrap gap-2">
        <Badge
          v-for="sort in sortOptions"
          :key="sort.value"
          :variant="sortBy === sort.value ? 'default' : 'outline'"
          class="hover:bg-accent/10 cursor-pointer normal-case transition-colors"
          @click="emit('update:sort', sort.value)"
        >
          {{ sort.label }}
        </Badge>
      </div>
    </div>
  </div>
</template>
