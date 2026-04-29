<script setup lang="ts">
interface SkillGroup {
  label: string
  skills: { name: string; icon: string }[]
}

const skillGroups: SkillGroup[] = [
  {
    label: 'Frameworks',
    skills: [
      { name: 'Vue 3', icon: 'vue' },
      { name: 'React', icon: 'react' },
      { name: 'Node.js', icon: 'nodejs' },
      { name: 'NestJS', icon: 'nestjs' },
      { name: 'Express', icon: 'express' }
    ]
  },
  {
    label: 'Languages & Styling',
    skills: [
      { name: 'TypeScript', icon: 'ts' },
      { name: 'JavaScript', icon: 'js' },
      { name: 'Tailwind', icon: 'tailwind' },
      { name: 'CSS', icon: 'css' },
      { name: 'HTML', icon: 'html' },
      { name: 'PHP', icon: 'php' },
      { name: 'Python', icon: 'python' }
    ]
  },
  {
    label: 'Databases & Infrastructure',
    skills: [
      { name: 'PostgreSQL', icon: 'postgres' },
      { name: 'Redis', icon: 'redis' },
      { name: 'MongoDB', icon: 'mongodb' },
      { name: 'MySQL', icon: 'mysql' },
      { name: 'Docker', icon: 'docker' },
      { name: 'Git', icon: 'git' },
      { name: 'GitLab', icon: 'gitlab' }
    ]
  },
  {
    label: 'Tools',
    skills: [
      { name: 'Postman', icon: 'postman' },
      { name: 'Jenkins', icon: 'jenkins' },
      { name: 'Redux', icon: 'redux' },
      { name: 'Bootstrap', icon: 'bootstrap' },
      { name: 'Flask', icon: 'flask' },
      { name: 'Jest', icon: 'jest' },
      { name: 'Vitest', icon: 'vitest' }
    ]
  }
]

function iconUrl(icon: string): string {
  return `https://skillicons.dev/icons?i=${icon}`
}
</script>

<template>
  <div class="space-y-7 px-4 pb-8">
    <div
      v-for="group in skillGroups"
      :key="group.label"
      v-motion
      :initial="{ opacity: 0, y: 8 }"
      :visible="{ opacity: 1, y: 0 }"
    >
      <!-- Group label -->
      <p class="text-muted mb-3 font-mono text-[10px] tracking-[0.16em] uppercase">
        {{ group.label }}
      </p>

      <!-- Icon grid -->
      <div class="flex flex-wrap gap-3">
        <div
          v-for="skill in group.skills"
          :key="skill.name"
          class="group flex flex-col items-center gap-1.5"
        >
          <div
            class="glass-card flex h-12 w-12 items-center justify-center p-1.5 transition-transform duration-200 group-hover:-translate-y-0.5"
          >
            <img
              :src="iconUrl(skill.icon)"
              :alt="skill.name"
              class="h-full w-full object-contain"
              loading="lazy"
              width="40"
              height="40"
            />
          </div>
          <span class="text-muted font-mono text-[9px] tracking-[0.06em]">{{ skill.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
