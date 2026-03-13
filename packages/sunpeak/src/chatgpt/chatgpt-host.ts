import type { McpUiHostCapabilities } from '@modelcontextprotocol/ext-apps';
import { registerHostShell } from '../simulator/hosts';
import { DEFAULT_STYLE_VARIABLES } from '../simulator/host-styles';
import { Conversation } from './chatgpt-conversation';

const CHATGPT_HOST_INFO = {
  name: 'ChatGPT',
  version: '1.0.0',
};

const CHATGPT_HOST_CAPABILITIES: McpUiHostCapabilities = {
  openLinks: {},
  serverTools: {},
  serverResources: {},
  downloadFile: {},
  logging: {},
  updateModelContext: { text: {} },
  message: { text: {} },
  sandbox: {},
};

/**
 * Apply ChatGPT-style theming to the document.
 * Sets data-theme attribute and color-scheme for light-dark() CSS support.
 */
function applyChatGPTTheme(theme: 'light' | 'dark'): void {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
}

/**
 * ChatGPT-specific style variable overrides.
 * Inherits defaults, overriding colors to match ChatGPT's palette.
 */
const CHATGPT_STYLE_VARIABLES = {
  ...DEFAULT_STYLE_VARIABLES,
  // Background colors — ChatGPT's standard palette
  '--color-background-primary': 'light-dark(#ffffff, #212121)',
  '--color-background-secondary': 'light-dark(#f7f7f8, #2f2f2f)',
  '--color-background-tertiary': 'light-dark(#ececf1, #444654)',
  '--color-background-inverse': 'light-dark(#212121, #ffffff)',
  // Text colors
  '--color-text-primary': 'light-dark(#0d0d0d, #ececec)',
  '--color-text-secondary': 'light-dark(#6e6e80, #acacbe)',
  '--color-text-tertiary': 'light-dark(#acacbe, #6e6e80)',
  '--color-text-inverse': 'light-dark(#ececec, #0d0d0d)',
  // Border colors
  '--color-border-primary': 'light-dark(#e5e5e5, #4e4e4e)',
  '--color-border-secondary': 'light-dark(#d9d9e3, #565869)',
  '--color-border-tertiary': 'light-dark(#f0f0f0, #3a3a3a)',
};

registerHostShell({
  id: 'chatgpt',
  label: 'ChatGPT',
  Conversation,
  applyTheme: applyChatGPTTheme,
  hostInfo: CHATGPT_HOST_INFO,
  hostCapabilities: CHATGPT_HOST_CAPABILITIES,
  styleVariables: CHATGPT_STYLE_VARIABLES,
  pageStyles: {
    '--sim-bg-sidebar': 'light-dark(#f9f9f9, #181818)',
    '--sim-bg-conversation': 'light-dark(#ffffff, #212121)',
    '--sim-bg-user-bubble': 'light-dark(#f4f4f4, #303030)',
    '--sim-bg-reply-input': 'light-dark(#ffffff, #303030)',
  },
});
