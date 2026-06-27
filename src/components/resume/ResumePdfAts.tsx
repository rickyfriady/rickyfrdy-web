import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { Education, ExperienceProject, SkillCategory, WorkExperience } from '@/models'

const s = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 48,
    paddingVertical: 40,
    fontFamily: 'Helvetica',
    color: '#000000',
    fontSize: 10
  },
  name: { fontSize: 18, marginBottom: 4, fontFamily: 'Helvetica-Bold' },
  subtitle: { fontSize: 10, marginBottom: 4 },
  contactRow: { flexDirection: 'row', gap: 16, marginBottom: 2 },
  contactText: { fontSize: 9 },
  hr: { borderBottomWidth: 0.5, borderBottomColor: '#000000', marginVertical: 10 },
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  entryBlock: { marginBottom: 12 },
  entryTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  entryMeta: { fontSize: 9, marginBottom: 4 },
  bulletRow: { flexDirection: 'row', marginBottom: 2 },
  bulletDash: { marginRight: 5, fontSize: 9 },
  bulletText: { flex: 1, fontSize: 9, lineHeight: 1.5 },
  plainText: { fontSize: 9, lineHeight: 1.5 },
  summaryText: { fontSize: 9, lineHeight: 1.6 }
})

interface Props {
  experiences: WorkExperience[]
  projects: ExperienceProject[]
  education: Education
  skillCategories: SkillCategory[]
  summary: string
}

export default function ResumePdfAts({
  experiences,
  projects,
  education,
  skillCategories,
  summary
}: Props) {
  return (
    <Document title="Ricki Friadi — Resume (ATS)">
      <Page size="A4" style={s.page}>
        <Text style={s.name}>Ricki Friadi</Text>
        <Text style={s.subtitle}>Fullstack Developer</Text>
        <View style={s.contactRow}>
          <Text style={s.contactText}>Jakarta, Indonesia</Text>
          <Text style={s.contactText}>friadi.ricki@gmail.com</Text>
          <Text style={s.contactText}>github.com/rickyfriady</Text>
        </View>

        <View style={s.hr} />
        <Text style={s.sectionLabel}>Summary</Text>
        <Text style={s.summaryText}>{summary}</Text>

        <View style={s.hr} />
        <Text style={s.sectionLabel}>Work Experience</Text>
        {experiences.map((exp) => (
          <View key={`${exp.company}-${exp.role}`} style={s.entryBlock}>
            <Text style={s.entryTitle}>
              {exp.role} - {exp.company}
            </Text>
            <Text style={s.entryMeta}>
              {exp.location} | {exp.period}
            </Text>
            {exp.bullets.map((b) => (
              <View key={b} style={s.bulletRow}>
                <Text style={s.bulletDash}>-</Text>
                <Text style={s.bulletText}>{b}</Text>
              </View>
            ))}
            <Text style={s.plainText}>Technologies: {exp.stack.join(', ')}</Text>
          </View>
        ))}

        <View style={s.hr} />
        <Text style={s.sectionLabel}>Project Experience</Text>
        {projects.map((proj) => (
          <View key={`${proj.company}-${proj.title}`} style={s.entryBlock}>
            <Text style={s.entryTitle}>
              {proj.title} - {proj.company}
            </Text>
            <Text style={s.entryMeta}>{proj.period}</Text>
            {proj.bullets.map((b) => (
              <View key={b} style={s.bulletRow}>
                <Text style={s.bulletDash}>-</Text>
                <Text style={s.bulletText}>{b}</Text>
              </View>
            ))}
            <Text style={s.plainText}>Technologies: {proj.stack.join(', ')}</Text>
          </View>
        ))}

        <View style={s.hr} />
        <Text style={s.sectionLabel}>Education</Text>
        <View style={s.entryBlock}>
          <Text style={s.entryTitle}>
            {education.degree} - {education.institution}
          </Text>
          <Text style={s.entryMeta}>
            {education.location} | {education.period}
          </Text>
          <Text style={s.plainText}>GPA: {education.gpa}</Text>
        </View>

        <View style={s.hr} />
        <Text style={s.sectionLabel}>Skills</Text>
        {skillCategories.map((cat) => (
          <View key={cat.label} style={{ marginBottom: 4 }}>
            <Text style={s.plainText}>
              {cat.label}: {cat.items.join(', ')}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  )
}
