import { useCallback } from 'react';
import type { App } from '@modelcontextprotocol/ext-apps';
import { useApp } from './use-app';

/**
 * Parameters for reading a server resource.
 */
export interface ReadServerResourceParams {
  /** URI of the resource to read (e.g. `file:///path` or custom scheme). */
  uri: string;
}

/**
 * Result from reading a server resource.
 */
export interface ReadServerResourceResult {
  /** Resource contents returned by the server. */
  contents: Array<{ uri: string; mimeType?: string; text?: string; blob?: string }>;
}

/**
 * Hook to read resources from the originating MCP server.
 *
 * Resources are proxied through the host. Use {@link useListServerResources}
 * to discover available resources first.
 *
 * @example
 * ```tsx
 * function VideoPlayer() {
 *   const readServerResource = useReadServerResource();
 *   const [src, setSrc] = useState<string>();
 *
 *   const loadVideo = async (uri: string) => {
 *     const result = await readServerResource({ uri });
 *     const content = result?.contents[0];
 *     if (content && 'blob' in content && content.blob) {
 *       const binary = atob(content.blob);
 *       const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
 *       const blob = new Blob([bytes], { type: content.mimeType });
 *       setSrc(URL.createObjectURL(blob));
 *     }
 *   };
 *
 *   return src ? <video src={src} controls /> : <button onClick={() => loadVideo('videos://intro')}>Load</button>;
 * }
 * ```
 */
export function useReadServerResource(): (
  params: ReadServerResourceParams
) => Promise<ReadServerResourceResult | undefined> {
  const app = useApp();
  return useCallback(
    async (params: ReadServerResourceParams) => {
      if (!app) {
        console.warn('[useReadServerResource] App not connected');
        return undefined;
      }
      return app.readServerResource(params as Parameters<App['readServerResource']>[0]);
    },
    [app]
  );
}
