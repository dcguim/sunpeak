import { useCallback } from 'react';
import type { App } from '@modelcontextprotocol/ext-apps';
import { useApp } from './use-app';

/**
 * Parameters for listing server resources.
 */
export interface ListServerResourcesParams {
  /** Pagination cursor from a previous response. */
  cursor?: string;
}

/**
 * A resource available on the MCP server.
 */
export interface ServerResource {
  /** Resource URI. */
  uri: string;
  /** Human-readable name. */
  name: string;
  /** Optional description. */
  description?: string;
  /** MIME type hint. */
  mimeType?: string;
}

/**
 * Result from listing server resources.
 */
export interface ListServerResourcesResult {
  /** Available resources. */
  resources: ServerResource[];
  /** Cursor for fetching the next page, if more results exist. */
  nextCursor?: string;
}

/**
 * Hook to discover available resources on the originating MCP server.
 *
 * Resources are proxied through the host. Supports pagination via cursor.
 * Use {@link useReadServerResource} to read a discovered resource.
 *
 * @example
 * ```tsx
 * function ResourcePicker() {
 *   const listServerResources = useListServerResources();
 *   const [resources, setResources] = useState<ServerResource[]>([]);
 *
 *   useEffect(() => {
 *     listServerResources().then(result => {
 *       if (result) setResources(result.resources);
 *     });
 *   }, [listServerResources]);
 *
 *   return (
 *     <ul>
 *       {resources.map(r => <li key={r.uri}>{r.name}</li>)}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useListServerResources(): (
  params?: ListServerResourcesParams
) => Promise<ListServerResourcesResult | undefined> {
  const app = useApp();
  return useCallback(
    async (params?: ListServerResourcesParams) => {
      if (!app) {
        console.warn('[useListServerResources] App not connected');
        return undefined;
      }
      return app.listServerResources(params as Parameters<App['listServerResources']>[0]);
    },
    [app]
  );
}
