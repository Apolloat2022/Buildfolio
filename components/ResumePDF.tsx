import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    borderBottomStyle: 'solid',
  },
  name: {
    fontSize: 24,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  contact: {
    fontSize: 9,
    color: '#666',
    marginBottom: 2,
  },
  section: {
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderBottomStyle: 'solid',
  },
  subsectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 10,
  },
  experienceItem: {
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  company: {
    fontSize: 10,
    color: '#2563eb',
    marginBottom: 2,
  },
  dates: {
    fontSize: 9,
    color: '#666',
    marginBottom: 4,
  },
  description: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 4,
  },
  statsBox: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  bulletPoint: {
    fontSize: 9,
    marginBottom: 2,
    marginLeft: 10,
  },
})

interface ResumeData {
  user: {
    name: string | null
    email: string | null
  }
  profile?: {
    phone?: string | null
    location?: string | null
    website?: string | null
    linkedin?: string | null
    github?: string | null
    professionalSummary?: string | null
    workExperience?: any[]
    education?: any[]
    certifications?: any[]
    skills?: any
    languages?: string[]
  } | null
  completedProjects: Array<{
    id: string
    title: string
    description: string | null
    technologies: string[]
    completedAt: Date
    difficulty: string
    timeEstimate: string | null
  }>
  stats: {
    totalProjects: number
    totalHours: number
    technologiesLearned: string[]
  }
}

export const ResumePDF = ({ data }: { data: ResumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.user.name || 'Developer Portfolio'}</Text>
        <Text style={styles.contact}>{data.user.email}</Text>
        {data.profile?.phone && <Text style={styles.contact}>{data.profile.phone}</Text>}
        {data.profile?.location && <Text style={styles.contact}>{data.profile.location}</Text>}
        {data.profile?.website && <Text style={styles.contact}>{data.profile.website}</Text>}
        {data.profile?.linkedin && <Text style={styles.contact}>LinkedIn: {data.profile.linkedin}</Text>}
        {data.profile?.github && <Text style={styles.contact}>GitHub: {data.profile.github}</Text>}
      </View>

      {/* Professional Summary */}
      {data.profile?.professionalSummary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.summary}>{data.profile.professionalSummary}</Text>
        </View>
      )}

      {/* Work Experience */}
      {data.profile?.workExperience && data.profile.workExperience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {data.profile.workExperience.map((exp: any, index: number) => (
            <View key={index} style={styles.experienceItem}>
              <Text style={styles.jobTitle}>{exp.position}</Text>
              <Text style={styles.company}>{exp.company}</Text>
              <Text style={styles.dates}>
                {exp.startDate} - {exp.endDate || 'Present'}
              </Text>
              <Text style={styles.description}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {data.profile?.education && data.profile.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.profile.education.map((edu: any, index: number) => (
            <View key={index} style={styles.experienceItem}>
              <Text style={styles.jobTitle}>{edu.degree} in {edu.field}</Text>
              <Text style={styles.company}>{edu.school}</Text>
              <Text style={styles.dates}>{edu.year}</Text>
              {edu.description && <Text style={styles.description}>{edu.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* Portfolio Projects */}
      {data.completedProjects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio Projects</Text>
          <View style={styles.statsBox}>
            <View style={styles.statsRow}>
              <Text>Completed Projects: {data.stats.totalProjects}</Text>
              <Text>Development Time: {data.stats.totalHours} hours</Text>
            </View>
          </View>
          {data.completedProjects.map((project, index) => (
            <View key={project.id} style={styles.experienceItem}>
              <Text style={styles.jobTitle}>{project.title}</Text>
              <Text style={styles.dates}>
                {project.difficulty} • {project.timeEstimate || 'Self-paced'}
              </Text>
              <Text style={styles.description}>{project.description}</Text>
              <Text style={styles.bulletPoint}>
                Technologies: {project.technologies.join(', ')}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Certifications */}
      {data.profile?.certifications && data.profile.certifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          {data.profile.certifications.map((cert: any, index: number) => (
            <View key={index} style={{ marginBottom: 6 }}>
              <Text style={styles.subsectionTitle}>{cert.name}</Text>
              <Text style={styles.description}>
                {cert.issuer} • {cert.date}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Technical Skills */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technical Skills</Text>
        <Text style={styles.description}>
          {data.stats.technologiesLearned.join(' • ')}
        </Text>
        {data.profile?.skills && (
          <Text style={styles.description}>
            Additional: {data.profile.skills}
          </Text>
        )}
      </View>

      {/* Languages */}
      {data.profile?.languages && data.profile.languages.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <Text style={styles.description}>{data.profile.languages.join(', ')}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={{ position: 'absolute', bottom: 20, left: 40, right: 40 }}>
        <Text style={{ fontSize: 8, color: '#999', textAlign: 'center' }}>
          Generated from Buildfolio • {new Date().toLocaleDateString()}
        </Text>
      </View>
    </Page>
  </Document>
)

export default ResumePDF
