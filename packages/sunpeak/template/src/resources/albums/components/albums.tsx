import * as React from 'react';
import {
  useAppState,
  useDeviceCapabilities,
  useDisplayMode,
  useRequestDisplayMode,
  useToolData,
  useUpdateModelContext,
} from 'sunpeak';
import { AlbumCarousel } from './album-carousel';
import { AlbumCard } from './album-card';
import { FullscreenViewer } from './fullscreen-viewer';

export interface Album {
  id: string;
  title: string;
  cover: string;
  photos: Array<{
    id: string;
    title: string;
    url: string;
  }>;
}

export interface AlbumsData {
  albums: Album[];
}

interface AlbumsInput {
  category?: string;
  search?: string;
  limit?: number;
}

interface AlbumsState {
  selectedAlbumId: string | null;
}

export type AlbumsProps = {
  className?: string;
};

export function Albums({ className }: AlbumsProps) {
  const { output, inputPartial, isLoading, isError, isCancelled, cancelReason } = useToolData<
    AlbumsInput,
    AlbumsData
  >();
  const [state, setState] = useAppState<AlbumsState>({
    selectedAlbumId: null,
  });
  const displayMode = useDisplayMode();
  const { touch: hasTouch = false } = useDeviceCapabilities();
  const { requestDisplayMode, availableModes } = useRequestDisplayMode();
  const updateModelContext = useUpdateModelContext();

  const albums = output?.albums ?? [];
  const selectedAlbum = albums.find((album: Album) => album.id === state.selectedAlbumId);
  const canFullscreen = availableModes?.includes('fullscreen') ?? false;

  const handleSelectAlbum = React.useCallback(
    (album: Album) => {
      setState((prev) => ({ ...prev, selectedAlbumId: album.id }));
      if (canFullscreen) {
        requestDisplayMode('fullscreen');
      }
      updateModelContext({
        structuredContent: { selectedAlbum: { id: album.id, title: album.title } },
      });
    },
    [setState, requestDisplayMode, updateModelContext, canFullscreen]
  );

  if (isLoading) {
    const searchContext = inputPartial?.category || inputPartial?.search;
    return (
      <div className="flex items-center justify-center gap-2 p-8 text-[var(--color-text-secondary)]">
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <span>{searchContext ? `Loading ${searchContext} albums…` : 'Loading albums…'}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-8 text-[var(--color-text-secondary)]">
        Failed to load albums
      </div>
    );
  }

  if (isCancelled) {
    return (
      <div className="flex items-center justify-center p-8 text-[var(--color-text-secondary)]">
        {cancelReason ?? 'Request was cancelled'}
      </div>
    );
  }

  if (displayMode === 'fullscreen' && selectedAlbum) {
    return <FullscreenViewer album={selectedAlbum} />;
  }

  if (albums.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-[var(--color-text-secondary)]">
        No albums found
      </div>
    );
  }

  return (
    <div className={className}>
      <AlbumCarousel
        gap={20}
        showArrows={false}
        showEdgeGradients={false}
        cardWidth={272}
        displayMode={displayMode}
      >
        {albums.map((album: Album) => (
          <AlbumCard
            key={album.id}
            album={album}
            onSelect={handleSelectAlbum}
            buttonSize={hasTouch ? 'lg' : 'md'}
          />
        ))}
      </AlbumCarousel>
    </div>
  );
}
