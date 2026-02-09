'use client';

import { ComponentType } from 'react';
import { Container, Title, Text, Button, Image, Grid } from '@mantine/core';

// Types pour la configuration JSON du Page Builder
interface ComponentConfig {
  type: string;
  props?: Record<string, any>;
  children?: ComponentConfig[];
}

interface DynamicRendererProps {
  config: ComponentConfig;
}

// Composants disponibles dans le Page Builder
const componentMap: Record<string, ComponentType<any>> = {
  Container: Container,
  Title: Title,
  Text: Text,
  Button: Button,
  Image: Image,
  Grid: Grid,
};

export function DynamicRenderer({ config }: DynamicRendererProps) {
  const Component = componentMap[config.type];

  if (!Component) {
    console.warn(`Component ${config.type} not found`);
    return null;
  }

  if (config.children && config.children.length > 0) {
    return (
      <Component {...(config.props || {})}>
        {config.children.map((child, index) => (
          <DynamicRenderer key={index} config={child} />
        ))}
      </Component>
    );
  }

  return <Component {...(config.props || {})} />;
}
