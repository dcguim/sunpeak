import { useCallback, useSyncExternalStore } from 'react';
import type { App, McpUiHostContext } from '@modelcontextprotocol/ext-apps';
import {
  applyDocumentTheme,
  applyHostStyleVariables,
  applyHostFonts,
} from '@modelcontextprotocol/ext-apps';
import { useApp } from './use-app';

/**
 * Per-app subscriber registry.
 * The App class only supports a single onhostcontextchanged callback,
 * so we multiplex it to allow multiple hook instances to subscribe.
 *
 * Also applies `data-theme` and `color-scheme` to the document element
 * so that CSS selectors like `[data-theme="dark"]` and Tailwind's `dark:`
 * variant work automatically.
 */
const registries = new WeakMap<App, Set<() => void>>();

function getRegistry(app: App): Set<() => void> {
  let subs = registries.get(app);
  if (!subs) {
    subs = new Set();
    registries.set(app, subs);

    // Apply initial theme and style variables from the host context received during initialization
    const ctx = app.getHostContext();
    if (ctx?.theme) {
      applyDocumentTheme(ctx.theme);
    }
    if (ctx?.styles?.variables) {
      applyHostStyleVariables(ctx.styles.variables);
      // Set the document background to match the host's primary background so the
      // iframe canvas doesn't default to white (browsers paint white behind transparent).
      document.documentElement.style.backgroundColor = 'var(--color-background-primary)';
    }
    if (ctx?.styles?.css?.fonts) {
      applyHostFonts(ctx.styles.css.fonts);
    }

    app.onhostcontextchanged = (params) => {
      // Apply theme and style variables to document when host changes them
      if (params.theme) {
        applyDocumentTheme(params.theme);
      }
      if (params.styles?.variables) {
        applyHostStyleVariables(params.styles.variables);
        document.documentElement.style.backgroundColor = 'var(--color-background-primary)';
      }
      if (params.styles?.css?.fonts) {
        applyHostFonts(params.styles.css.fonts);
      }
      for (const fn of subs!) fn();
    };
  }
  return subs;
}

/**
 * Reactive access to the MCP Apps host context.
 * Subscribes to host context changes and re-renders when the context updates.
 *
 * @returns The current host context, or null if not connected.
 */
export function useHostContext(): McpUiHostContext | null {
  const app = useApp();

  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!app) return () => {};
      const subs = getRegistry(app);
      subs.add(onChange);
      return () => {
        subs.delete(onChange);
      };
    },
    [app]
  );

  const getSnapshot = useCallback(() => {
    return app?.getHostContext() ?? null;
  }, [app]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
