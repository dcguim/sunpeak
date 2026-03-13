import { useToolData, useDeviceCapabilities, useDisplayMode, SafeArea } from 'sunpeak';
import type { ResourceConfig } from 'sunpeak';
import { Carousel, Card } from './components';

export const resource: ResourceConfig = {
  title: 'Carousel',
  description: 'Show popular places to visit widget',
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
 * Production-ready Carousel Resource
 *
 * This resource displays places in a carousel layout with cards.
 * Can be dropped into any production environment without changes.
 */

interface CarouselCard {
  id: string;
  name: string;
  rating: number;
  category: string;
  location: string;
  image: string;
  description: string;
}

interface CarouselInput {
  city?: string;
  state?: string;
  categories?: string[];
  limit?: number;
}

interface CarouselData {
  places: CarouselCard[];
}

export function CarouselResource() {
  const { output, inputPartial, isLoading, isError, isCancelled, cancelReason } = useToolData<
    CarouselInput,
    CarouselData
  >();
  const { touch: hasTouch = false } = useDeviceCapabilities();
  const displayMode = useDisplayMode();
  const places = output?.places ?? [];

  if (isLoading) {
    const searchContext = inputPartial?.city;
    return (
      <SafeArea className="flex items-center justify-center gap-2 p-8 text-[var(--color-text-secondary)]">
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <span>{searchContext ? `Finding places in ${searchContext}…` : 'Loading places…'}</span>
      </SafeArea>
    );
  }

  if (isError) {
    return (
      <SafeArea className="flex items-center justify-center p-8 text-[var(--color-text-secondary)]">
        Failed to load places
      </SafeArea>
    );
  }

  if (isCancelled) {
    return (
      <SafeArea className="flex items-center justify-center p-8 text-[var(--color-text-secondary)]">
        {cancelReason ?? 'Request was cancelled'}
      </SafeArea>
    );
  }

  if (places.length === 0) {
    return (
      <SafeArea className="flex items-center justify-center p-8 text-[var(--color-text-secondary)]">
        No places found
      </SafeArea>
    );
  }

  return (
    <SafeArea className="p-4">
      <Carousel
        gap={16}
        showArrows={true}
        showEdgeGradients={true}
        cardWidth={220}
        displayMode={displayMode}
      >
        {places.map((place: CarouselCard) => (
          <Card
            key={place.id}
            image={place.image}
            imageAlt={place.name}
            header={place.name}
            metadata={`\u2B50 ${place.rating} \u2022 ${place.category} \u2022 ${place.location}`}
            buttonSize={hasTouch ? 'md' : 'sm'}
            button1={{
              isPrimary: true,
              onClick: () => console.log(`Visit ${place.name}`),
              children: 'Visit',
            }}
            button2={{
              isPrimary: false,
              onClick: () => console.log(`Learn more about ${place.name}`),
              children: 'Learn More',
            }}
          >
            {place.description}
          </Card>
        ))}
      </Carousel>
    </SafeArea>
  );
}
