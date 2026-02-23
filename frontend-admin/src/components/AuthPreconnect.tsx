'use client';

import { useEffect } from 'react';

/**
 * Préconnecte aux domaines Supabase et API pour réduire la latence
 * lors de la soumission du formulaire de connexion/inscription.
 */
export function AuthPreconnect() {
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
    const links: HTMLLinkElement[] = [];

    if (supabaseUrl) {
      try {
        const origin = new URL(supabaseUrl).origin;
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = origin;
        document.head.appendChild(link);
        links.push(link);
      } catch {
        // ignore
      }
    }

    try {
      const apiOrigin = new URL(apiUrl).origin;
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = apiOrigin;
      document.head.appendChild(link);
      links.push(link);
    } catch {
      // ignore
    }

    return () => links.forEach((l) => l.remove());
  }, []);
  return null;
}
