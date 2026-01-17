<script setup lang="ts">
import { ref } from 'vue'
import { Badge } from '@/components/ui/badge'

interface TimelineItem {
  year: string
  title: string
  description: string
  technologies: string[]
  highlights: string[]
}

const timelineItems: TimelineItem[] = [
  {
    year: 'Year 1',
    title: 'Foundation & Learning',
    description: 'Started my journey into fullstack development, learning the fundamentals of Node.js and building my first production applications.',
    technologies: ['Node.js', 'Express', 'MongoDB', 'JavaScript', 'HTML/CSS'],
    highlights: [
      'Built first REST API',
      'Learned database design',
      'Deployed first production app',
      'Mastered Git workflow'
    ]
  },
  {
    year: 'Year 2',
    title: 'Growth & Complex Systems',
    description: 'Expanded skills into TypeScript and started working on more complex systems with microservices architecture.',
    technologies: ['TypeScript', 'PostgreSQL', 'Docker', 'Redis', 'Vue.js'],
    highlights: [
      'Migrated codebase to TypeScript',
      'Implemented caching strategies',
      'Built microservices architecture',
      'Collaborated with cross-functional teams'
    ]
  },
  {
    year: 'Year 3',
    title: 'Expertise & Architecture',
    description: 'Took ownership of architectural decisions, optimized systems for scale, and mentored junior developers.',
    technologies: ['Kubernetes', 'GraphQL', 'React', 'AWS', 'CI/CD'],
    highlights: [
      'Led system architecture design',
      'Reduced API latency by 60%',
      'Implemented automated testing',
      'Mentored 2 junior developers'
    ]
  },
  {
    year: 'Year 4',
    title: 'Mastery & Innovation',
    description: 'Currently building scalable systems with modern tools, exploring new technologies, and contributing to open source.',
    technologies: ['Vue 3', 'Tailwind', 'Prisma', 'WebSocket', 'Serverless'],
    highlights: [
      'Building production-grade applications',
      'Contributing to open source',
      'Exploring new technologies',
      'Sharing knowledge through blogs'
    ]
  }
]

const expandedIndex = ref<number | null>(null)

function toggleExpand(index: number) {
  expandedIndex.value = expandedIndex.value === index ? null : index
}
</script>

<template>
  <div class="space-y-6">
    <div class="text-center mb-12">
      <h3 class="text-3xl font-bold mb-4">My Journey</h3>
      <p class="text-muted max-w-2xl mx-auto">
        Four years of continuous learning, building, and growing as a fullstack developer
      </p>
    </div>

    <!-- Desktop Timeline (Vertical) -->
    <div class="hidden md:block relative">
      <!-- Vertical Line -->
      <div class="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-border" />

      <div class="space-y-12">
        <div
          v-for="(item, index) in timelineItems"
          :key="index"
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :visible="{ opacity: 1, y: 0 }"
          :delay="index * 200"
          class="relative"
        >
          <!-- Timeline Dot -->
          <div 
            class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-accent border-4 border-background z-10"
          />

          <!-- Content (Alternating Sides) -->
          <div 
            :class="index % 2 === 0 ? 'pr-[52%]' : 'pl-[52%]'"
            class="relative"
          >
            <div 
              class="p-6 rounded-xl border border-border bg-background hover:border-accent hover:shadow-lg transition-all cursor-pointer"
              @click="toggleExpand(index)"
            >
              <!-- Year Badge -->
              <div class="inline-block mb-3">
                <Badge variant="default" class="text-sm">
                  {{ item.year }}
                </Badge>
              </div>

              <h4 class="text-xl font-bold mb-2">{{ item.title }}</h4>
              <p class="text-muted mb-4">{{ item.description }}</p>

              <!-- Technologies -->
              <div class="flex flex-wrap gap-2 mb-4">
                <Badge 
                  v-for="tech in item.technologies" 
                  :key="tech"
                  variant="secondary"
                >
                  {{ tech }}
                </Badge>
              </div>

              <!-- Expandable Highlights -->
              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="max-h-0 opacity-0"
                enter-to-class="max-h-96 opacity-100"
                leave-active-class="transition-all duration-300 ease-in"
                leave-from-class="max-h-96 opacity-100"
                leave-to-class="max-h-0 opacity-0"
              >
                <div v-if="expandedIndex === index" class="overflow-hidden">
                  <div class="pt-4 border-t border-border">
                    <h5 class="text-sm font-semibold mb-2">Key Highlights:</h5>
                    <ul class="space-y-1">
                      <li 
                        v-for="highlight in item.highlights" 
                        :key="highlight"
                        class="text-sm text-muted flex items-start"
                      >
                        <span class="text-accent mr-2">✓</span>
                        {{ highlight }}
                      </li>
                    </ul>
                  </div>
                </div>
              </Transition>

              <!-- Expand Indicator -->
              <div class="text-xs text-accent mt-2">
                {{ expandedIndex === index ? 'Click to collapse' : 'Click to expand' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Timeline (Horizontal Scroll) -->
    <div class="md:hidden overflow-x-auto pb-4">
      <div class="flex gap-4 min-w-max">
        <div
          v-for="(item, index) in timelineItems"
          :key="index"
          class="w-72 flex-shrink-0"
        >
          <div class="p-6 rounded-xl border border-border bg-background h-full">
            <Badge variant="default" class="mb-3">
              {{ item.year }}
            </Badge>
            <h4 class="text-lg font-bold mb-2">{{ item.title }}</h4>
            <p class="text-sm text-muted mb-4">{{ item.description }}</p>
            <div class="flex flex-wrap gap-2">
              <Badge 
                v-for="tech in item.technologies.slice(0, 3)" 
                :key="tech"
                variant="secondary"
                class="text-xs"
              >
                {{ tech }}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
