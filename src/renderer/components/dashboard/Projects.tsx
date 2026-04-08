import React from 'react';
import type { ProjectStats } from '../../types/usage';
import { formatTokenCount, formatTimeAgo } from '../../utils/formatters';

interface ProjectsProps {
  projects: ProjectStats[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  if (projects.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100px',
          color: '#64748b',
          fontSize: '12px',
        }}
      >
        No project data yet
      </div>
    );
  }

  const maxTokens = Math.max(...projects.map((p) => p.totalTokens), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {projects.map((project) => (
        <div
          key={project.name}
          style={{
            padding: '8px 10px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background bar */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${(project.totalTokens / maxTokens) * 100}%`,
              background: 'linear-gradient(90deg, rgba(147, 51, 234, 0.08), rgba(59, 130, 246, 0.05))',
              borderRadius: '8px',
            }}
          />

          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#e2e8f0',
                  marginBottom: '2px',
                }}
              >
                {project.name}
              </div>
              <div style={{ fontSize: '9px', color: '#64748b' }}>
                {project.sessionCount} session{project.sessionCount !== 1 ? 's' : ''} &middot;{' '}
                {formatTimeAgo(project.lastActive)}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#f59e0b',
                  fontFamily: "'SF Mono', monospace",
                }}
              >
                {formatTokenCount(project.totalTokens)}
              </div>
              <div style={{ fontSize: '8px', color: '#64748b' }}>
                {formatTokenCount(project.inputTokens)} in / {formatTokenCount(project.outputTokens)} out
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
