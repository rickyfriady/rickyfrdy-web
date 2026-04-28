<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SkillCategory {
  title: string
  skills: Skill[]
}

interface Skill {
  name: string
  level: number // 1-5
  years: number
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', level: 5, years: 4 },
      { name: 'TypeScript', level: 5, years: 3 },
      { name: 'Express', level: 5, years: 4 },
      { name: 'PostgreSQL', level: 4, years: 3 },
      { name: 'MongoDB', level: 4, years: 3 },
      { name: 'Redis', level: 4, years: 2 }
    ]
  },
  {
    title: 'Frontend',
    skills: [
      { name: 'Vue 3', level: 5, years: 2 },
      { name: 'React', level: 4, years: 2 },
      { name: 'Tailwind CSS', level: 5, years: 2 },
      { name: 'JavaScript', level: 5, years: 4 },
      { name: 'HTML/CSS', level: 5, years: 4 }
    ]
  },
  {
    title: 'DevOps & Tools',
    skills: [
      { name: 'Docker', level: 4, years: 2 },
      { name: 'Git', level: 5, years: 4 },
      { name: 'CI/CD', level: 4, years: 2 },
      { name: 'AWS', level: 3, years: 1 },
      { name: 'Kubernetes', level: 3, years: 1 }
    ]
  },
  {
    title: 'Other',
    skills: [
      { name: 'REST APIs', level: 5, years: 4 },
      { name: 'GraphQL', level: 4, years: 2 },
      { name: 'WebSocket', level: 4, years: 2 },
      { name: 'Testing', level: 4, years: 3 },
      { name: 'Agile/Scrum', level: 4, years: 3 }
    ]
  }
]

function getLevelText(level: number): string {
  const levels = {
    1: 'Beginner',
    2: 'Elementary',
    3: 'Intermediate',
    4: 'Advanced',
    5: 'Expert'
  }
  return levels[level as keyof typeof levels] || 'Unknown'
}
</script>

<template>
  <div class="space-y-6">
    <div class="mb-12 text-center">
      <h3 class="mb-4 text-3xl font-bold">Technical Skills</h3>
      <p class="text-muted mx-auto max-w-2xl">
        Technologies and tools I work with on a daily basis
      </p>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card
        v-for="(category, categoryIndex) in skillCategories"
        :key="category.title"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible="{ opacity: 1, y: 0 }"
        :delay="categoryIndex * 100"
        class="transition-shadow hover:shadow-lg"
      >
        <CardHeader>
          <CardTitle class="text-xl">{{ category.title }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="skill in category.skills" :key="skill.name" class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-medium">{{ skill.name }}</span>
                <Badge variant="secondary" class="text-xs"> {{ skill.years }}y </Badge>
              </div>

              <!-- Proficiency Bar -->
              <div class="relative">
                <div class="bg-muted/30 h-2 overflow-hidden rounded-full">
                  <div
                    class="bg-accent h-full rounded-full transition-all duration-1000"
                    :style="{ width: `${(skill.level / 5) * 100}%` }"
                    v-motion
                    :initial="{ width: '0%' }"
                    :visible="{ width: `${(skill.level / 5) * 100}%` }"
                    :delay="categoryIndex * 100 + 200"
                  />
                </div>
                <span class="text-muted mt-1 block text-xs">
                  {{ getLevelText(skill.level) }}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
