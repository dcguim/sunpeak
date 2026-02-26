import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { useSafeArea } from './use-safe-area';
import { useViewport } from './use-viewport';

export interface SafeAreaProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Wrapper component that applies safe-area padding and viewport maxHeight.
 *
 * Replaces the common boilerplate of calling `useSafeArea()` + `useViewport()`
 * and manually applying padding/maxHeight styles on a container div.
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
        maxHeight: viewport?.maxHeight,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});
