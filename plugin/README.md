# Codex Three-Column Skin for DSH

A Web client skin bundle for DeepSeek Harness that follows the current Codex desktop
layout:

- **Left rail** — Chats, the shell's complete `sidebar.panellist`, and the shipped
  account avatar pinned to the bottom. Because the host's own global-panel list is
  reused, newly installed entries such as dsh-market and any future panel appear
  automatically with their own icons and actions. The rail shares one uninterrupted
  background with the window title strip.
- **Middle column** — the untouched DSH sidebar: brand, New Session, Projects, and
  Recent conversations. It sits below the title strip as a separate rounded panel.
  Its global-panel list is repositioned into the rail rather than duplicated.
- **Right column** — the conversation, now occupying the remaining width. The app frame
  is moved (not painted over) so the layout solver measures the true reduced width.

The content sheet is flush with the rail and title strip and framed by a 1px rounded
outline (16px top-left radius), with no pale gutter between chrome and content. A
matching 1px frame-level overlay separates the session/project list from the
conversation, from the title strip all the way to the bottom edge so the conversation's
composer fade cannot wash it out. With the sidebar visible the conversation's internal
top-left corner is square, while hiding the sidebar restores the outer rounded corner
and keeps the divider at the rail edge. The shell's global-panel list is permanent rail
chrome, so its inherited rail-in transform and collapse fade are disabled; the panel
icons do not slide or fade when the sidebar toggles. The
right sidebar receives the same 1px top hairline in its normal (non-fullscreen) state.
Its fullscreen panel is re-sized against the extra 52px rail as well as the
conversation/project column, so it never slides under the rail or covers that column.
The fullscreen pane carries the same 1px top hairline. With the session list visible its
top-left corner is square; with the list collapsed the whole panel is clipped to the
sidebar's exact 16px corner, so no inner pane radius can read larger than the left
sidebar. The hairline wraps around that clip. When the fullscreen panel covers the
conversation and the session list is collapsed, the center conversation column is hidden
entirely so its header tabs and composer cannot bleed through the panel.

The chrome uses a low-saturation Mica-inspired sheen instead of a flat fill: six colors
sampled from the wallpaper area behind the DSH window are mixed into the theme surface
at only 4–12%, then arranged as two soft radial washes over a faint diagonal gradient.
The current wallpaper's six colors are embedded as defaults so the effect is immediate.
The Host half also registers `/codex-ui/mica-colors`, which re-samples the window's
wallpaper area and lets the Client refresh the gradient when the window moves or the
wallpaper changes. It exposes only six hex colors, never an image, and is loopback-only.
The dynamic route activates after a full restart. This remains a visual approximation;
DSH's BrowserWindow does not currently enable `backgroundMaterial: 'mica'`.

The Desktop preload probes a hidden span to choose its native caption color. The skin
makes that probe transparent so the titlebar control strip shows the page gradient
instead of a grey native rectangle.

Selecting any global panel (including future `sidebar.panellist` additions) collapses
the conversation/project column, hides its New Session action from the compact title
strip, and reclaims the caption start reserved for that button so the application menu
sits next to the rail with no leftover slot. Returning to Chats expands the column
again. A sidebar the user collapsed manually is left collapsed, and the automatic
behavior is disabled below the 1024px responsive breakpoint. The skin supplies the
matching hover/focus tooltip for every dynamic rail icon in both sidebar states, and
hides the shell's inline panel tooltip so only one label appears.

The account avatar is the shipped account/settings launcher, relocated to the rail
foot; opening it still provides Settings and sign-out. Its source-layout selector is
pinned to the `0.2.1-rc.2` client class prefix. If a future DSH version changes that
generated hash, the rail still works and the avatar simply remains in the sidebar
footer until the selector is updated.

## Install

From a DSH profile shell:

```powershell
dsh plugin --profile desktop add <absolute path to this folder>
```

Then restart the desktop app once so the new bundle is loaded.
