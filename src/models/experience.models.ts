export interface WorkExperience {
  role: string
  company: string
  location: string
  period: string
  bullets: string[]
  stack: string[]
  companyLogo?: string
}

/** Project entry on a resume/CV (distinct from a portfolio Project). */
export interface ExperienceProject {
  title: string
  company: string
  period: string
  bullets: string[]
  stack: string[]
  companyLogo?: string
}

export interface Education {
  institution: string
  degree: string
  location: string
  period: string
  gpa: string
}

export interface SkillCategory {
  label: string
  icon: string
  items: string[]
}
