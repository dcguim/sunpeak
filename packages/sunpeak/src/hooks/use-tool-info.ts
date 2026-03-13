import { useHostContext } from './use-host-context';
import type { McpUiHostContext } from '@modelcontextprotocol/ext-apps';

export type ToolInfo = NonNullable<McpUiHostContext['toolInfo']>;

export function useToolInfo(): ToolInfo | undefined {
  const context = useHostContext();
  return context?.toolInfo;
}
