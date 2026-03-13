import { useHostContext } from './use-host-context';

export function useUserAgent(): string | undefined {
  const context = useHostContext();
  return context?.userAgent;
}
