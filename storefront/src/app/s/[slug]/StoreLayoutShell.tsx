'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { StoreLayoutClient } from './StoreLayoutClient';
import { StorefrontSkeleton } from '@/components/StorefrontSkeleton';
import { fetchStore } from '@/lib/store-api';
import { getSubdomain } from '@/lib/subdomain';

interface StoreLayoutShellProps {
  children: React.ReactNode;
  initialStore?: unknown;
  initialBasePath?: string;
}

export function StoreLayoutShell({ children, initialStore, initialBasePath }: StoreLayoutShellProps) {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  if (!slug) notFound();

  const { data: store, isLoading, isError } = useQuery({
    queryKey: ['storefront', slug],
    queryFn: () => fetchStore(slug),
    initialData: initialStore as Awaited<ReturnType<typeof fetchStore>> | undefined,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (isError || (!isLoading && !store)) notFound();
  if (isLoading && !store) return <StorefrontSkeleton />;
  if (!store) return null;

  const host = typeof window !== 'undefined' ? window.location.host : '';
  const subdomain = getSubdomain(host);
  const basePath =
    initialBasePath ?? (subdomain === slug ? '' : `/s/${slug}`);

  return (
    <StoreLayoutClient store={store} subdomain={slug} basePath={basePath}>
      {children}
    </StoreLayoutClient>
  );
}
