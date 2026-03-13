import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { useDisplayMode } from './use-display-mode';
import { useSafeArea } from './use-safe-area';
import { useViewport } from './use-viewport';

export interface SafeAreaProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Wrapper component that applies safe-area padding and viewport constraints.
 *
 * Replaces the common boilerplate of calling `useSafeArea()` + `useViewport()`
 * and manually applying padding/maxHeight/maxWidth styles on a container div.
 *
 * In fullscreen mode, SafeArea fills the iframe viewport (`100dvh`) so that
 * flex column layouts (e.g. sticky header / scrollable content / sticky footer)
 * work correctly without each resource having to handle display mode sizing.
 *
 * @example
 * ```tsx
 * import { SafeArea } from 'sunpeak';
 *
 * export function MyResource() {
 *   return (
 *     <SafeArea className="h-full">
 *       <MyContent />
 *     </SafeArea>
 *   );
 * }
 * ```
 */
export const SafeArea = forwardRef<HTMLDivElement, SafeAreaProps>(function SafeArea(
  { children, style, ...props },
  ref
) {
  const safeArea = useSafeArea();
  const viewport = useViewport();
  const displayMode = useDisplayMode();

  // In fullscreen, fill the iframe viewport so flex layouts work.
  // In inline/pip, use viewport.height if set by the host.
  const isFullscreen = displayMode === 'fullscreen';
  const height = viewport?.height ?? (isFullscreen ? '100dvh' : undefined);

  return (
    <div
      ref={ref}
      style={{
        // Only set inline padding when safe-area insets are non-zero,
        // so CSS class padding (e.g. Tailwind `p-4`) can serve as defaults.
        paddingTop: safeArea.top || undefined,
        paddingBottom: safeArea.bottom || undefined,
        paddingLeft: safeArea.left || undefined,
        paddingRight: safeArea.right || undefined,
        height,
        maxHeight: viewport?.maxHeight,
        width: viewport?.width,
        maxWidth: viewport?.maxWidth,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});
