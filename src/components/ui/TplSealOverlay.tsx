import React from 'react';

interface SealOverlayProps {
  size?: number;
  opacity?: number;
  variant?: 'default' | 'dark-on-light';
  className?: string;
}

export function TplSealOverlay({
  size = 160,
  opacity = 0.1,
  variant = 'default',
  className = "flex items-center justify-center",
}: SealOverlayProps) {
  const isDarkOnLight = variant === 'dark-on-light';

  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    >
      <img
        src="/tpl-seal.png"
        alt="The Physical Layer"
        style={{
          width: size,
          height: size,
          opacity,
          filter: isDarkOnLight
            ? 'brightness(0) saturate(100%) opacity(0.45)'
            : 'none',
        }}
        className="select-none"
      />
    </div>
  );
}
