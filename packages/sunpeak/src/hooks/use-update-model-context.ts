import { useCallback } from 'react';
import type { McpUiUpdateModelContextRequest } from '@modelcontextprotocol/ext-apps';
import { useApp } from './use-app';

/** Parameters for updating model context — matches the MCP Apps SDK type. */
export type UpdateModelContextParams = McpUiUpdateModelContextRequest['params'];

/**
 * Send model context updates to the host.
 *
 * Unlike `useAppState` (which automatically syncs structured state),
 * this hook gives direct control over when and what is sent to the
 * model context — including text content blocks.
 *
 * Each call overwrites the previous context. The host includes the
 * last update in the model's next turn.
 *
 * @example
 * ```tsx
 * import { useUpdateModelContext } from 'sunpeak';
 *
 * function MyResource() {
 *   const updateModelContext = useUpdateModelContext();
 *
 *   const handleSelect = (item: Item) => {
 *     updateModelContext({
 *       structuredContent: { selectedItem: item },
 *     });
 *   };
 * }
 * ```
 */
export function useUpdateModelContext(): (params: UpdateModelContextParams) => Promise<void> {
  const app = useApp();

  return useCallback(
    async (params: UpdateModelContextParams) => {
      if (!app) return;
      await app.updateModelContext(params);
    },
    [app]
  );
}
