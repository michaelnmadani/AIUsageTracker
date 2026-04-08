import React, { useEffect, useState, useRef } from 'react';

interface TokenCounterProps {
  value: number;
  label: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Animated odometer-style token counter that smoothly rolls between values.
 */
export const TokenCounter: React.FC<TokenCounterProps> = ({
  value,
  label,
  color = '#f59e0b',
  size = 'md',
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const animationRef = useRef<number>();
  const startValueRef = useRef(displayValue);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (value === displayValue) return;

    startValueRef.current = displayValue;
    startTimeRef.current = Date.now();
    const duration = 800; // ms

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(
        startValueRef.current + (value - startValueRef.current) * eased
      );

      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value]);

  const fontSize = size === 'lg' ? '24px' : size === 'md' ? '18px' : '14px';
  const labelSize = size === 'lg' ? '11px' : size === 'md' ? '10px' : '9px';

  const formatted = displayValue.toLocaleString();

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize,
          fontWeight: 700,
          color,
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          letterSpacing: '-0.5px',
          lineHeight: 1.2,
        }}
      >
        {formatted}
      </div>
      <div
        style={{
          fontSize: labelSize,
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginTop: '2px',
        }}
      >
        {label}
      </div>
    </div>
  );
};
