import { applyDocumentTheme } from '@openai/apps-sdk-ui/theme';
import type { McpUiHostCapabilities } from '@modelcontextprotocol/ext-apps';
import { registerHostShell } from '../simulator/hosts';
import { Conversation } from './chatgpt-conversation';

const CHATGPT_HOST_INFO = {
  name: 'ChatGPT',
  version: '1.0.0',
};

const CHATGPT_HOST_CAPABILITIES: McpUiHostCapabilities = {
  openLinks: {},
  serverTools: {},
  logging: {},
  updateModelContext: { text: {} },
  message: { text: {} },
};

registerHostShell({
  id: 'chatgpt',
  label: 'ChatGPT',
  Conversation,
  applyTheme: applyDocumentTheme,
  hostInfo: CHATGPT_HOST_INFO,
  hostCapabilities: CHATGPT_HOST_CAPABILITIES,
});
