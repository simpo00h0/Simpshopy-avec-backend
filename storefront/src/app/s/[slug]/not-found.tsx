import Link from 'next/link';

export default function StoreNotFound() {
  return (
    <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Boutique introuvable</h1>
      <p>Cette boutique n&apos;existe pas ou n&apos;est pas encore disponible.</p>
      <Link href="/">Retour à l&apos;accueil</Link>
    </div>
  );
}
