export interface Skill {
  name: string
  icon: string
}

export interface SkillGroup {
  label: string
  skills: Skill[]
}

export const skillGroups: SkillGroup[] = [
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
