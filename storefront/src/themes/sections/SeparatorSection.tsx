'use client';

import { useTheme } from '../ThemeContext';

export function SeparatorSection() {
  const { theme } = useTheme();
  const section = theme.separatorSection;
  if (!section?.style) return null;

  const thickness = section.thickness ?? (section.style === 'line' ? 2 : 24);
  const color = section.color ?? theme.colors.secondary;
  const opacity = 0.4;

  if (section.style === 'space') {
    return <div style={{ height: Math.max(0, thickness), minHeight: 8 }} />;
  }

  const isBorderStyle = section.style === 'dotted' || section.style === 'dashed';

  return (
    <section style={{ padding: '24px 0' }} aria-hidden>
      <hr
        style={{
          border: 'none',
          borderTop: isBorderStyle
            ? `${thickness}px ${section.style} ${color}`
            : undefined,
          height: isBorderStyle ? 0 : thickness,
          backgroundColor: isBorderStyle ? 'transparent' : color,
          opacity: isBorderStyle ? 1 : opacity,
          maxWidth: 200,
          margin: '0 auto',
        }}
      />
    </section>
  );
}
