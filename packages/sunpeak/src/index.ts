import './simulator/globals.css';

// === MCP Apps SDK re-exports ===
// Re-export commonly used SDK exports for convenience
export {
  App,
  PostMessageTransport,
  RESOURCE_MIME_TYPE,
  RESOURCE_URI_META_KEY,
  applyHostStyleVariables,
  applyHostFonts,
  applyDocumentTheme,
  getDocumentTheme,
} from '@modelcontextprotocol/ext-apps';

// === Sunpeak core (cross-platform) ===
export * from './hooks';
export * from './types';
export * from './lib';

// === Platform detection (top-level for easy access) ===
export { isChatGPT, isClaude, detectPlatform } from './platform';
export type { Platform } from './platform';

// === Generic simulator (multi-host) ===
// Import as: import { simulator } from 'sunpeak';
// Usage: <simulator.Simulator ... />
export * as simulator from './simulator';

// === ChatGPT-specific exports (namespaced, backwards compatible) ===
// Import as: import { chatgpt } from 'sunpeak';
// Usage: <chatgpt.ChatGPTSimulator ... />
export * as chatgpt from './chatgpt';
