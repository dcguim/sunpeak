import { useHostContext } from './use-host-context';

const LOCAL_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function useTimeZone(): string {
  const context = useHostContext();
  return context?.timeZone ?? LOCAL_TIME_ZONE;
}
