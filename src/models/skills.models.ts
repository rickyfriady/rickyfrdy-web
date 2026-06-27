export interface Skill {
  name: string
  icon: string
}

export interface SkillGroup {
  label: string
  skills: Skill[]
}
