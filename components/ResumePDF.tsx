import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #2563eb',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  contact: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 2,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    borderBottom: '1 solid #e2e8f0',
    paddingBottom: 5,
  },
  project: {
    marginBottom: 15,
  },
  projectTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5,
  },
  projectMeta: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 5,
  },
  description: {
    fontSize: 10,
    color: '#334155',
    marginBottom: 8,
    lineHeight: 1.5,
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  techBadge: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    padding: '3 8',
    marginRight: 5,
    marginBottom: 5,
    fontSize: 8,
    borderRadius: 3,
  },
  stats: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 5,
  },
  statsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  statsLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  statsValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e293b',
  },
})

interface ResumeData {
  user: {
    name: string | null
    email: string | null
  }
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

export const ResumePDF = ({ data }: { data: ResumeData }) => {
  const { user, completedProjects, stats } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{user.name || 'Developer Portfolio'}</Text>
          <Text style={styles.contact}>{user.email}</Text>
          <Text style={styles.contact}>Portfolio: buildfolio-khaki.vercel.app</Text>
        </View>

        <View style={styles.stats}>
          <Text style={styles.statsTitle}>Portfolio Summary</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Completed Projects:</Text>
            <Text style={styles.statsValue}>{stats.totalProjects}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Development Time:</Text>
            <Text style={styles.statsValue}>{stats.totalHours} hours</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Technologies:</Text>
            <Text style={styles.statsValue}>{stats.technologiesLearned.length}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio Projects</Text>
          {completedProjects.map((project, index) => (
            <View key={project.id} style={styles.project}>
              <Text style={styles.projectTitle}>{index + 1}. {project.title}</Text>
              <Text style={styles.projectMeta}>
                {project.difficulty} • {project.timeEstimate || 'Self-paced'}
              </Text>
              <Text style={styles.description}>
                {project.description || 'Full-stack application with modern architecture'}
              </Text>
              {project.technologies.length > 0 && (
                <View style={styles.techStack}>
                  {project.technologies.map((tech, idx) => (
                    <Text key={idx} style={styles.techBadge}>{tech}</Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Skills</Text>
          <View style={styles.techStack}>
            {stats.technologiesLearned.map((tech, idx) => (
              <Text key={idx} style={styles.techBadge}>{tech}</Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default ResumePDF
