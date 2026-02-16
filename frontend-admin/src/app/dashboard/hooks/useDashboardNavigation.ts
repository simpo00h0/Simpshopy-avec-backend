'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export function useDashboardNavigation() {
  const pathname = usePathname();
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const [showNavLoader, setShowNavLoader] = useState(false);
  const navigatingToRef = useRef<string | null>(null);

  useEffect(() => {
    if (navigatingTo && (pathname === navigatingTo || pathname.startsWith(navigatingTo + '/'))) {
      navigatingToRef.current = null;
      setNavigatingTo(null);
      setShowNavLoader(false);
    }
  }, [navigatingTo, pathname]);

  useEffect(() => {
    if (!navigatingTo) return;
    navigatingToRef.current = navigatingTo;
    setShowNavLoader(false);
    const t = setTimeout(() => {
      if (navigatingToRef.current) setShowNavLoader(true);
    }, 150);
    return () => clearTimeout(t);
  }, [navigatingTo]);

  return { navigatingTo, setNavigatingTo, showNavLoader };
}
