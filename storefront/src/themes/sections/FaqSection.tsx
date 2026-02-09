'use client';

import { Container, Title, Accordion } from '@mantine/core';
import { useTheme } from '../ThemeContext';

export function FaqSection() {
  const { theme } = useTheme();
  const section = theme.faqSection;
  if (!section?.items?.length) return null;

  return (
    <section
      style={{
        padding: '56px 0',
        backgroundColor: theme.colors.bg,
      }}
    >
      <Container size="md">
        {section.title && (
          <Title order={2} mb="xl" ta="center" style={{ color: theme.colors.text }}>
            {section.title}
          </Title>
        )}
        <Accordion
          variant="separated"
          radius="md"
          styles={{
            control: { color: theme.colors.text },
            content: { color: theme.colors.text, opacity: 0.9 },
          }}
        >
          {section.items.map((item, i) => (
            <Accordion.Item key={i} value={`faq-${i}`}>
              <Accordion.Control>{item.question}</Accordion.Control>
              <Accordion.Panel>{item.answer}</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
