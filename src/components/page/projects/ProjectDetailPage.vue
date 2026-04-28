<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjects } from '@/hooks/useProjects'
import { ArrowLeft, CheckCircle2, ExternalLink, Github } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { getProjectBySlug, fetchProjects } = useProjects()
const loading = ref(true)

const project = computed(() => getProjectBySlug(route.params.slug as string))

onMounted(async () => {
  await fetchProjects()
  loading.value = false
  if (!project.value) router.push('/projects')
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Loading -->
    <div v-if="loading" class="container mx-auto px-4 py-16">
      <Skeleton class="mb-8 h-12 w-64" />
      <Skeleton class="mb-8 h-96 w-full rounded-xl" />
      <Skeleton class="mb-4 h-4 w-full" />
      <Skeleton class="h-4 w-3/4" />
    </div>

    <!-- Content -->
    <div v-else-if="project" class="container mx-auto px-4 py-12 md:px-8 md:py-16">
      <Button variant="ghost" class="mb-8" @click="router.push('/projects')">
        <ArrowLeft class="mr-2 h-4 w-4" />
        Back to Projects
      </Button>

      <!-- Hero -->
      <div class="mb-12" v-motion :initial="{ opacity: 0, y: 24 }" :visible="{ opacity: 1, y: 0 }">
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <Badge v-if="project.featured" variant="default">Featured</Badge>
          <Badge variant="secondary" class="capitalize">
            {{ project.category.replace('-', ' ') }}
          </Badge>
          <span class="text-muted text-sm">{{ project.year }}</span>
        </div>

        <h1 class="title-display text-5xl md:text-6xl">{{ project.title }}</h1>

        <p class="text-muted mt-5 mb-8 max-w-3xl text-lg md:text-xl">
          {{ project.fullDescription }}
        </p>

        <div class="flex flex-wrap gap-3">
          <Button
            v-if="project.liveUrl"
            size="lg"
            as="a"
            :href="project.liveUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Live Demo
            <ExternalLink class="ml-2 h-4 w-4" />
          </Button>
          <Button
            v-if="project.githubUrl"
            size="lg"
            variant="outline"
            as="a"
            :href="project.githubUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github class="mr-2 h-4 w-4" />
            View on GitHub
          </Button>
        </div>
      </div>

      <!-- Key Metric -->
      <div
        v-if="project.keyMetric"
        class="border-accent/20 bg-accent/5 mb-12 rounded-2xl border p-6 text-center"
        v-motion
        :initial="{ opacity: 0 }"
        :visible="{ opacity: 1 }"
        :delay="150"
      >
        <p class="text-muted text-xs font-medium tracking-[0.12em] uppercase">Key Metric</p>
        <p class="text-accent mt-2 text-xl font-semibold">{{ project.keyMetric }}</p>
      </div>

      <!-- Technologies -->
      <div class="mb-12">
        <h2 class="mb-4 text-xl font-semibold">Technologies Used</h2>
        <div class="flex flex-wrap gap-2">
          <Badge
            v-for="tech in project.technologies"
            :key="tech"
            variant="secondary"
            class="text-sm"
          >
            {{ tech }}
          </Badge>
        </div>
      </div>

      <div class="border-border my-12 border-t" />

      <!-- Challenges / Solutions / Results -->
      <div class="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div v-motion :initial="{ opacity: 0, y: 20 }" :visible="{ opacity: 1, y: 0 }" :delay="200">
          <div class="border-border h-full rounded-2xl border p-5">
            <h3 class="mb-4 text-lg font-semibold">Challenges</h3>
            <ul class="space-y-3">
              <li
                v-for="(challenge, index) in project.challenges"
                :key="index"
                class="text-muted flex items-start text-sm"
              >
                <span class="text-accent mt-0.5 mr-2">•</span>
                {{ challenge }}
              </li>
            </ul>
          </div>
        </div>

        <div v-motion :initial="{ opacity: 0, y: 20 }" :visible="{ opacity: 1, y: 0 }" :delay="300">
          <div class="border-border h-full rounded-2xl border p-5">
            <h3 class="mb-4 text-lg font-semibold">Solutions</h3>
            <ul class="space-y-3">
              <li
                v-for="(solution, index) in project.solutions"
                :key="index"
                class="text-muted flex items-start text-sm"
              >
                <span class="text-accent mt-0.5 mr-2">&rarr;</span>
                {{ solution }}
              </li>
            </ul>
          </div>
        </div>

        <div v-motion :initial="{ opacity: 0, y: 20 }" :visible="{ opacity: 1, y: 0 }" :delay="400">
          <div class="border-border h-full rounded-2xl border p-5">
            <h3 class="mb-4 text-lg font-semibold">Results</h3>
            <ul class="space-y-3">
              <li
                v-for="(result, index) in project.results"
                :key="index"
                class="text-muted flex items-start text-sm"
              >
                <CheckCircle2 class="text-accent mt-0.5 mr-2 h-4 w-4 flex-shrink-0" />
                {{ result }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Code Snippets -->
      <div v-if="project.codeSnippets && project.codeSnippets.length > 0" class="mb-12">
        <div class="border-border my-12 border-t" />
        <h2 class="mb-6 text-xl font-semibold">Code Highlights</h2>
        <div class="space-y-6">
          <div
            v-for="(snippet, index) in project.codeSnippets"
            :key="index"
            class="border-border overflow-hidden rounded-2xl border"
          >
            <div class="border-border bg-secondary border-b p-4">
              <h4 class="font-semibold">{{ snippet.title }}</h4>
              <p class="text-muted mt-1 text-sm">{{ snippet.description }}</p>
            </div>
            <pre
              class="bg-foreground text-background overflow-x-auto p-6 text-sm"
            ><code>{{ snippet.code }}</code></pre>
          </div>
        </div>
      </div>

      <div class="border-border my-12 border-t" />

      <!-- CTA -->
      <div class="text-center">
        <h3 class="title-display text-4xl">Interested in Similar Work?</h3>
        <p class="text-muted mt-3 mb-6">Let&rsquo;s discuss how I can help with your project</p>
        <Button size="lg" as="a" href="/contact">Get In Touch</Button>
      </div>
    </div>
  </div>
</template>
