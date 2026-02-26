/**
 * Mock OpenAI runtime for the simulator.
 *
 * ChatGPT-specific hooks (useUploadFile, useRequestModal, etc.) call
 * `window.openai` directly — they don't use the MCP protocol. When the
 * ChatGPT host is selected in the simulator, we inject this mock into
 * the iframe's window so those hooks work during local development.
 */

/**
 * Inline script that sets up a mock `window.openai` for srcdoc iframes.
 * Embedded in the generated HTML *before* the app's script so that
 * `isChatGPT()` and hooks work from the very first render.
 */
export const MOCK_OPENAI_RUNTIME_SCRIPT = [
  'window.openai={',
  'uploadFile:function(f){console.log("[Simulator] uploadFile:",f.name);',
  'return Promise.resolve({fileId:"sim_file_"+Date.now()})},',
  'getFileDownloadUrl:function(p){console.log("[Simulator] getFileDownloadUrl:",p.fileId);',
  'return Promise.resolve({downloadUrl:"https://simulator.local/files/"+p.fileId})},',
  'requestModal:function(p){console.log("[Simulator] requestModal:",JSON.stringify(p));',
  'return Promise.resolve()},',
  'requestCheckout:function(s){console.log("[Simulator] requestCheckout:",JSON.stringify(s));',
  'return Promise.resolve({id:"sim_order_"+Date.now(),checkout_session_id:s.id||"sim_session",status:"completed"})},',
  'requestClose:function(){console.log("[Simulator] requestClose")},',
  'requestDisplayMode:function(p){console.log("[Simulator] requestDisplayMode:",p.mode);',
  'return Promise.resolve()},',
  'sendFollowUpMessage:function(p){console.log("[Simulator] sendFollowUpMessage:",p.prompt)},',
  'openExternal:function(p){console.log("[Simulator] openExternal:",p.href);window.open(p.href,"_blank")}',
  '};',
].join('');

/**
 * Create a mock OpenAI runtime object for direct injection into an
 * iframe's `contentWindow`. Used for src-mode iframes (dev with Vite)
 * where we can't embed inline scripts in the page.
 */
export function createMockOpenAIRuntime(): Record<string, (...args: never[]) => unknown> {
  return {
    uploadFile: async (file: File) => {
      console.log('[Simulator] uploadFile:', file.name);
      return { fileId: `sim_file_${Date.now()}` };
    },
    getFileDownloadUrl: async (params: { fileId: string }) => {
      console.log('[Simulator] getFileDownloadUrl:', params.fileId);
      return { downloadUrl: `https://simulator.local/files/${params.fileId}` };
    },
    requestModal: async (params: unknown) => {
      console.log('[Simulator] requestModal:', params);
    },
    requestCheckout: async (session: { id?: string }) => {
      console.log('[Simulator] requestCheckout:', session);
      return {
        id: `sim_order_${Date.now()}`,
        checkout_session_id: session.id || 'sim_session',
        status: 'completed',
      };
    },
    requestClose: () => {
      console.log('[Simulator] requestClose');
    },
    requestDisplayMode: async (params: { mode: string }) => {
      console.log('[Simulator] requestDisplayMode:', params.mode);
    },
    sendFollowUpMessage: (params: { prompt: string }) => {
      console.log('[Simulator] sendFollowUpMessage:', params.prompt);
    },
    openExternal: (params: { href: string }) => {
      console.log('[Simulator] openExternal:', params.href);
      window.open(params.href, '_blank');
    },
  };
}
