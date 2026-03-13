import { useHostContext } from './use-host-context';
import type { McpUiHostStyles } from '@modelcontextprotocol/ext-apps';

export function useStyles(): McpUiHostStyles | undefined {
  const context = useHostContext();
  return context?.styles;
}
