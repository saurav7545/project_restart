import { useState, useEffect } from 'react';
import { projectAPI } from '../services/api';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  card: {
    padding: '16px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  addRow: {
    display: 'flex',
    gap: '12px',
  },
  input: {
    background: 'rgba(26,26,46,0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#e0e0e0',
    flex: 1,
    transition: 'all 0.3s ease',
  },
  select: {
    background: 'rgba(26,26,46,0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#e0e0e0',
    width: '128px',
    transition: 'all 0.3s ease',
  },
  addBtn: {
    background: 'linear-gradient(135deg, #4ecca3, #06b6d4, #a855f7)',
    backgroundSize: '200% 200%',
    color: '#0a0a0f',
    fontWeight: 600,
    padding: '10px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    animation: 'btnGradient 3s ease infinite',
  },
  projectList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  projectCard: {
    padding: '20px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'all 0.3s ease',
  },
  projectHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  projectName: {
    fontWeight: 600,
    fontSize: '1.125rem',
  },
  projectDesc: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '4px',
  },
  statusBadge: {
    fontSize: '0.75rem',
    padding: '4px 8px',
    borderRadius: '9999px',
  },
  githubLink: {
    fontSize: '0.75rem',
    color: '#4ecca3',
    textDecoration: 'none',
    marginTop: '8px',
    display: 'inline-block',
  },
  progressSection: {
    marginTop: '12px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: '#6b7280',
    marginBottom: '4px',
  },
  progressBar: {
    width: '100%',
    background: '#1a1a2e',
    borderRadius: '4px',
    height: '8px',
    overflow: 'hidden',
  },
  progressFill: {
    background: 'linear-gradient(90deg, #4ecca3, #06b6d4, #a855f7)',
    height: '8px',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  emptyState: {
    padding: '32px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(26,26,46,0.85), rgba(22,33,62,0.85))',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '2.5rem',
    marginBottom: '12px',
  },
  emptyText: {
    color: '#6b7280',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '256px',
  },
  loadingIcon: {
    fontSize: '2.5rem',
    animation: 'float 3s ease-in-out infinite',
  },
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', status: 'planning', priority: 'medium' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await projectAPI.getProjects();
      setProjects(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const addProject = async () => {
    if (!newProject.name.trim()) return;
    try {
      const res = await projectAPI.createProject(newProject);
      setProjects([res.data, ...projects]);
      setNewProject({ name: '', status: 'planning', priority: 'medium' });
    } catch (err) { console.error(err); }
  };

  if (loading) return <div style={styles.loading}><div style={styles.loadingIcon}>💻</div></div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💻 Projects</h1>

      <div style={styles.card}>
        <div style={styles.addRow}>
          <input style={styles.input} placeholder="Project name" value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} />
          <select style={styles.select} value={newProject.priority}
            onChange={(e) => setNewProject({ ...newProject, priority: e.target.value })}>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
          <button onClick={addProject} style={styles.addBtn}>+ Add</button>
        </div>
      </div>

      <div style={styles.projectList}>
        {projects.map((project) => (
          <div key={project.id} style={styles.projectCard}>
            <div style={styles.projectHeader}>
              <div>
                <h3 style={styles.projectName}>{project.emoji} {project.name}</h3>
                <p style={styles.projectDesc}>{project.description}</p>
              </div>
              <span style={{
                ...styles.statusBadge,
                ...(project.status === 'completed' ? { background: 'rgba(78,204,163,0.2)', color: '#4ecca3' } :
                  project.status === 'in_progress' ? { background: 'rgba(59,130,246,0.2)', color: '#60a5fa' } :
                  { background: 'rgba(107,114,128,0.2)', color: '#9ca3af' })
              }}>{project.status.replace('_', ' ')}</span>
            </div>
            {project.github_link && (
              <a href={project.github_link} target="_blank" rel="noopener noreferrer" style={styles.githubLink}>
                🔗 GitHub
              </a>
            )}
            <div style={styles.progressSection}>
              <div style={styles.progressHeader}>
                <span>Progress</span>
                <span>{project.progress_percentage}%</span>
              </div>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${project.progress_percentage}%` }} />
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>🚀</p>
            <p style={styles.emptyText}>No projects yet. Start building!</p>
          </div>
        )}
      </div>
    </div>
  );
}