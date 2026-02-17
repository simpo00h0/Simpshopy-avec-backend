/** Instance de bloc avec données propres (chaque bloc du canvas est indépendant) */
export interface BlockInstance {
  type: string;
  data: Record<string, unknown>;
}

/** Structure blocks : instanceId -> BlockInstance */
export type BlocksMap = Record<string, BlockInstance>;
