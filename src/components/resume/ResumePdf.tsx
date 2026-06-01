import { resolve } from 'node:path'
import { Document, Font, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { Education, Project, SkillCategory, WorkExperience } from '@/data/experience'

Font.register({
  family: 'JetBrains Mono',
  src: resolve('./public/fonts/JetBrainsMono-Regular.ttf')
})
Font.register({
  family: 'Lora',
  src: resolve('./public/fonts/Lora-Italic.ttf')
})

const C = {
  text: '#0e1a16',
  muted: '#6b7c78',
  accent: '#8ca89c',
  bg: '#f8f7f4',
  border: '#dde5e2',
  tagBg: '#e8eeec'
}

const s = StyleSheet.create({
  page: {
    backgroundColor: C.bg,
    paddingHorizontal: 48,
    paddingVertical: 40,
    fontFamily: 'JetBrains Mono',
    color: C.text,
    fontSize: 9
  },
  name: { fontFamily: 'Lora', fontSize: 22, marginBottom: 4, color: C.text },
  subtitle: { fontSize: 10, color: C.muted, marginBottom: 4 },
  contactRow: { flexDirection: 'row', gap: 16, marginBottom: 2 },
  contactText: { fontSize: 8, color: C.muted },
  contactLink: { fontSize: 8, color: C.accent },
  hr: { borderBottomWidth: 0.5, borderBottomColor: C.border, marginVertical: 12 },
  sectionLabel: {
    fontSize: 7.5,
    color: C.muted,
    letterSpacing: 1.5,
    marginBottom: 10,
    textTransform: 'uppercase'
  },
  entryBlock: { marginBottom: 14 },
  entryTitle: { fontSize: 10, color: C.text, marginBottom: 2 },
  entryMeta: { fontSize: 8, color: C.muted, marginBottom: 6 },
  bulletRow: { flexDirection: 'row', marginBottom: 3 },
  bulletArrow: { color: C.accent, marginRight: 5, fontSize: 9 },
  bulletText: { flex: 1, fontSize: 8.5, color: C.text, lineHeight: 1.5 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5, gap: 3 },
  tag: {
    fontSize: 7,
    color: C.muted,
    backgroundColor: C.tagBg,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 2
  },
  summaryText: { fontSize: 8.5, color: C.text, lineHeight: 1.6, marginBottom: 2 },
  skillBlock: { marginBottom: 10 },
  skillLabel: {
    fontSize: 7.5,
    color: C.muted,
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: 'uppercase'
  },
  gpaText: { fontSize: 8.5, color: C.text, marginTop: 4 }
})

interface Props {
  experiences: WorkExperience[]
  projects: Project[]
  education: Education
  skillCategories: SkillCategory[]
  summary: string
}

export default function ResumePdf({
  experiences,
  projects,
  education,
  skillCategories,
  summary
}: Props) {
  return (
    <Document title="Ricki Friadi — Resume">
      <Page size="A4" style={s.page}>
        {/* Header */}
        <Text style={s.name}>Ricki Friadi</Text>
        <Text style={s.subtitle}>Fullstack Developer</Text>
        <View style={s.contactRow}>
          <Text style={s.contactText}>Jakarta, Indonesia</Text>
          <Link src="mailto:friadi.ricki@gmail.com" style={s.contactLink}>
            friadi.ricki@gmail.com
          </Link>
          <Link src="https://github.com/rickyfrdy" style={s.contactLink}>
            github.com/rickyfrdy
          </Link>
        </View>

        <View style={s.hr} />

        {/* Summary */}
        <Text style={s.sectionLabel}>Summary</Text>
        <Text style={s.summaryText}>{summary}</Text>

        <View style={s.hr} />

        {/* Work Experience */}
        <Text style={s.sectionLabel}>Work Experience</Text>
        {experiences.map((exp) => (
          <View key={`${exp.company}-${exp.role}`} style={s.entryBlock}>
            <Text style={s.entryTitle}>
              {exp.role} · {exp.company}
            </Text>
            <Text style={s.entryMeta}>
              {exp.location} · {exp.period}
            </Text>
            {exp.bullets.map((b) => (
              <View key={b} style={s.bulletRow}>
                <Text style={s.bulletArrow}>›</Text>
                <Text style={s.bulletText}>{b}</Text>
              </View>
            ))}
            <View style={s.tagsRow}>
              {exp.stack.map((tech) => (
                <Text key={tech} style={s.tag}>
                  {tech}
                </Text>
              ))}
            </View>
          </View>
        ))}

        <View style={s.hr} />

        {/* Project Experience */}
        <Text style={s.sectionLabel}>Project Experience</Text>
        {projects.map((proj) => (
          <View key={`${proj.company}-${proj.title}`} style={s.entryBlock}>
            <Text style={s.entryTitle}>
              {proj.title} · {proj.company}
            </Text>
            <Text style={s.entryMeta}>{proj.period}</Text>
            {proj.bullets.map((b) => (
              <View key={b} style={s.bulletRow}>
                <Text style={s.bulletArrow}>›</Text>
                <Text style={s.bulletText}>{b}</Text>
              </View>
            ))}
            <View style={s.tagsRow}>
              {proj.stack.map((tech) => (
                <Text key={tech} style={s.tag}>
                  {tech}
                </Text>
              ))}
            </View>
          </View>
        ))}

        <View style={s.hr} />

        {/* Education */}
        <Text style={s.sectionLabel}>Education</Text>
        <View style={s.entryBlock}>
          <Text style={s.entryTitle}>
            {education.degree} · {education.institution}
          </Text>
          <Text style={s.entryMeta}>
            {education.location} · {education.period}
          </Text>
          <Text style={s.gpaText}>GPA: {education.gpa}</Text>
        </View>

        <View style={s.hr} />

        {/* Skills */}
        <Text style={s.sectionLabel}>Skills</Text>
        {skillCategories.map((cat) => (
          <View key={cat.label} style={s.skillBlock}>
            <Text style={s.skillLabel}>{cat.label}</Text>
            <View style={s.tagsRow}>
              {cat.items.map((item) => (
                <Text key={item} style={s.tag}>
                  {item}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  )
}
