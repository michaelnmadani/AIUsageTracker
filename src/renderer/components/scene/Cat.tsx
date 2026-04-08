import React from 'react';

interface CatProps {
  color?: string;
  eyeColor?: string;
  size?: number;
  className?: string;
  accessory?: 'chef-hat' | 'wizard-hat' | 'safari-hat' | 'bow' | 'glasses' | 'none';
}

/**
 * Base SVG cat component - a cute, rounded cat in the Cats & Soup style.
 * Soft shapes, thick outlines, pastel colors.
 */
export const Cat: React.FC<CatProps> = ({
  color = '#fafafa',
  eyeColor = '#424242',
  size = 60,
  className = '',
  accessory = 'none',
}) => {
  const scale = size / 60;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <g transform={`scale(${1})`}>
        {/* Tail */}
        <path
          d="M 15 45 Q 5 40, 8 30 Q 10 25, 14 28"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Body */}
        <ellipse cx="30" cy="42" rx="16" ry="13" fill={color} stroke="#5d4037" strokeWidth="1.5" />

        {/* Head */}
        <circle cx="30" cy="25" r="14" fill={color} stroke="#5d4037" strokeWidth="1.5" />

        {/* Left ear */}
        <polygon
          points="19,14 14,4 24,11"
          fill={color}
          stroke="#5d4037"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Left ear inner */}
        <polygon points="19,13 16,7 23,12" fill="#ffab91" />

        {/* Right ear */}
        <polygon
          points="41,14 46,4 36,11"
          fill={color}
          stroke="#5d4037"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Right ear inner */}
        <polygon points="41,13 44,7 37,12" fill="#ffab91" />

        {/* Eyes */}
        <ellipse cx="24" cy="24" rx="3" ry="3.5" fill={eyeColor} />
        <ellipse cx="36" cy="24" rx="3" ry="3.5" fill={eyeColor} />
        {/* Eye highlights */}
        <circle cx="25.5" cy="22.5" r="1" fill="white" />
        <circle cx="37.5" cy="22.5" r="1" fill="white" />

        {/* Nose */}
        <ellipse cx="30" cy="28" rx="1.5" ry="1" fill="#ffab91" />

        {/* Mouth */}
        <path
          d="M 28 29.5 Q 30 31, 32 29.5"
          fill="none"
          stroke="#5d4037"
          strokeWidth="0.8"
          strokeLinecap="round"
        />

        {/* Whiskers */}
        <line x1="18" y1="26" x2="10" y2="24" stroke="#bdbdbd" strokeWidth="0.5" />
        <line x1="18" y1="28" x2="10" y2="29" stroke="#bdbdbd" strokeWidth="0.5" />
        <line x1="42" y1="26" x2="50" y2="24" stroke="#bdbdbd" strokeWidth="0.5" />
        <line x1="42" y1="28" x2="50" y2="29" stroke="#bdbdbd" strokeWidth="0.5" />

        {/* Front paws */}
        <ellipse cx="22" cy="52" rx="5" ry="3" fill={color} stroke="#5d4037" strokeWidth="1" />
        <ellipse cx="38" cy="52" rx="5" ry="3" fill={color} stroke="#5d4037" strokeWidth="1" />

        {/* Accessories */}
        {accessory === 'chef-hat' && (
          <g>
            <ellipse cx="30" cy="11" rx="10" ry="3" fill="white" stroke="#bdbdbd" strokeWidth="0.5" />
            <rect x="23" y="3" width="14" height="9" rx="5" fill="white" stroke="#bdbdbd" strokeWidth="0.5" />
          </g>
        )}

        {accessory === 'wizard-hat' && (
          <g>
            <polygon points="30,0 20,14 40,14" fill="#3f51b5" stroke="#283593" strokeWidth="0.8" />
            <ellipse cx="30" cy="14" rx="12" ry="3" fill="#3f51b5" stroke="#283593" strokeWidth="0.8" />
            <circle cx="30" cy="3" r="2" fill="#ffd54f" />
          </g>
        )}

        {accessory === 'safari-hat' && (
          <g>
            <ellipse cx="30" cy="13" rx="14" ry="3" fill="#8d6e63" stroke="#5d4037" strokeWidth="0.8" />
            <ellipse cx="30" cy="10" rx="9" ry="5" fill="#a1887f" stroke="#5d4037" strokeWidth="0.8" />
          </g>
        )}

        {accessory === 'bow' && (
          <g>
            <circle cx="20" cy="13" r="3" fill="#ec4899" />
            <circle cx="14" cy="13" r="3" fill="#ec4899" />
            <circle cx="17" cy="13" r="1.5" fill="#be185d" />
          </g>
        )}

        {accessory === 'glasses' && (
          <g>
            <circle cx="24" cy="24" r="5" fill="none" stroke="#5d4037" strokeWidth="1" />
            <circle cx="36" cy="24" r="5" fill="none" stroke="#5d4037" strokeWidth="1" />
            <line x1="29" y1="24" x2="31" y2="24" stroke="#5d4037" strokeWidth="1" />
          </g>
        )}
      </g>
    </svg>
  );
};
