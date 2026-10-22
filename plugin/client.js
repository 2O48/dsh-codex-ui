window.__ModuleLoader__.load({
  id: 'dsh-codex-ui',
  factory(require) {
    const React = require('react');
    const { useEffect, useMemo, useState, useSyncExternalStore } = React;
    const h = React.createElement;
    const NS = 'dsh-codex-ui';

    const en = {
      'rail.home': 'Chats',
      'rail.plugins': 'Plugins',
      'rail.automations': 'Automations',
      'rail.tasks': 'Tasks',
      'rail.label': 'Main navigation',
      'tasks.title': 'Tasks',
      'tasks.description': 'Everything running across your conversations, and the work waiting for you.',
      'tasks.new': 'New task',
      'tasks.running': 'In progress',
      'tasks.waiting': 'Waiting for you',
      'tasks.unread': 'Finished',
      'tasks.recent': 'Recent',
      'tasks.empty': 'No tasks yet',
      'tasks.emptyHint': 'Start a conversation and the work you run there will show up here.',
      'tasks.untitled': 'Untitled',
      'tasks.noWorkspace': 'No workspace',
      'tasks.runningLabel': 'Running',
      'tasks.waitingLabel': 'Waiting',
      'tasks.unreadLabel': 'Unread',
      'tasks.idleLabel': 'Idle',
      'tasks.justNow': 'just now',
      'tasks.updated': 'Updated',
      'tasks.count': '{count}',
    };
    const zh = {
      'rail.home': '对话',
      'rail.plugins': '插件',
      'rail.automations': '自动化',
      'rail.tasks': '任务',
      'rail.label': '主导航',
      'tasks.title': '任务',
      'tasks.description': '跨会话查看正在进行的工作，以及等待你处理的事情。',
      'tasks.new': '新建任务',
      'tasks.running': '正在进行',
      'tasks.waiting': '等待你处理',
      'tasks.unread': '已完成',
      'tasks.recent': '最近',
      'tasks.empty': '暂无任务',
      'tasks.emptyHint': '开始一段对话后，这里会显示你运行过的工作。',
      'tasks.untitled': '未命名',
      'tasks.noWorkspace': '未选择项目',
      'tasks.runningLabel': '运行中',
      'tasks.waitingLabel': '待处理',
      'tasks.unreadLabel': '未读',
      'tasks.idleLabel': '空闲',
      'tasks.justNow': '刚刚',
      'tasks.updated': '更新于',
      'tasks.count': '{count}',
    };

    const CSS = String.raw`
      :root {
        --dsh-codex-rail: 52px;
        /* Keep the chrome flush with the content sheet. */
        --dsh-codex-gutter: 0px;
        /* Current wallpaper area behind the window; replaced by the Host
           sampler after a restart. Each value is heavily mixed with the theme
           surface, so the result stays low-saturation. */
        --dsh-codex-tone-0: #1a4bb0;
        --dsh-codex-tone-1: #2566ff;
        --dsh-codex-tone-2: #0e47c1;
        --dsh-codex-tone-3: #1875ae;
        --dsh-codex-tone-4: #013d74;
        --dsh-codex-tone-5: #33277d;
      }

      /* A low-saturation, barely-there sheen stands in for Mica. The six
         wallpaper samples are diluted with the theme surface so the chrome
         reads as a soft material rather than a saturated image. */
      html {
        background: var(--dsw-alias-bg-base);
      }

      body {
        isolation: isolate;
        background: transparent !important;
      }

      body::before {
        content: "";
        position: fixed;
        inset: 0;
        z-index: -1;
        background-color: var(--dsw-alias-bg-base);
        background-image:
          radial-gradient(
            110% 80% at 0% 0%,
            color-mix(in srgb, var(--dsw-alias-bg-base) 88%, var(--dsh-codex-tone-0)) 0%,
            transparent 58%
          ),
          radial-gradient(
            90% 70% at 100% 100%,
            color-mix(in srgb, var(--dsw-alias-bg-base) 92%, var(--dsh-codex-tone-5)) 0%,
            transparent 62%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--dsw-alias-bg-base) 95%, var(--dsh-codex-tone-1)) 0%,
            var(--dsw-alias-bg-base) 48%,
            color-mix(in srgb, var(--dsw-alias-bg-base) 96%, var(--dsh-codex-tone-4)) 100%
          );
        pointer-events: none;
      }

      /* The Desktop preload samples this hidden span to choose the native
         caption color. Make the probe transparent so the titlebar controls sit
         directly on the page gradient instead of a grey native strip. */
      body > span[style*="visibility"][style*="--dsw-specific-sidebar-fill"] {
        background-color: transparent !important;
      }

      /* Move the application frame beside the rail instead of painting over it.
         The root slot itself is a display:contents anchor, so target the real
         AppFrame (the element that owns the sidebar column), not #root > div.
         The frame measures itself with a ResizeObserver, so its own column
         solver sees the reduced width and the conversation pane never clips. */
      #root div[class*="_frame"]:has(> div[class*="_sidebarCol"]),
      #root div[class*="_frame"][style*="grid-template-columns"] {
        margin-left: calc(var(--dsh-codex-rail) + var(--dsh-codex-gutter)) !important;
        width: calc(100% - var(--dsh-codex-rail) - var(--dsh-codex-gutter)) !important;
      }

      /* Keep a chrome-colored runway below the title strip before the content
         sheet starts, matching the gutter beside the rail. */
      html[data-windows-titlebar] #root div[class*="_frame"]:has(> div[class*="_sidebarCol"]),
      html[data-windows-titlebar] #root div[class*="_frame"][style*="grid-template-columns"] {
        padding-top: calc(var(--dsh-frame-top-clearance, 0px) + var(--dsh-codex-gutter)) !important;
      }

      /* The rail and the window strip are one uninterrupted surface. The
         conversation/project column below becomes a separate rounded panel. */
      html[data-windows-titlebar] #root div[class*="_frame"]:has(> div[class*="_sidebarCol"]),
      html[data-windows-titlebar] #root div[class*="_frame"][style*="grid-template-columns"] {
        background: transparent !important;
      }

      html[data-windows-titlebar] #root div[class*="_frame"]:has(> div[class*="_sidebarCol"])::before,
      html[data-windows-titlebar] #root div[class*="_frame"][style*="grid-template-columns"]::before {
        background: transparent !important;
      }

      /* A rounded stroke frames the content sheet against the rail and the
         title strip, following the sidebar's top-left corner. */
      html[data-windows-titlebar] #root div[class*="_frame"]:has(> div[class*="_sidebarCol"])::after,
      html[data-windows-titlebar] #root div[class*="_frame"][style*="grid-template-columns"]::after {
        content: "";
        position: absolute;
        top: calc(var(--dsh-frame-top-clearance, 0px) + var(--dsh-codex-gutter));
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 5;
        border-top: 1px solid var(--dsw-alias-border-l2);
        border-left: 1px solid var(--dsw-alias-border-l2);
        border-top-left-radius: var(--dsh-windows-content-radius, 16px);
        pointer-events: none;
      }

      html[data-windows-titlebar] #root div[class*="_sidebarCol"] {
        border-radius: var(--dsh-windows-content-radius, 16px) 0 0 0 !important;
        corner-shape: round;
      }

      /* A fullscreen right panel covers the conversation, but the conversation
         header tabs and composer use higher local layers. With the session list
         collapsed, suppress the covered conversation entirely so none of those
         pieces bleed through the fullscreen surface. */
      html[data-windows-titlebar] #root div[class*="_frame"][data-sidebar-collapsed][data-rightbar-fullscreen] div[class*="_centerCol"] {
        visibility: hidden !important;
      }

      /* The conversation column is separated from the session/project list by
         the same hairline as the outer sheet. This is a frame-level fixed line
         so the conversation's bottom fade cannot wash it out. */
      .dsh-codex-split-divider {
        display: none;
        position: fixed;
        top: calc(var(--dsh-frame-top-clearance, 0px) + var(--dsh-codex-gutter));
        bottom: 0;
        left: calc(var(--dsh-codex-rail) + var(--dsh-windows-sidebar-width, 0px));
        z-index: 35;
        width: 1px;
        background: var(--dsw-alias-border-l2);
        pointer-events: none;
      }

      html[data-windows-titlebar] .dsh-codex-split-divider {
        display: block;
      }

      /* With the list hidden, the divider and the sheet's left edge coincide.
         Start it below the outer corner so it cannot square off the new curve. */
      html[data-windows-titlebar] div[class*="_frame"][data-sidebar-collapsed] .dsh-codex-split-divider {
        top: calc(
          var(--dsh-frame-top-clearance, 0px) + var(--dsh-codex-gutter) +
          var(--dsh-windows-content-radius, 16px)
        );
      }

      /* With the list visible, the conversation's top-left is an internal
         corner, so square it off; the outer sheet's radius still belongs to the
         sidebar. When the sidebar is hidden the conversation becomes the outer
         sheet again and keeps the rounded corner. */
      html[data-windows-titlebar] #root div[class*="_frame"]:not([data-sidebar-collapsed]) div[class*="_centerCol"] {
        border-top-left-radius: 0 !important;
      }

      /* The right sidebar starts on the same sheet edge; repeat the hairline on
         its top so its tabs never blend into the title strip. The overlay sits
         above the sidebar's own surfaces and does not affect its geometry. */
      html[data-windows-titlebar] #root div[class*="_frame"]:not([data-rightbar-fullscreen]) div[class*="_rightbarCol"] {
        position: relative !important;
      }

      html[data-windows-titlebar] #root div[class*="_frame"]:not([data-rightbar-fullscreen]) div[class*="_rightbarCol"]::before {
        content: "";
        position: absolute;
        inset: 0 0 auto 0;
        z-index: 40;
        height: 1px;
        background: var(--dsw-alias-border-l2);
        pointer-events: none;
      }

      /* The fullscreen right panel is sized from 100vw minus the session list.
         Our rail is an extra left column outside the app frame, so subtract it
         as well; otherwise the panel slides under the rail and covers the list. */
      html[data-windows-titlebar] [data-sidebar-right-panel="fullscreen"] {
        max-width: calc(
          100vw - var(--dsh-windows-sidebar-width, 0px) - var(--dsh-codex-rail)
        ) !important;
      }

      /* The fullscreen panel is aligned to the rail edge now, not to the window
         corner, so its former top-left rounding reads as a notch when the list
         is visible. Draw the missing top hairline on the pane itself so the
         border can follow the rounded corner in the collapsed state. */
      html[data-windows-titlebar] [data-sidebar-right-panel="fullscreen"] [data-dockkit-pane] {
        box-sizing: border-box !important;
        border-top: 1px solid var(--dsw-alias-border-l2) !important;
      }

      html[data-windows-titlebar] [data-sidebar-right-panel="fullscreen"] [data-dockkit-column="0"][data-dockkit-pane] {
        border-top-left-radius: 0 !important;
      }

      /* With the session list hidden, the fullscreen panel becomes the leftmost
         sheet surface. Clip the whole panel to exactly the sidebar's corner
         radius instead of trusting an inner pane radius, then carry the left
         hairline down from the curve. */
      html[data-windows-titlebar] div[class*="_frame"][data-sidebar-collapsed] [data-sidebar-right-panel="fullscreen"] {
        clip-path: inset(0 round var(--dsh-windows-content-radius, 16px) 0 0 0);
      }

      html[data-windows-titlebar] div[class*="_frame"][data-sidebar-collapsed] [data-sidebar-right-panel="fullscreen"] [data-dockkit-column="0"][data-dockkit-pane] {
        border-left: 1px solid var(--dsw-alias-border-l2) !important;
      }

      /* Reuse the shell's own global-panel list as the rail's dynamic section.
         Every current and future sidebar.panellist entry (plugins,
         automations, tasks, dsh-market, …) is rendered here by the host, so the
         skin never has to duplicate their icons, labels, or actions. */
      html[data-windows-titlebar] nav[class*="_panelList"] {
        position: fixed !important;
        top: calc(var(--dsh-frame-top-clearance, 0px) + 56px) !important;
        left: calc((var(--dsh-codex-rail) - 36px) / 2) !important;
        z-index: 30 !important;
        box-sizing: border-box !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 3px !important;
        width: 36px !important;
        max-height: calc(100vh - var(--dsh-frame-top-clearance, 0px) - 190px) !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow-x: hidden !important;
        overflow-y: auto !important;
        background: transparent !important;
        scrollbar-width: none;
        /* The host normally fades this list with the sidebar and replays its
           rail-in transform when collapsing. This list is now permanent rail
           chrome, so it must not animate or fade out. */
        opacity: 1 !important;
        animation: none !important;
        transform: none !important;
        transition: none !important;
      }

      html[data-windows-titlebar] nav[class*="_panelList"]::-webkit-scrollbar {
        display: none;
      }

      html[data-windows-titlebar] nav[class*="_panelList"] [class*="_panelRow"] {
        box-sizing: border-box !important;
        width: 36px !important;
        height: 36px !important;
        min-height: 36px !important;
        margin: 0 !important;
        padding: 0 !important;
        gap: 0 !important;
        border-radius: 10px !important;
        color: var(--dsw-alias-label-secondary) !important;
        background: transparent !important;
        justify-content: center !important;
      }

      html[data-windows-titlebar] nav[class*="_panelList"] [class*="_panelRow"]:hover {
        color: var(--dsw-alias-label-primary) !important;
        background: var(--dsw-alias-interactive-bg-hover) !important;
      }

      html[data-windows-titlebar] nav[class*="_panelList"] [class*="_panelActive"] {
        color: var(--dsw-alias-label-primary) !important;
        background: var(--dsw-alias-interactive-bg-hover) !important;
        box-shadow: inset 0 0 0 .5px var(--dsw-alias-border-l2);
      }

      /* The host's panel tooltip lives inside this now-fixed/scrollable nav and
         only enables itself while the sidebar is collapsed. The rail provides
         one custom tooltip for every state instead. */
      html[data-windows-titlebar] nav[class*="_panelList"] [role="tooltip"] {
        display: none !important;
      }

      html[data-windows-titlebar] nav[class*="_panelList"] [class*="_panelGlyph"] {
        flex: none !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      html[data-windows-titlebar] nav[class*="_panelList"] [class*="_panelGlyph"] svg {
        width: 19px !important;
        height: 19px !important;
      }

      /* Keep the label for assistive tech and native menu semantics while the
         rail itself stays icon-only. */
      html[data-windows-titlebar] nav[class*="_panelList"] [class*="_panelTitle"] {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        margin: -1px !important;
        padding: 0 !important;
        overflow: hidden !important;
        clip: rect(0 0 0 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }

      /* Global panels own the whole content sheet; do not offer a fresh
         conversation action in the compact title strip. Reclaim the caption
         start that was reserved for the hidden button so the menu sits next to
         the rail instead of leaving a gap. */
      html[data-dsh-codex-panel-mode] [class*="_newSession"] {
        display: none !important;
        margin-inline: 0 !important;
        padding-inline: 0 !important;
      }

      html[data-windows-titlebar][data-dsh-codex-panel-mode] {
        --dsh-windows-menu-start: 48px !important;
      }

      .dsh-codex-rail {
        position: fixed;
        inset: 0 auto 0 0;
        z-index: 25;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: var(--dsh-codex-rail);
        padding: calc(var(--dsh-frame-top-clearance, 0px) + 10px) 0 68px;
        overflow: visible;
        background: linear-gradient(
          180deg,
          color-mix(in srgb, var(--dsw-alias-bg-base) 10%, transparent),
          transparent 62%
        );
        pointer-events: auto;
        -webkit-app-region: no-drag;
      }

      .dsh-codex-rail-nav {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        width: 100%;
      }

      .dsh-codex-rail-button {
        position: relative;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        padding: 0;
        border: 0;
        border-radius: 10px;
        color: var(--dsw-alias-label-secondary);
        background: transparent;
        cursor: pointer;
        transition: color var(--ds-transition-duration-fast) var(--ds-ease-in-out),
                    background-color var(--ds-transition-duration-fast) var(--ds-ease-in-out);
      }

      .dsh-codex-rail-button svg {
        display: block;
      }

      .dsh-codex-rail-button:hover {
        color: var(--dsw-alias-label-primary);
        background: var(--dsw-alias-interactive-bg-hover);
      }

      .dsh-codex-rail-button[data-active="true"] {
        color: var(--dsw-alias-label-primary);
        background: var(--dsw-alias-interactive-bg-hover);
        box-shadow: inset 0 0 0 .5px var(--dsw-alias-border-l2);
      }

      .dsh-codex-rail-button:focus-visible {
        outline: var(--dsw-focus-ring-width, 2px) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
        outline-offset: 1px;
      }

      .dsh-codex-rail-button::after {
        content: attr(data-label);
        position: absolute;
        top: 50%;
        left: calc(100% + 10px);
        z-index: 80;
        padding: 5px 8px;
        border: .5px solid var(--dsw-alias-border-l2);
        border-radius: 7px;
        color: var(--dsw-alias-toast-label);
        background: var(--dsw-alias-tooltip-bg);
        box-shadow: var(--dsw-elevation-panel, 0 6px 18px #0003);
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transform: translate(-3px, -50%);
        transition: opacity var(--ds-transition-duration-fast) var(--ds-ease-in-out),
                    transform var(--ds-transition-duration-fast) var(--ds-ease-in-out);
      }

      .dsh-codex-rail-button:hover::after,
      .dsh-codex-rail-button:focus-visible::after {
        opacity: 1;
        transform: translate(0, -50%);
      }

      /* The shell's panel list is icon-only in the rail. Its expanded-state
         tooltip is disabled by the host, so mirror the home button's tooltip
         here for the dynamically registered panels. */
      .dsh-codex-rail-tooltip {
        position: fixed;
        z-index: 80;
        padding: 5px 8px;
        border: .5px solid var(--dsw-alias-border-l2);
        border-radius: 7px;
        color: var(--dsw-alias-toast-label);
        background: var(--dsw-alias-tooltip-bg);
        box-shadow: var(--dsw-elevation-panel, 0 6px 18px #0003);
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        white-space: nowrap;
        pointer-events: none;
        transform: translateY(-50%);
      }

      .dsh-codex-rail-spacer {
        flex: 1;
        min-height: 16px;
      }

      .dsh-codex-rail-divider {
        width: 24px;
        height: .5px;
        margin: 7px 0;
        background: var(--dsw-alias-border-l2);
        flex: none;
      }

      .dsh-codex-tasks {
        box-sizing: border-box;
        height: 100%;
        overflow: auto;
        padding: 34px 44px 64px;
        color: var(--dsw-alias-label-primary);
        background: var(--dsw-alias-bg-base);
        --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);
        --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);
      }

      .dsh-codex-tasks-inner {
        width: 100%;
        max-width: 860px;
        margin: 0 auto;
      }

      .dsh-codex-tasks-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 24px;
        padding-bottom: 24px;
      }

      .dsh-codex-tasks-title {
        margin: 0;
        font-size: 28px;
        font-weight: 600;
        line-height: 36px;
        letter-spacing: -.02em;
      }

      .dsh-codex-tasks-description {
        max-width: 620px;
        margin: 6px 0 0;
        color: var(--dsw-alias-label-tertiary);
        font-size: 13px;
        line-height: 20px;
      }

      .dsh-codex-tasks-new {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        flex: none;
        height: 34px;
        padding: 0 14px;
        border: .5px solid var(--dsw-alias-border-l2);
        border-radius: 10px;
        color: var(--dsw-alias-label-primary);
        background: var(--dsw-alias-button-elevated-fill);
        font: inherit;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
      }

      .dsh-codex-tasks-new:hover {
        background: var(--dsw-alias-button-floating-hover);
      }

      .dsh-codex-tasks-new:focus-visible {
        outline: var(--dsw-focus-ring-width, 2px) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
        outline-offset: 2px;
      }

      .dsh-codex-task-section {
        margin-top: 26px;
      }

      .dsh-codex-task-section:first-of-type {
        margin-top: 4px;
      }

      .dsh-codex-task-section-heading {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 8px;
        color: var(--dsw-alias-label-tertiary);
        font-size: 11px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: .06em;
        text-transform: uppercase;
      }

      .dsh-codex-task-count {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 18px;
        height: 16px;
        padding: 0 5px;
        border-radius: 999px;
        color: var(--dsw-alias-label-tertiary);
        background: var(--dsw-alias-bg-skeleton);
        font-size: 10px;
        letter-spacing: 0;
      }

      .dsh-codex-task-list {
        display: flex;
        flex-direction: column;
        border-top: .5px solid var(--dsw-alias-border-l1);
      }

      .dsh-codex-task-row {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        min-height: 52px;
        box-sizing: border-box;
        padding: 9px 10px;
        border: 0;
        border-bottom: .5px solid var(--dsw-alias-border-l1);
        border-radius: 0;
        color: inherit;
        background: transparent;
        font: inherit;
        text-align: left;
        cursor: pointer;
      }

      .dsh-codex-task-row:hover {
        background: var(--dsw-alias-interactive-bg-hover);
      }

      .dsh-codex-task-row:focus-visible {
        outline: var(--dsw-focus-ring-width, 2px) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
        outline-offset: -2px;
      }

      .dsh-codex-task-dot {
        flex: none;
        width: 7px;
        height: 7px;
        border-radius: 999px;
        background: var(--dsw-alias-state-idle-primary);
      }

      .dsh-codex-task-dot[data-state="running"] {
        background: var(--dsw-alias-state-business-primary);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary) 16%, transparent);
      }

      .dsh-codex-task-dot[data-state="waiting"] {
        background: var(--dsw-alias-state-warn-primary);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-warn-primary) 16%, transparent);
      }

      .dsh-codex-task-dot[data-state="unread"] {
        background: var(--dsw-alias-state-success-primary);
      }

      .dsh-codex-task-main {
        display: flex;
        flex: 1;
        flex-direction: column;
        min-width: 0;
        gap: 2px;
      }

      .dsh-codex-task-title {
        overflow: hidden;
        color: var(--dsw-alias-label-primary);
        font-size: 13px;
        font-weight: 500;
        line-height: 20px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dsh-codex-task-meta {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        overflow: hidden;
        color: var(--dsw-alias-label-tertiary);
        font-size: 11px;
        line-height: 16px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dsh-codex-task-meta span {
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .dsh-codex-task-status {
        flex: none;
        color: var(--dsw-alias-label-tertiary);
        font-size: 11px;
        line-height: 16px;
      }

      .dsh-codex-task-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        min-height: 260px;
        color: var(--dsw-alias-label-tertiary);
        text-align: center;
      }

      .dsh-codex-task-empty-title {
        color: var(--dsw-alias-label-secondary);
        font-size: 14px;
        font-weight: 500;
        line-height: 22px;
      }

      .dsh-codex-task-empty-hint {
        max-width: 320px;
        font-size: 12px;
        line-height: 18px;
      }

      /* The shipped account menu and Settings trigger become the rail's bottom
         controls. Their popovers and dialogs are unchanged. */
      [class*="ET65mq_root"] {
        position: fixed !important;
        left: 8px !important;
        bottom: 16px !important;
        z-index: 41 !important;
        width: 36px !important;
        min-width: 0 !important;
      }

      [class*="ET65mq_trigger"] {
        box-sizing: border-box !important;
        justify-content: center !important;
        width: 36px !important;
        height: 36px !important;
        min-height: 36px !important;
        padding: 0 !important;
      }

      [class*="ET65mq_label"] {
        display: none !important;
      }

      [class*="wCInkW_triggerRow"] {
        position: fixed !important;
        left: 8px !important;
        bottom: 16px !important;
        z-index: 40 !important;
        width: 36px !important;
        height: 36px !important;
        margin: 0 !important;
        gap: 0 !important;
      }

      /* The settings launcher is the account menu in this composition; the
         connection/update chip is not part of the rail. */
      [class*="wCInkW_triggerRow"] > [class*="yiN2GW"] {
        display: none !important;
      }

      [class*="wCInkW_trigger"] {
        box-sizing: border-box !important;
        flex: none !important;
        justify-content: center !important;
        width: 36px !important;
        height: 36px !important;
        padding: 0 !important;
      }

      [class*="wCInkW_triggerLabel"] {
        display: none !important;
      }

      /* The Windows collapsed sidebar hides its foot; keep the foot mounted so
         the fixed account avatar stays available while a panel auto-collapses
         the conversation/project column. */
      html[data-windows-titlebar] [class*="_footArea"] {
        display: flex !important;
      }

      @media (max-width: 820px) {
        .dsh-codex-tasks {
          padding: 26px 24px 48px;
        }

        .dsh-codex-tasks-header {
          flex-direction: column;
          gap: 14px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .dsh-codex-rail-button,
        .dsh-codex-rail-button::after {
          transition: none;
        }
      }
    `;

    function RailIcon({ name }) {
      const common = {
        width: 19,
        height: 19,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
      };
      if (name === 'home') {
        return h('svg', common, h('path', { d: 'M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4 3v-3.2A2.5 2.5 0 0 1 5 13.5z' }), h('path', { d: 'M8.5 9h7M8.5 12h4.5' }));
      }
      if (name === 'plugins') {
        return h('svg', common, h('rect', { x: 4, y: 4, width: 6.5, height: 6.5, rx: 1.6 }), h('rect', { x: 13.5, y: 4, width: 6.5, height: 6.5, rx: 1.6 }), h('rect', { x: 4, y: 13.5, width: 6.5, height: 6.5, rx: 1.6 }), h('path', { d: 'M16.75 13.5v6.5M13.5 16.75h6.5' }));
      }
      if (name === 'automations') {
        return h('svg', common, h('circle', { cx: 12, cy: 12, r: 7.5 }), h('path', { d: 'M12 7.75V12l2.75 1.75' }));
      }
      return h('svg', common, h('rect', { x: 4, y: 4, width: 16, height: 16, rx: 3 }), h('path', { d: 'm7.75 12 2.5 2.5 5.75-5.5' }));
    }

    function Rail({ t, activePanelId, onHome }) {
      const active = activePanelId === null || activePanelId === undefined;
      const [tip, setTip] = useState(null);

      useEffect(() => {
        const navSelector = 'nav[class*="_panelList"]';
        const rowSelector = '[class*="_panelRow"]';
        const findRow = (target) => {
          if (!(target instanceof Element)) return null;
          const row = target.closest(rowSelector);
          return row !== null && row.closest(navSelector) !== null ? row : null;
        };
        let timer;
        const hide = () => {
          window.clearTimeout(timer);
          setTip(null);
        };
        const show = (row) => {
          const label = row.getAttribute('aria-label');
          if (!label) return;
          const rect = row.getBoundingClientRect();
          setTip({
            label,
            top: rect.top + rect.height / 2,
            left: rect.right + 10,
          });
        };
        const schedule = (row) => {
          window.clearTimeout(timer);
          timer = window.setTimeout(() => show(row), 80);
        };
        const onOver = (event) => {
          const row = findRow(event.target);
          if (row !== null) schedule(row);
        };
        const onOut = (event) => {
          const row = findRow(event.target);
          if (row === null) return;
          if (event.relatedTarget instanceof Node && row.contains(event.relatedTarget)) return;
          hide();
        };
        const onFocus = (event) => {
          const row = findRow(event.target);
          if (row === null) return;
          window.clearTimeout(timer);
          show(row);
        };
        const onBlur = (event) => {
          const row = findRow(event.target);
          if (row !== null) hide();
        };
        const onScroll = () => hide();
        document.addEventListener('mouseover', onOver, true);
        document.addEventListener('mouseout', onOut, true);
        document.addEventListener('focusin', onFocus, true);
        document.addEventListener('focusout', onBlur, true);
        document.addEventListener('click', hide, true);
        window.addEventListener('scroll', onScroll, true);
        return () => {
          window.clearTimeout(timer);
          document.removeEventListener('mouseover', onOver, true);
          document.removeEventListener('mouseout', onOut, true);
          document.removeEventListener('focusin', onFocus, true);
          document.removeEventListener('focusout', onBlur, true);
          document.removeEventListener('click', hide, true);
          window.removeEventListener('scroll', onScroll, true);
        };
      }, []);

      return h('aside', { className: 'dsh-codex-rail', 'aria-label': t('rail.label') },
        h('nav', { className: 'dsh-codex-rail-nav' },
          h('button', {
            type: 'button',
            className: 'dsh-codex-rail-button',
            'data-active': active ? 'true' : 'false',
            'data-label': t('rail.home'),
            'aria-label': t('rail.home'),
            'aria-current': active ? 'page' : undefined,
            onClick: onHome,
          }, h(RailIcon, { name: 'home' })),
        ),
        h('div', { className: 'dsh-codex-rail-spacer' }),
        h('div', { className: 'dsh-codex-rail-divider' }),
        tip === null ? null : h('div', {
          className: 'dsh-codex-rail-tooltip',
          style: { top: tip.top, left: tip.left },
          role: 'tooltip',
        }, tip.label),
      );
    }

    function toMillis(value) {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') return Date.parse(value);
      return 0;
    }

    function relativeTime(value, locale, justNow) {
      const stamp = toMillis(value);
      if (!Number.isFinite(stamp) || stamp <= 0) return '';
      const delta = stamp - Date.now();
      const abs = Math.abs(delta);
      if (abs < 60_000) return justNow;
      try {
        const format = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
        if (abs < 3_600_000) return format.format(Math.round(delta / 60_000), 'minute');
        if (abs < 86_400_000) return format.format(Math.round(delta / 3_600_000), 'hour');
        if (abs < 2_592_000_000) return format.format(Math.round(delta / 86_400_000), 'day');
        return format.format(Math.round(delta / 2_592_000_000), 'month');
      } catch {
        return '';
      }
    }

    function workspaceName(cwd, fallback) {
      if (typeof cwd !== 'string' || cwd.length === 0) return fallback;
      const parts = cwd.split(/[\\/]+/).filter(Boolean);
      return parts.length > 0 ? parts[parts.length - 1] : fallback;
    }

    function sessionStatus(status) {
      if (status === undefined) return 'idle';
      if (status.pendingInteraction !== undefined && status.pendingInteraction !== null) return 'waiting';
      if (status.running) return 'running';
      if (status.completionUnread) return 'unread';
      return 'idle';
    }

    function statusLabel(status, t) {
      if (status === 'running') return t('tasks.runningLabel');
      if (status === 'waiting') return t('tasks.waitingLabel');
      if (status === 'unread') return t('tasks.unreadLabel');
      return t('tasks.idleLabel');
    }

    function TaskRow({ row, t, openSession }) {
      return h('button', {
        type: 'button',
        className: 'dsh-codex-task-row',
        onClick: () => openSession(row.id),
      },
        h('span', { className: 'dsh-codex-task-dot', 'data-state': row.uiStatus, 'aria-hidden': true }),
        h('span', { className: 'dsh-codex-task-main' },
          h('span', { className: 'dsh-codex-task-title', title: row.title }, row.title),
          h('span', { className: 'dsh-codex-task-meta' },
            h('span', { title: row.cwd || '' }, row.workspace),
            h('span', { 'aria-hidden': true }, '·'),
            h('span', { title: row.updatedAt || '' }, row.updatedLabel),
          ),
        ),
        h('span', { className: 'dsh-codex-task-status' }, statusLabel(row.uiStatus, t)),
      );
    }

    function TasksPanel({ t, useSessionList, useSessionStatus, openSession, startTask }) {
      const list = useSessionList();
      const statuses = useSessionStatus();
      const locale = (typeof navigator !== 'undefined' && navigator.language) || 'en';
      const rows = useMemo(() => {
        const byId = list && list.byId ? list.byId : {};
        const ids = list && Array.isArray(list.ids) ? list.ids : Object.keys(byId);
        const now = Date.now();
        return ids
          .map((id) => byId[id])
          .filter((session) => session && !session.blank && session.origin !== 'subagent')
          .map((session) => {
            const state = statuses && statuses.get ? statuses.get(session.id) : undefined;
            const uiStatus = sessionStatus(state);
            const updated = toMillis(session.updatedAt);
            return {
              id: session.id,
              title: (typeof session.title === 'string' && session.title.trim()) || t('tasks.untitled'),
              cwd: typeof session.cwd === 'string' ? session.cwd : '',
              workspace: workspaceName(session.cwd, t('tasks.noWorkspace')),
              uiStatus,
              updated,
              updatedAt: session.updatedAt || '',
              updatedLabel: relativeTime(session.updatedAt, locale, t('tasks.justNow')) || t('tasks.justNow'),
              rank: updated || now,
            };
          })
          .sort((left, right) => right.rank - left.rank);
      }, [list, statuses, t, locale]);

      const waiting = rows.filter((row) => row.uiStatus === 'waiting');
      const running = rows.filter((row) => row.uiStatus === 'running');
      const unread = rows.filter((row) => row.uiStatus === 'unread');
      const recent = rows.filter((row) => row.uiStatus === 'idle').slice(0, 20);
      const sections = [
        { id: 'waiting', label: t('tasks.waiting'), rows: waiting },
        { id: 'running', label: t('tasks.running'), rows: running },
        { id: 'unread', label: t('tasks.unread'), rows: unread },
        { id: 'recent', label: t('tasks.recent'), rows: recent },
      ].filter((section) => section.rows.length > 0);

      return h('section', { className: 'dsh-codex-tasks' },
        h('div', { className: 'dsh-codex-tasks-inner' },
          h('header', { className: 'dsh-codex-tasks-header' },
            h('div', null,
              h('h1', { className: 'dsh-codex-tasks-title' }, t('tasks.title')),
              h('p', { className: 'dsh-codex-tasks-description' }, t('tasks.description')),
            ),
            h('button', { type: 'button', className: 'dsh-codex-tasks-new', onClick: startTask },
              h('span', { 'aria-hidden': true }, '+'),
              t('tasks.new'),
            ),
          ),
          rows.length === 0
            ? h('div', { className: 'dsh-codex-task-empty' },
                h('div', { className: 'dsh-codex-task-empty-title' }, t('tasks.empty')),
                h('div', { className: 'dsh-codex-task-empty-hint' }, t('tasks.emptyHint')),
              )
            : sections.map((section) => h('div', { className: 'dsh-codex-task-section', key: section.id },
                h('h2', { className: 'dsh-codex-task-section-heading' },
                  section.label,
                  h('span', { className: 'dsh-codex-task-count' }, section.rows.length),
                ),
                h('div', { className: 'dsh-codex-task-list' },
                  section.rows.map((row) => h(TaskRow, { key: `${section.id}:${row.id}`, row, t, openSession })),
                ),
              )),
        ),
      );
    }

    function apply(ctx) {
      ctx.effect(() => {
        const style = document.createElement('style');
        style.dataset.plugin = 'dsh-codex-ui';
        style.dataset.pluginCss = '@local/dsh-codex-ui/skin.css';
        style.textContent = CSS;
        document.head.appendChild(style);
        const refreshCaption = () => {
          const body = document.body;
          body.style.setProperty('--dsh-codex-caption-refresh', '1');
          body.style.removeProperty('--dsh-codex-caption-refresh');
        };
        const captionTimers = [
          window.setTimeout(refreshCaption, 0),
          window.setTimeout(refreshCaption, 300),
        ];
        return () => {
          for (const timer of captionTimers) window.clearTimeout(timer);
          style.remove();
        };
      }, 'dsh-codex-ui: skin CSS');

      ctx.effect(() => ctx.locale.register(NS, { en, zh }), 'dsh-codex-ui: dictionaries');
      const t = ctx.locale.bind(NS);

      const panelInfo = ctx.layout.panelInfo ?? {
        getSnapshot: () => ({ activePanelId: null }),
        subscribe: () => () => {},
      };
      const usePanelInfoSnapshot = () => useSyncExternalStore(
        panelInfo.subscribe,
        panelInfo.getSnapshot,
        panelInfo.getSnapshot,
      );

      const syncPanelMode = () => {
        const activePanelId = panelInfo.getSnapshot().activePanelId;
        const root = document.documentElement;
        if (activePanelId === null || activePanelId === undefined) delete root.dataset.dshCodexPanelMode;
        else root.dataset.dshCodexPanelMode = String(activePanelId);
      };
      ctx.effect(() => {
        const dispose = panelInfo.subscribe(syncPanelMode);
        syncPanelMode();
        return () => {
          dispose();
          delete document.documentElement.dataset.dshCodexPanelMode;
        };
      }, 'dsh-codex-ui: compact title strip mode');

      const TONE_VARIABLES = Array.from({ length: 6 }, (_, index) => `--dsh-codex-tone-${index}`);
      ctx.effect(() => {
        const root = document.documentElement;
        let live = true;
        let generation = 0;
        let lastBounds = '';
        let activeController;
        const base = globalThis.__DSH_TRANSPORT__?.streamBaseUrl ?? window.location.origin;

        const refresh = () => {
          if (!live) return;
          const bounds = `${window.screenX}|${window.screenY}|${window.outerWidth}|${window.outerHeight}|${window.devicePixelRatio}`;
          if (bounds === lastBounds) return;
          lastBounds = bounds;
          const requestGeneration = ++generation;
          activeController?.abort();
          const controller = new AbortController();
          activeController = controller;
          const timeout = window.setTimeout(() => controller.abort(), 8_000);
          fetch(new URL('/codex-ui/mica-colors', base), {
            signal: controller.signal,
            cache: 'no-store',
            credentials: 'omit',
          })
            .then((response) => response.ok ? response.json() : undefined)
            .then((payload) => {
              if (!live || requestGeneration !== generation) return;
              if (!Array.isArray(payload?.colors) || payload.colors.length !== 6) return;
              if (!payload.colors.every((color) => typeof color === 'string' && /^#[0-9a-f]{6}$/iu.test(color))) return;
              payload.colors.forEach((color, index) => root.style.setProperty(TONE_VARIABLES[index], color));
            })
            .catch(() => {})
            .finally(() => window.clearTimeout(timeout));
        };

        refresh();
        window.addEventListener('resize', refresh);
        window.addEventListener('focus', refresh);
        const poll = window.setInterval(refresh, 1_500);

        return () => {
          live = false;
          generation += 1;
          activeController?.abort();
          window.clearInterval(poll);
          window.removeEventListener('resize', refresh);
          window.removeEventListener('focus', refresh);
          for (const variable of TONE_VARIABLES) root.style.removeProperty(variable);
        };
      }, 'dsh-codex-ui: wallpaper-derived gradient colors');

      const useSessionList = () => useSyncExternalStore(
        ctx.sessions.list.subscribe,
        ctx.sessions.list.getSnapshot,
        ctx.sessions.list.getSnapshot,
      );
      const useSessionStatus = () => useSyncExternalStore(
        ctx.sessions.sessionStatus.subscribe,
        ctx.sessions.sessionStatus.getSnapshot,
        ctx.sessions.sessionStatus.getSnapshot,
      );

      const selectPanel = (id) => {
        try {
          ctx.layout.selectPanel(id);
        } catch (error) {
          console.warn('dsh-codex-ui: panel is not registered', id, error);
        }
      };

      const isWideLayout = () => window.innerWidth >= 1024;
      const sidebarIsCollapsed = () => {
        const frame = document.querySelector('#root div[class*="_frame"]:has(> div[class*="_sidebarCol"])');
        return frame !== null && frame.hasAttribute('data-sidebar-collapsed');
      };
      let autoCollapsed = false;
      let lastPanelId = panelInfo.getSnapshot().activePanelId ?? null;

      /* Any global panel can now come from the shell's sidebar.panellist
         (including newly installed ones), so collapse/expand follows the
         panel selection itself rather than the rail's click wrappers. */
      ctx.effect(() => {
        const sync = () => {
          const activePanelId = panelInfo.getSnapshot().activePanelId ?? null;
          if (activePanelId === lastPanelId) return;
          const previous = lastPanelId;
          lastPanelId = activePanelId;
          if (activePanelId !== null && previous === null) {
            if (isWideLayout() && !sidebarIsCollapsed()) {
              ctx.layout.toggleSidebar();
              autoCollapsed = true;
            }
          } else if (activePanelId === null && previous !== null && autoCollapsed) {
            autoCollapsed = false;
            if (isWideLayout() && sidebarIsCollapsed()) ctx.layout.toggleSidebar();
          }
        };
        const dispose = panelInfo.subscribe(sync);
        return dispose;
      }, 'dsh-codex-ui: collapse sidebar for global panels');

      const openConversation = () => selectPanel(null);

      const openSession = (id) => {
        openConversation();
        ctx.uiWorkspace.openSession(id);
      };
      const startTask = () => {
        openConversation();
        ctx.uiWorkspace.startSession();
      };

      ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay',
        id: 'codex-ui.rail',
        order: 0,
        locale: NS,
        inject: () => ({
          useRailPanelInfo: usePanelInfoSnapshot,
          openConversation,
        }),
      }, function CodexRail({ t, useRailPanelInfo, openConversation }) {
        const activePanelId = useRailPanelInfo((info) => info.activePanelId);
        return h(React.Fragment, null,
          h(Rail, {
            t,
            activePanelId,
            onHome: openConversation,
          }),
          h('div', { className: 'dsh-codex-split-divider', 'aria-hidden': true }),
        );
      }));
    }

    return {
      inject: ['slots', 'locale', 'layout', 'sessions', 'uiWorkspace'],
      apply,
    };
  },
});
