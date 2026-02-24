import type { McpUiHostCapabilities } from '@modelcontextprotocol/ext-apps';
import { registerHostShell } from '../simulator/hosts';
import { ClaudeConversation } from './claude-conversation';

const CLAUDE_HOST_INFO = {
  name: 'Claude',
  version: '1.0.0',
};

/**
 * Claude starts with the baseline MCP App capabilities.
 * Host-specific capabilities (if any) can be added here as Claude's
 * MCP App integration evolves.
 */
const CLAUDE_HOST_CAPABILITIES: McpUiHostCapabilities = {
  openLinks: {},
  serverTools: {},
  logging: {},
  updateModelContext: { text: {} },
  message: { text: {} },
};

/**
 * Apply Claude-style theming to the document.
 */
function applyClaudeTheme(theme: 'light' | 'dark'): void {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);

  if (theme === 'light') {
    root.style.setProperty('--claude-bg', '#f3f0e8');
    root.style.setProperty('--claude-input-bg', '#ffffff');
    root.style.setProperty('--claude-card-bg', '#ffffff');
    root.style.setProperty('--claude-text', '#2d2b27');
    root.style.setProperty('--claude-text-secondary', '#6b6560');
    root.style.setProperty('--claude-border', '#e0ddd5');
    root.style.setProperty('--claude-user-bubble', '#e8e4dc');
    root.style.setProperty('--claude-accent', '#c55a30');
  } else {
    root.style.setProperty('--claude-bg', '#2b2a27');
    root.style.setProperty('--claude-input-bg', '#3a3935');
    root.style.setProperty('--claude-card-bg', '#3a3935');
    root.style.setProperty('--claude-text', '#e8e4dc');
    root.style.setProperty('--claude-text-secondary', '#9b9690');
    root.style.setProperty('--claude-border', '#4a4843');
    root.style.setProperty('--claude-user-bubble', '#3a3935');
    root.style.setProperty('--claude-accent', '#d4714a');
  }
}

registerHostShell({
  id: 'claude',
  label: 'Claude',
  Conversation: ClaudeConversation,
  applyTheme: applyClaudeTheme,
  hostInfo: CLAUDE_HOST_INFO,
  hostCapabilities: CLAUDE_HOST_CAPABILITIES,
});
