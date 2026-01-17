<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useGitHub, type ContributionDay } from '@/composables/useGitHub'
import { Skeleton } from '@/components/ui/skeleton'

const { stats, loading, error, fetchGitHubStats } = useGitHub()

// Group contributions by week
const weeks = computed(() => {
  if (!stats.value) return []
  
  const calendar = stats.value.contributionCalendar
  const grouped: ContributionDay[][] = []
  
  for (let i = 0; i < calendar.length; i += 7) {
    grouped.push(calendar.slice(i, i + 7))
  }
  
  return grouped
})

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getColorClass(level: number): string {
  const colors = {
    0: 'bg-muted/30',
    1: 'bg-accent/30',
    2: 'bg-accent/50',
    3: 'bg-accent/70',
    4: 'bg-accent'
  }
  return colors[level as keyof typeof colors] || colors[0]
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

onMounted(() => {
  fetchGitHubStats()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h3 class="text-2xl font-bold mb-2">GitHub Activity</h3>
        <p class="text-muted">Consistency and commitment to continuous learning</p>
      </div>
      
      <div v-if="stats" class="flex gap-6 text-sm">
        <div>
          <div class="text-2xl font-bold text-accent">{{ stats.totalContributions }}</div>
          <div class="text-muted">Total Contributions</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-accent">{{ stats.currentStreak }}</div>
          <div class="text-muted">Current Streak</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-accent">{{ stats.longestStreak }}</div>
          <div class="text-muted">Longest Streak</div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-2">
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-32 w-full" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
      <p class="text-red-500">Failed to load GitHub data: {{ error }}</p>
      <button 
        @click="fetchGitHubStats"
        class="mt-2 text-sm text-accent hover:underline"
      >
        Try again
      </button>
    </div>

    <!-- Heatmap -->
    <div v-else-if="stats" class="overflow-x-auto pb-4">
      <div class="inline-block min-w-full">
        <!-- Month labels -->
        <div class="flex mb-2 text-xs text-muted pl-8">
          <div 
            v-for="(month, index) in months" 
            :key="month"
            class="flex-none"
            :style="{ width: `${100 / 12}%` }"
          >
            {{ month }}
          </div>
        </div>

        <div class="flex gap-1">
          <!-- Day labels -->
          <div class="flex flex-col gap-1 text-xs text-muted justify-around pr-2">
            <div>Mon</div>
            <div>Wed</div>
            <div>Fri</div>
          </div>

          <!-- Contribution grid -->
          <div class="flex gap-1">
            <div 
              v-for="(week, weekIndex) in weeks" 
              :key="weekIndex"
              class="flex flex-col gap-1"
            >
              <div
                v-for="(day, dayIndex) in week"
                :key="day.date"
                :class="getColorClass(day.level)"
                class="w-3 h-3 rounded-sm transition-all hover:ring-2 hover:ring-accent hover:scale-125 cursor-pointer"
                :title="`${day.count} contributions on ${formatDate(day.date)}`"
              />
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="flex items-center gap-2 mt-4 text-xs text-muted">
          <span>Less</span>
          <div class="flex gap-1">
            <div class="w-3 h-3 rounded-sm bg-muted/30" />
            <div class="w-3 h-3 rounded-sm bg-accent/30" />
            <div class="w-3 h-3 rounded-sm bg-accent/50" />
            <div class="w-3 h-3 rounded-sm bg-accent/70" />
            <div class="w-3 h-3 rounded-sm bg-accent" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>

    <!-- GitHub Link -->
    <div v-if="stats" class="text-center">
      <a 
        href="https://github.com/rickyfrdy" 
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 text-sm text-accent hover:underline"
      >
        View full profile on GitHub
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.840 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>
    </div>
  </div>
</template>
