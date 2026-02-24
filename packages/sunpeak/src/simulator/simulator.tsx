import * as React from 'react';
import type { McpUiDisplayMode, McpUiTheme } from '@modelcontextprotocol/ext-apps';
import { useSimulatorState } from './use-simulator-state';
import { IframeResource } from './iframe-resource';
import { ThemeProvider } from './theme-provider';
import {
  SimpleSidebar,
  SidebarControl,
  SidebarCollapsibleControl,
  SidebarSelect,
  SidebarInput,
  SidebarCheckbox,
  SidebarTextarea,
  SidebarToggle,
} from './simple-sidebar';
import { getHostShell, getRegisteredHosts, type HostId } from './hosts';
import type { Simulation } from '../types/simulation';
import type { ScreenWidth } from './simulator-types';

export interface SimulatorProps {
  children?: React.ReactNode;
  simulations?: Record<string, Simulation>;
  appName?: string;
  appIcon?: string;
  /** Which host shell to use initially. Defaults to 'chatgpt'. */
  defaultHost?: HostId;
}

type Platform = 'mobile' | 'desktop' | 'web';

export function Simulator({
  children,
  simulations = {},
  appName = 'Sunpeak',
  appIcon,
  defaultHost = 'chatgpt',
}: SimulatorProps) {
  const state = useSimulatorState({ simulations, defaultHost });

  // Resolve the active host shell
  const activeShell = getHostShell(state.activeHost);
  const registeredHosts = getRegisteredHosts();
  const ShellConversation = activeShell?.Conversation;

  // Build content
  let content: React.ReactNode;
  if (state.resourceUrl) {
    content = (
      <IframeResource
        src={state.resourceUrl}
        hostContext={state.hostContext}
        toolInput={state.toolInput}
        toolResult={state.effectiveToolResult}
        hostOptions={{
          hostInfo: activeShell?.hostInfo,
          hostCapabilities: activeShell?.hostCapabilities,
          onDisplayModeChange: state.handleDisplayModeChange,
          onUpdateModelContext: state.handleUpdateModelContext,
        }}
        onDisplayModeReady={state.handleDisplayModeReady}
        debugInjectState={state.modelContext}
        className="h-full w-full"
      />
    );
  } else if (state.resourceScript) {
    content = (
      <IframeResource
        scriptSrc={state.resourceScript}
        hostContext={state.hostContext}
        toolInput={state.toolInput}
        toolResult={state.effectiveToolResult}
        csp={state.csp}
        hostOptions={{
          hostInfo: activeShell?.hostInfo,
          hostCapabilities: activeShell?.hostCapabilities,
          onDisplayModeChange: state.handleDisplayModeChange,
          onUpdateModelContext: state.handleUpdateModelContext,
        }}
        onDisplayModeReady={state.handleDisplayModeReady}
        debugInjectState={state.modelContext}
        className="h-full w-full"
      />
    );
  } else {
    content = children;
  }

  // Use the active host's theme applier
  const applyTheme = activeShell?.applyTheme;

  return (
    <ThemeProvider theme={state.theme} applyTheme={applyTheme}>
      <SimpleSidebar
        controls={
          <div className="space-y-2">
            {/* ── Host selector ── */}
            {registeredHosts.length > 1 && (
              <SidebarControl label="Host">
                <SidebarSelect
                  value={state.activeHost}
                  onChange={(value) => state.setActiveHost(value as HostId)}
                  options={registeredHosts.map((h) => ({
                    value: h.id,
                    label: h.label,
                  }))}
                />
              </SidebarControl>
            )}

            {/* ── Simulation selector ── */}
            {state.simulationNames.length > 1 && (
              <SidebarControl label="Simulation">
                <SidebarSelect
                  value={state.selectedSimulationName}
                  onChange={(value) => state.setSelectedSimulationName(value)}
                  options={state.simulationNames.map((name) => {
                    const sim = simulations[name];
                    const resourceTitle =
                      (sim.resource.title as string | undefined) || sim.resource.name;
                    const toolTitle = (sim.tool.title as string | undefined) || sim.tool.name;
                    return {
                      value: name,
                      label: `${resourceTitle}: ${toolTitle}`,
                    };
                  })}
                />
              </SidebarControl>
            )}

            <SidebarControl label="Simulation Width">
              <SidebarSelect
                value={state.screenWidth}
                onChange={(value) => state.setScreenWidth(value as ScreenWidth)}
                options={[
                  { value: 'mobile-s', label: 'Mobile S (375px)' },
                  { value: 'mobile-l', label: 'Mobile L (425px)' },
                  { value: 'tablet', label: 'Tablet (768px)' },
                  { value: 'full', label: '100% (Full)' },
                ]}
              />
            </SidebarControl>

            <SidebarCollapsibleControl label="Host Context" defaultCollapsed={false}>
              <div className="space-y-2">
                <SidebarControl label="Theme">
                  <SidebarToggle
                    value={state.theme}
                    onChange={(value) => state.setTheme(value as McpUiTheme)}
                    options={[
                      { value: 'light', label: 'Light' },
                      { value: 'dark', label: 'Dark' },
                    ]}
                  />
                </SidebarControl>

                <SidebarControl label="Display Mode">
                  <SidebarToggle
                    value={state.displayMode}
                    onChange={(value) => state.setDisplayMode(value as McpUiDisplayMode)}
                    options={[
                      { value: 'inline', label: 'Inline' },
                      { value: 'pip', label: 'PiP' },
                      { value: 'fullscreen', label: 'Full' },
                    ]}
                  />
                </SidebarControl>

                <div className="grid grid-cols-2 gap-2">
                  <SidebarControl label="Locale">
                    <SidebarInput
                      value={state.locale}
                      onChange={(value) => state.setLocale(value)}
                      placeholder="e.g. en-US"
                    />
                  </SidebarControl>

                  <SidebarControl label="Max Height (PiP)">
                    <SidebarInput
                      type="number"
                      value={
                        state.displayMode === 'pip' && state.containerMaxHeight !== undefined
                          ? String(state.containerMaxHeight)
                          : ''
                      }
                      onChange={(value) => {
                        if (state.displayMode === 'pip') {
                          state.setContainerMaxHeight(value ? Number(value) : 480);
                        }
                      }}
                      placeholder={state.displayMode === 'pip' ? '480' : '-'}
                      disabled={state.displayMode !== 'pip'}
                    />
                  </SidebarControl>
                </div>

                <SidebarControl label="Platform">
                  <SidebarSelect
                    value={state.platform}
                    onChange={(value) => {
                      const p = value as Platform;
                      state.setPlatform(p);
                      if (p === 'mobile') {
                        state.setHover(false);
                        state.setTouch(true);
                      } else if (p === 'desktop') {
                        state.setHover(true);
                        state.setTouch(false);
                      } else {
                        state.setHover(true);
                        state.setTouch(false);
                      }
                    }}
                    options={[
                      { value: 'mobile', label: 'Mobile' },
                      { value: 'desktop', label: 'Desktop' },
                      { value: 'web', label: 'Web' },
                    ]}
                  />
                </SidebarControl>

                <div className="pl-4">
                  <SidebarControl label="Device Capabilities">
                    <div className="flex gap-2">
                      <SidebarCheckbox
                        checked={state.hover}
                        onChange={state.setHover}
                        label="Hover"
                      />
                      <SidebarCheckbox
                        checked={state.touch}
                        onChange={state.setTouch}
                        label="Touch"
                      />
                    </div>
                  </SidebarControl>
                </div>

                <SidebarControl label="Safe Area Insets">
                  <div className="grid grid-cols-4 gap-1">
                    <div className="flex items-center gap-0.5">
                      <span className="text-[10px] text-secondary">&uarr;</span>
                      <SidebarInput
                        type="number"
                        value={String(state.safeAreaInsets.top)}
                        onChange={(value) =>
                          state.setSafeAreaInsets((prev) => ({ ...prev, top: Number(value) }))
                        }
                      />
                    </div>
                    <div className="flex items-center gap-0.5">
                      <span className="text-[10px] text-secondary">&darr;</span>
                      <SidebarInput
                        type="number"
                        value={String(state.safeAreaInsets.bottom)}
                        onChange={(value) =>
                          state.setSafeAreaInsets((prev) => ({ ...prev, bottom: Number(value) }))
                        }
                      />
                    </div>
                    <div className="flex items-center gap-0.5">
                      <span className="text-[10px] text-secondary">&larr;</span>
                      <SidebarInput
                        type="number"
                        value={String(state.safeAreaInsets.left)}
                        onChange={(value) =>
                          state.setSafeAreaInsets((prev) => ({ ...prev, left: Number(value) }))
                        }
                      />
                    </div>
                    <div className="flex items-center gap-0.5">
                      <span className="text-[10px] text-secondary">&rarr;</span>
                      <SidebarInput
                        type="number"
                        value={String(state.safeAreaInsets.right)}
                        onChange={(value) =>
                          state.setSafeAreaInsets((prev) => ({ ...prev, right: Number(value) }))
                        }
                      />
                    </div>
                  </div>
                </SidebarControl>
              </div>
            </SidebarCollapsibleControl>

            <SidebarCollapsibleControl label="App Context" defaultCollapsed>
              <SidebarTextarea
                value={state.modelContextJson}
                onChange={(json) =>
                  state.validateJSON(json, state.setModelContextJson, state.setModelContextError)
                }
                onFocus={() => state.setEditingField('modelContext')}
                onBlur={() =>
                  state.commitJSON(state.modelContextJson, state.setModelContextError, (parsed) => {
                    state.setModelContext(parsed as Record<string, unknown> | null);
                  })
                }
                error={state.modelContextError}
                maxRows={8}
              />
            </SidebarCollapsibleControl>

            <SidebarCollapsibleControl label="Tool Input (JSON)">
              <SidebarTextarea
                value={state.toolInputJson}
                onChange={(json) =>
                  state.validateJSON(json, state.setToolInputJson, state.setToolInputError)
                }
                onFocus={() => state.setEditingField('toolInput')}
                onBlur={() =>
                  state.commitJSON(state.toolInputJson, state.setToolInputError, (parsed) =>
                    state.setToolInput((parsed as Record<string, unknown>) ?? {})
                  )
                }
                error={state.toolInputError}
                maxRows={8}
              />
            </SidebarCollapsibleControl>

            <SidebarCollapsibleControl label="Tool Result (JSON)">
              <SidebarTextarea
                value={state.toolResultJson}
                onChange={(json) =>
                  state.validateJSON(json, state.setToolResultJson, state.setToolResultError)
                }
                onFocus={() => state.setEditingField('toolResult')}
                onBlur={() =>
                  state.commitJSON(state.toolResultJson, state.setToolResultError, (parsed) => {
                    if (parsed === null) {
                      state.setToolResult(undefined);
                    } else {
                      const result = parsed as Record<string, unknown>;
                      if ('content' in result || 'structuredContent' in result) {
                        state.setToolResult(
                          result as import('@modelcontextprotocol/sdk/types.js').CallToolResult
                        );
                      } else {
                        state.setToolResult({ content: [], structuredContent: result });
                      }
                    }
                  })
                }
                error={state.toolResultError}
                maxRows={8}
              />
            </SidebarCollapsibleControl>
          </div>
        }
      >
        {ShellConversation ? (
          <ShellConversation
            screenWidth={state.screenWidth}
            displayMode={state.displayMode}
            platform={state.platform}
            onRequestDisplayMode={state.handleDisplayModeChange}
            appName={appName}
            appIcon={appIcon}
            userMessage={state.selectedSim?.userMessage}
            isTransitioning={state.isTransitioning}
            key={`${state.activeHost}-${state.selectedSimulationName}`}
          >
            {content}
          </ShellConversation>
        ) : (
          content
        )}
      </SimpleSidebar>
    </ThemeProvider>
  );
}
