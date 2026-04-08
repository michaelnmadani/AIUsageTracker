import React from 'react';
import { getModelColor, getModelDisplayName } from '../../utils/formatters';

interface ModelBadgeProps {
  model: string | null;
  size?: 'sm' | 'md';
}

/**
 * Color-coded model badge (purple for Opus, blue for Sonnet, green for Haiku).
 */
export const ModelBadge: React.FC<ModelBadgeProps> = ({ model, size = 'md' }) => {
  if (!model) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: size === 'sm' ? '2px 6px' : '3px 10px',
          borderRadius: '12px',
          fontSize: size === 'sm' ? '9px' : '11px',
          fontWeight: 600,
          backgroundColor: 'rgba(107, 114, 128, 0.2)',
          color: '#6b7280',
          letterSpacing: '0.3px',
        }}
      >
        No model
      </span>
    );
  }

  const color = getModelColor(model);
  const name = getModelDisplayName(model);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: size === 'sm' ? '2px 6px' : '3px 10px',
        borderRadius: '12px',
        fontSize: size === 'sm' ? '9px' : '11px',
        fontWeight: 600,
        backgroundColor: `${color}22`,
        color: color,
        letterSpacing: '0.3px',
      }}
    >
      <span
        style={{
          width: size === 'sm' ? '5px' : '6px',
          height: size === 'sm' ? '5px' : '6px',
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
      {name}
    </span>
  );
};
