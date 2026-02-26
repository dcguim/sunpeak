import { useEffect } from 'react';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { useApp } from './use-app';

export interface AppTool {
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
}

export interface AppToolsConfig {
  /** Tools this app provides to the host */
  tools: AppTool[];
  /**
   * Handler called when the host invokes one of this app's tools.
   * Return a CallToolResult with the tool's output.
   */
  onCallTool: (params: {
    name: string;
    arguments?: Record<string, unknown>;
  }) => CallToolResult | Promise<CallToolResult>;
}

/**
 * Register tools that this app provides to the host.
 *
 * This enables bidirectional tool calling: the host can call tools
 * defined by the app, in addition to the app calling server tools.
 *
 * @example
 * ```tsx
 * import { useAppTools } from 'sunpeak';
 *
 * function MyResource() {
 *   useAppTools({
 *     tools: [
 *       { name: 'get-selection', description: 'Get the current selection' },
 *     ],
 *     onCallTool: async ({ name, arguments: args }) => {
 *       if (name === 'get-selection') {
 *         return { content: [{ type: 'text', text: selectedText }] };
 *       }
 *       return { content: [], isError: true };
 *     },
 *   });
 * }
 * ```
 */
export function useAppTools(config: AppToolsConfig): void {
  const app = useApp();

  useEffect(() => {
    if (!app) return;

    // The SDK's onlisttools type expects tool names as strings.
    // Full tool metadata (description, schema) is registered server-side
    // via registerAppTool; this just advertises names to the host at runtime.
    // eslint-disable-next-line react-hooks/immutability
    app.onlisttools = () => {
      return Promise.resolve({ tools: config.tools.map((t) => t.name) });
    };

    app.oncalltool = (params) => {
      return Promise.resolve(config.onCallTool(params));
    };
  }, [app, config]);
}
