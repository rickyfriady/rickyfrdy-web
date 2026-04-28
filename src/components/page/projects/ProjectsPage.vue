<script setup lang="ts">
import ProjectCard from '@/components/page/projects/ProjectCard.vue'
import ProjectFilters from '@/components/page/projects/ProjectFilters.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjects } from '@/hooks/useProjects'
import { onMounted } from 'vue'

const {
  loading,
  error,
  selectedCategory,
  selectedTech,
  sortBy,
  filteredProjects,
  allTechnologies,
  fetchProjects,
  setCategory,
  setTechnology,
  setSortBy,
  resetFilters
} = useProjects()

onMounted(() => fetchProjects())
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <section class="container mx-auto px-4 pt-12 pb-10 md:px-8 md:pt-20">
      <div
        class="max-w-3xl"
        v-motion
        :initial="{ opacity: 0, y: 24 }"
        :visible="{ opacity: 1, y: 0 }"
      >
        <p class="eyebrow mb-4">Portfolio</p>
        <h1 class="title-display text-5xl md:text-7xl">Projects &amp; Case Studies</h1>
        <p class="text-muted mt-6 max-w-2xl text-base md:text-lg">
          Real-world systems and product experiences built with a backend-first, performance-minded
          approach.
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="container mx-auto px-4 pb-16 md:px-8 md:pb-20">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <!-- Sidebar -->
        <aside class="lg:col-span-1">
          <div
            class="border-border sticky top-24 rounded-2xl border p-5"
            v-motion
            :initial="{ opacity: 0, x: -20 }"
            :visible="{ opacity: 1, x: 0 }"
            :delay="150"
          >
            <ProjectFilters
              :selected-category="selectedCategory"
              :selected-tech="selectedTech"
              :sort-by="sortBy"
              :technologies="allTechnologies"
              :project-count="filteredProjects.length"
              @update:category="setCategory"
              @update:tech="setTechnology"
              @update:sort="setSortBy"
              @reset="resetFilters"
            />
          </div>
        </aside>

        <!-- Grid -->
        <div class="lg:col-span-3">
          <div v-if="loading" class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div v-for="i in 6" :key="i" class="space-y-4">
              <Skeleton class="h-48 w-full rounded-xl" />
              <Skeleton class="h-6 w-3/4" />
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-2/3" />
            </div>
          </div>

          <div v-else-if="error" class="py-12 text-center">
            <div class="border-border inline-block rounded-2xl border p-8">
              <p class="text-accent mb-4">Failed to load projects: {{ error }}</p>
              <button @click="fetchProjects" class="text-accent text-sm hover:underline">
                Try again
              </button>
            </div>
          </div>

          <div v-else-if="filteredProjects.length === 0" class="py-12 text-center">
            <div class="border-border inline-block rounded-2xl border p-8">
              <p class="text-muted mb-4">No projects found matching your filters</p>
              <button @click="resetFilters" class="text-accent text-sm hover:underline">
                Reset filters
              </button>
            </div>
          </div>

          <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div
              v-for="(project, index) in filteredProjects"
              :key="project.id"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :visible="{ opacity: 1, y: 0 }"
              :delay="index * 80"
            >
              <ProjectCard :project="project" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
