import * as React from 'react';
import {
  useAppState,
  useDisplayMode,
  useRequestDisplayMode,
  useToolData,
  useViewport,
  useUpdateModelContext,
} from 'sunpeak';
import { Button } from '@/components/button';
import { ExpandLg } from '@/components/icon';
import { cn } from '@/lib/index';
import { PlaceList } from './place-list';
import { PlaceCarousel } from './place-carousel';
import { PlaceInspector } from './place-inspector';
import { MapView } from './map-view';
import type { Place, MapData } from './types';

interface MapInput {
  query?: string;
  location?: { lat: number; lng: number };
  radius?: number;
  minRating?: number;
  priceRange?: string[];
}

interface MapState {
  selectedPlaceId: string | null;
}

export type MapProps = {
  className?: string;
};

export function Map({ className }: MapProps) {
  const { output, inputPartial, isLoading, isError, isCancelled, cancelReason } = useToolData<
    MapInput,
    MapData
  >();
  const [state, setState] = useAppState<MapState>({
    selectedPlaceId: null,
  });
  const displayMode = useDisplayMode();
  const { requestDisplayMode, availableModes } = useRequestDisplayMode();
  const viewport = useViewport();
  const updateModelContext = useUpdateModelContext();

  const maxHeight = viewport?.maxHeight ?? null;
  const places = output?.places ?? [];
  const selectedPlace = places.find((place: Place) => place.id === state.selectedPlaceId);
  const isFullscreen = displayMode === 'fullscreen';
  const canFullscreen = availableModes?.includes('fullscreen') ?? false;

  const handleSelectPlace = React.useCallback(
    (place: Place) => {
      setState((prev) => ({ ...prev, selectedPlaceId: place.id }));
      updateModelContext({
        structuredContent: { selectedPlace: { id: place.id, name: place.name } },
      });
    },
    [setState, updateModelContext]
  );

  const handleCloseInspector = React.useCallback(() => {
    setState((prev) => ({ ...prev, selectedPlaceId: null }));
  }, [setState]);

  const handleRequestFullscreen = React.useCallback(() => {
    // Clear selection when entering fullscreen from embedded mode
    if (state.selectedPlaceId) {
      setState((prev) => ({ ...prev, selectedPlaceId: null }));
    }
    requestDisplayMode('fullscreen');
  }, [requestDisplayMode, state.selectedPlaceId, setState]);

  if (isLoading) {
    const searchContext = inputPartial?.query;
    return (
      <div className="flex items-center justify-center gap-2 p-8 text-[var(--color-text-secondary)]">
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <span>{searchContext ? `Searching for ${searchContext}…` : 'Loading map…'}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-8 text-[var(--color-text-secondary)]">
        Failed to load map data
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

  if (places.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-[var(--color-text-secondary)]">
        No places found
      </div>
    );
  }

  const containerHeight = isFullscreen ? (maxHeight ?? 600) - 40 : 480;

  return (
    <div
      className={cn('relative antialiased w-full overflow-hidden', className)}
      style={{
        height: containerHeight,
        minHeight: 480,
      }}
    >
      <div
        className={cn(
          'relative w-full h-full',
          isFullscreen
            ? 'rounded-none border-0'
            : 'border border-[var(--color-border-tertiary)] rounded-2xl sm:rounded-3xl'
        )}
      >
        {/* Fullscreen button - only show when fullscreen is available and not already fullscreen */}
        {!isFullscreen && canFullscreen && (
          <Button
            variant="solid"
            color="secondary"
            size="sm"
            className="absolute top-4 right-4 z-30 rounded-full shadow-lg"
            onClick={handleRequestFullscreen}
            aria-label="Enter fullscreen"
          >
            <ExpandLg className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}

        {/* Desktop sidebar - only in fullscreen */}
        {isFullscreen && (
          <PlaceList
            places={places}
            selectedId={state.selectedPlaceId}
            onSelect={handleSelectPlace}
          />
        )}

        {/* Mobile bottom carousel - only in embedded mode */}
        {!isFullscreen && (
          <PlaceCarousel
            places={places}
            selectedId={state.selectedPlaceId}
            onSelect={handleSelectPlace}
          />
        )}

        {/* Inspector (place details) - only in fullscreen */}
        {isFullscreen && selectedPlace && (
          <PlaceInspector place={selectedPlace} onClose={handleCloseInspector} />
        )}

        {/* Map */}
        <MapView
          places={places}
          selectedPlace={selectedPlace ?? null}
          isFullscreen={isFullscreen}
          onSelectPlace={handleSelectPlace}
          maxHeight={maxHeight}
        />

        {/* Suggestion chips - only in fullscreen */}
        {isFullscreen && (
          <div className="hidden md:flex absolute inset-x-0 bottom-2 z-30 justify-center pointer-events-none">
            <div className="flex gap-3 pointer-events-auto">
              {['Open now', 'Top rated', 'Vegetarian friendly'].map((label) => (
                <Button
                  key={label}
                  variant="solid"
                  color="secondary"
                  size="sm"
                  className="rounded-full shadow-md"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
