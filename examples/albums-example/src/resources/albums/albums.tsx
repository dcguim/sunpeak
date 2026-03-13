import { SafeArea, useDisplayMode } from 'sunpeak';
import type { ResourceConfig } from 'sunpeak';
import { Albums } from './components/albums';

export const resource: ResourceConfig = {
  title: 'Albums',
  description: 'Show photo albums widget',
  mimeType: 'text/html;profile=mcp-app',
  _meta: {
    ui: {
      csp: {
        resourceDomains: ['https://cdn.sunpeak.ai'],
      },
    },
  },
};

/**
 * Production-ready Albums Resource
 *
 * This resource displays photo albums in a carousel layout with fullscreen viewing capability.
 * Can be dropped into any production environment without changes.
 */
export function AlbumsResource() {
  const displayMode = useDisplayMode();
  const isFullscreen = displayMode === 'fullscreen';

  return (
    <SafeArea className={isFullscreen ? '' : 'p-4'}>
      <Albums />
    </SafeArea>
  );
}
