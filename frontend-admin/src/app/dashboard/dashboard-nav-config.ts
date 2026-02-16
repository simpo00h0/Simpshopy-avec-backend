import type { Icon } from '@tabler/icons-react';
import {
  IconHome2,
  IconPackage,
  IconShoppingCart,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconWallet,
  IconBuildingStore,
  IconDiscount2,
  IconShoppingBag,
  IconPalette,
} from '@tabler/icons-react';
import type { QueryClient } from '@tanstack/react-query';
import {
  prefetchDashboardStats,
  prefetchProducts,
  prefetchOrders,
  prefetchCustomers,
  prefetchWallet,
} from '@/lib/prefetch';

export type NavItem = {
  href: string;
  label: string;
  icon: Icon;
  onPrefetch: () => void;
};

export function getNavItems(
  prefetchRoute: (href: string) => void,
  queryClient: QueryClient
): NavItem[] {
  return [
    {
      href: '/dashboard',
      label: 'Accueil',
      icon: IconHome2,
      onPrefetch: () => {
        prefetchRoute('/dashboard');
        prefetchDashboardStats(queryClient);
      },
    },
    {
      href: '/dashboard/boutique',
      label: 'Boutique',
      icon: IconShoppingBag,
      onPrefetch: () => {
        prefetchRoute('/dashboard/boutique');
        prefetchRoute('/dashboard/boutique/editor');
      },
    },
    {
      href: '/dashboard/themes',
      label: 'Thèmes',
      icon: IconPalette,
      onPrefetch: () => prefetchRoute('/dashboard/themes'),
    },
    {
      href: '/dashboard/orders',
      label: 'Commandes',
      icon: IconShoppingCart,
      onPrefetch: () => {
        prefetchRoute('/dashboard/orders');
        prefetchOrders(queryClient);
      },
    },
    {
      href: '/dashboard/products',
      label: 'Produits',
      icon: IconPackage,
      onPrefetch: () => {
        prefetchRoute('/dashboard/products');
        prefetchProducts(queryClient);
      },
    },
    {
      href: '/dashboard/customers',
      label: 'Clients',
      icon: IconUsers,
      onPrefetch: () => {
        prefetchRoute('/dashboard/customers');
        prefetchCustomers(queryClient);
      },
    },
    {
      href: '/dashboard/discounts',
      label: 'Réductions',
      icon: IconDiscount2,
      onPrefetch: () => prefetchRoute('/dashboard/discounts'),
    },
    {
      href: '/dashboard/analytics',
      label: 'Analytiques',
      icon: IconChartBar,
      onPrefetch: () => prefetchRoute('/dashboard/analytics'),
    },
    {
      href: '/dashboard/wallet',
      label: 'Portefeuille',
      icon: IconWallet,
      onPrefetch: () => {
        prefetchRoute('/dashboard/wallet');
        prefetchWallet(queryClient);
      },
    },
  ];
}

export function getNavBottom(prefetchRoute: (href: string) => void): NavItem[] {
  return [
    {
      href: '/dashboard/settings',
      label: 'Paramètres',
      icon: IconSettings,
      onPrefetch: () => prefetchRoute('/dashboard/settings'),
    },
    {
      href: '/',
      label: 'Retour au site',
      icon: IconBuildingStore,
      onPrefetch: () => prefetchRoute('/'),
    },
  ];
}
