import { useHostContext } from './use-host-context';
import type { McpUiHostContext } from '@modelcontextprotocol/ext-apps';

export type HostPlatform = NonNullable<McpUiHostContext['platform']>;

export function usePlatform(): HostPlatform | undefined {
  const context = useHostContext();
  return context?.platform;
}
