export type CountdownSize = 'grand' | 'moyen' | 'petit';

export const SIZE_STYLES: Record<CountdownSize, { padding: string; numberSize: 'xl' | 'lg' | 'md'; labelSize: 'xs'; gap: 'lg' | 'md' | 'sm'; titleOrder: 3 | 4 | 5 }> = {
  grand: { padding: '40px 0', numberSize: 'xl', labelSize: 'xs', gap: 'lg', titleOrder: 3 },
  moyen: { padding: '28px 0', numberSize: 'lg', labelSize: 'xs', gap: 'md', titleOrder: 4 },
  petit: { padding: '20px 0', numberSize: 'md', labelSize: 'xs', gap: 'sm', titleOrder: 5 },
};

export type CountdownRemaining = { days: number; hours: number; min: number; sec: number };

export function parseRemaining(endDate: string): CountdownRemaining | null {
  const end = new Date(endDate).getTime();
  const now = Date.now();
  if (end <= now) return { days: 0, hours: 0, min: 0, sec: 0 };
  let diff = Math.floor((end - now) / 1000);
  const sec = diff % 60;
  diff = Math.floor(diff / 60);
  const min = diff % 60;
  diff = Math.floor(diff / 60);
  const hours = diff % 24;
  const days = Math.floor(diff / 24);
  return { days, hours, min, sec };
}
