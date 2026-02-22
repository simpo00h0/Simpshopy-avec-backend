import Link from 'next/link';
import { Container, Title, Text, Button } from '@mantine/core';

export default function PrivacyPage() {
  return (
    <Container size="md" py={60}>
      <Title order={1} mb="lg">Politique de confidentialité</Title>
      <Text c="dimmed" mb="xl">
        Cette page sera bientôt disponible.
      </Text>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <Button variant="light">
          Retour à l&apos;accueil
        </Button>
      </Link>
    </Container>
  );
}
