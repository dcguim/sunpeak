import { useHostContext } from './use-host-context';
import type { McpUiHostContext } from '@modelcontextprotocol/ext-apps';

export type DeviceCapabilities = NonNullable<McpUiHostContext['deviceCapabilities']>;

export function useDeviceCapabilities(): DeviceCapabilities {
  const context = useHostContext();
  return context?.deviceCapabilities ?? {};
}
