import * as React from 'react';
import { Star } from '../../../components/icon';
import { cn } from '../../../lib/index';
import type { Place } from './types';

export type PlaceCardProps = {
  place: Place;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
};

export const PlaceCard = React.forwardRef<HTMLDivElement, PlaceCardProps>(
  ({ place, isSelected, onClick, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl px-3 select-none hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer',
          isSelected && 'bg-black/5 dark:bg-white/5',
          className
        )}
      >
        <div
          className={cn(
            'border-b hover:border-transparent',
            isSelected ? 'border-transparent' : 'border-[var(--color-border-tertiary)]'
          )}
        >
          <button
            className="w-full text-left py-3 transition flex gap-3 items-center"
            onClick={onClick}
          >
            <img
              src={place.thumbnail}
              alt={place.name}
              className="h-16 w-16 rounded-lg object-cover flex-none"
              loading="lazy"
            />
            <div className="min-w-0">
              <div className="font-medium truncate text-[var(--color-text-primary)]">
                {place.name}
              </div>
              <div className="text-xs text-[var(--color-text-secondary)] truncate">
                {place.description}
              </div>
              <div className="text-xs mt-1 text-[var(--color-text-secondary)] flex items-center gap-1">
                <Star className="h-3 w-3" aria-hidden="true" />
                {place.rating.toFixed(1)}
                {place.price && <span>· {place.price}</span>}
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }
);
PlaceCard.displayName = 'PlaceCard';
