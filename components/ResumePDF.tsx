import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    borderBottomStyle: 'solid',
  },
  name: {
    fontSize: 24,
    marginBottom: 5,
  },
  contact: {
    fontSize: 10,
    color: '#666',
    marginBottom: 3,
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderBottomStyle: 'solid',
  },
  statsBox: {
    marginTop: 15,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statsLabel: {
    fontSize: 10,
    color: '#666',
  },
  statsValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  project: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderBottomStyle: 'solid',
  },
  projectTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5,
  },
  projectMeta: {
    fontSize: 9,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 10,
  },
  techContainer: {
    marginTop: 8,
  },
  techLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  techList: {
    fontSize: 9,
    color: '#444',
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

export const ResumePDF = ({ data }: { data: ResumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.user.name || 'Developer Portfolio'}</Text>
        <Text style={styles.contact}>{data.user.email}</Text>
        <Text style={styles.contact}>Portfolio: buildfolio-khaki.vercel.app</Text>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsBox}>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Completed Projects:</Text>
          <Text style={styles.statsValue}>{data.stats.totalProjects}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Total Development Time:</Text>
          <Text style={styles.statsValue}>{data.stats.totalHours} hours</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Technologies Mastered:</Text>
          <Text style={styles.statsValue}>{data.stats.technologiesLearned.length}</Text>
        </View>
      </View>

      {/* Projects Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Portfolio Projects</Text>
        
        {data.completedProjects.map((project, index) => (
          <View key={project.id} style={styles.project}>
            <Text style={styles.projectTitle}>
              {index + 1}. {project.title}
            </Text>
            
            <Text style={styles.projectMeta}>
              Difficulty: {project.difficulty} | Timeline: {project.timeEstimate || 'Self-paced'}
            </Text>
            
            <Text style={styles.description}>
              {project.description || 'Full-stack application demonstrating modern development practices'}
            </Text>
            
            <View style={styles.techContainer}>
              <Text style={styles.techLabel}>Technologies Used:</Text>
              <Text style={styles.techList}>
                {project.technologies.join(', ')}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Technical Skills */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technical Skills</Text>
        <Text style={styles.techList}>
          {data.stats.technologiesLearned.join(' • ')}
        </Text>
      </View>

      {/* Footer */}
      <View style={{ position: 'absolute', bottom: 30, left: 40, right: 40 }}>
        <Text style={{ fontSize: 8, color: '#999', textAlign: 'center' }}>
          Generated from Buildfolio • {new Date().toLocaleDateString()}
        </Text>
      </View>
    </Page>
  </Document>
)

export default ResumePDF
