import React from 'react';

interface IconProps {
  size?: number;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const IconOverview = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

export const IconCalendar = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <rect x="3" y="5" width="18" height="16" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const IconMail = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <rect x="3" y="5" width="18" height="14" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const IconTasks = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <path d="m3 7 2 2 3-3M3 17l2 2 3-3M12 8h9M12 18h9" />
  </svg>
);

export const IconPulse = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M2 12h4l3-8 4 16 3-8h6" />
  </svg>
);

export const IconReactor = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21" />
  </svg>
);

export const IconPrinter = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M6 9V3h12v6" />
    <rect x="3" y="9" width="18" height="7" />
    <path d="M6 16h12v5H6z" />
  </svg>
);

export const IconGear = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.2 2.2M16.9 16.9l2.2 2.2M19.1 4.9l-2.2 2.2M7.1 16.9l-2.2 2.2" />
  </svg>
);

export const IconRefresh = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M21 12a9 9 0 1 1-3-6.7" />
    <path d="M21 4v5h-5" />
  </svg>
);

export const IconGauge = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M4 18a8 8 0 1 1 16 0" />
    <path d="m12 14 4-4" />
  </svg>
);

export const IconPin = ({ size = 17 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M12 17v5M9 3h6l-1 6 3 3v2H7v-2l3-3z" />
  </svg>
);

export const IconMinimise = ({ size = 13 }: IconProps) => (
  <svg {...base(size)}>
    <path d="M5 12h14" />
  </svg>
);

export const IconMaximise = ({ size = 13 }: IconProps) => (
  <svg {...base(size)}>
    <rect x="5" y="5" width="14" height="14" />
  </svg>
);

export const IconClose = ({ size = 13 }: IconProps) => (
  <svg {...base(size)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);
