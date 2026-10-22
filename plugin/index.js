import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const ROUTE = '/codex-ui/mica-colors'
const CACHE_MS = 1_500

let cachedAt = 0
let cachedPayload

/**
 * Read six colors from the wallpaper area behind the DSH window. The Client
 * mixes them with the active theme surface at a low ratio to build a subdued
 * Mica-like gradient, so the result follows both wallpaper and window position
 * without ever shipping a wallpaper image.
 *
 * The script maps the Electron main window rect (the Host process parent)
 * through the Windows wallpaper Fill/Span geometry, crops that range, and
 * downsamples it to a 3x2 grid of hex colors.
 */
const WALLPAPER_COLORS_SCRIPT = String.raw`
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type @"
using System;
using System.Runtime.InteropServices;
public static class DshMicaNative {
  [DllImport("user32.dll")] public static extern bool SetProcessDpiAwarenessContext(IntPtr value);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT rect);
  [DllImport("user32.dll")] public static extern IntPtr MonitorFromWindow(IntPtr hWnd, uint flags);
  [DllImport("user32.dll")] public static extern bool GetMonitorInfo(IntPtr hMonitor, ref MONITORINFO info);
  [DllImport("user32.dll")] public static extern int GetSystemMetrics(int index);
  public struct RECT { public int Left; public int Top; public int Right; public int Bottom; }
  public struct MONITORINFO { public int cbSize; public RECT rcMonitor; public RECT rcWork; public uint dwFlags; }
}
"@

try { [DshMicaNative]::SetProcessDpiAwarenessContext([IntPtr]-4) | Out-Null } catch {}

$wallpaper = (Get-ItemProperty -LiteralPath 'HKCU:\Control Panel\Desktop' -Name WallPaper).WallPaper
if ([string]::IsNullOrWhiteSpace($wallpaper) -or -not (Test-Path -LiteralPath $wallpaper)) {
  throw 'Windows wallpaper file is missing'
}

$windowPid = 0
[void][int]::TryParse($env:DSH_CODEX_WINDOW_PID, [ref]$windowPid)
$main = if ($windowPid -gt 0) { Get-Process -Id $windowPid -ErrorAction SilentlyContinue } else { $null }
if ($null -eq $main -or $main.MainWindowHandle -eq 0) {
  $main = Get-Process 'DeepSeek Harness' -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1
}
if ($null -eq $main -or $main.MainWindowHandle -eq 0) {
  throw 'DSH main window was not found'
}

$wr = New-Object DshMicaNative+RECT
if (-not [DshMicaNative]::GetWindowRect($main.MainWindowHandle, [ref]$wr)) {
  throw 'GetWindowRect failed'
}
$winW = [Math]::Max(1, $wr.Right - $wr.Left)
$winH = [Math]::Max(1, $wr.Bottom - $wr.Top)

$mi = New-Object DshMicaNative+MONITORINFO
$mi.cbSize = [System.Runtime.InteropServices.Marshal]::SizeOf($mi)
$hmon = [DshMicaNative]::MonitorFromWindow($main.MainWindowHandle, 2)
if (-not [DshMicaNative]::GetMonitorInfo($hmon, [ref]$mi)) {
  throw 'GetMonitorInfo failed'
}

$style = (Get-ItemProperty -LiteralPath 'HKCU:\Control Panel\Desktop' -Name WallpaperStyle -ErrorAction SilentlyContinue).WallpaperStyle
if ("$style" -eq '22') {
  $tx = [DshMicaNative]::GetSystemMetrics(76)
  $ty = [DshMicaNative]::GetSystemMetrics(77)
  $tw = [DshMicaNative]::GetSystemMetrics(78)
  $th = [DshMicaNative]::GetSystemMetrics(79)
} else {
  $tx = $mi.rcMonitor.Left
  $ty = $mi.rcMonitor.Top
  $tw = $mi.rcMonitor.Right - $mi.rcMonitor.Left
  $th = $mi.rcMonitor.Bottom - $mi.rcMonitor.Top
}

$source = [System.Drawing.Image]::FromFile($wallpaper)
try {
  $iw = $source.Width
  $ih = $source.Height
  $scale = [Math]::Max($tw / $iw, $th / $ih)
  $drawW = $iw * $scale
  $drawH = $ih * $scale
  $offsetX = $tx + ($tw - $drawW) / 2
  $offsetY = $ty + ($th - $drawH) / 2

  $sx = [int][Math]::Floor([Math]::Max(0, [Math]::Min($iw - 1, ($wr.Left - $offsetX) / $scale)))
  $sy = [int][Math]::Floor([Math]::Max(0, [Math]::Min($ih - 1, ($wr.Top - $offsetY) / $scale)))
  $sw = [int][Math]::Ceiling([Math]::Max(1, [Math]::Min($iw - $sx, $winW / $scale)))
  $sh = [int][Math]::Ceiling([Math]::Max(1, [Math]::Min($ih - $sy, $winH / $scale)))

  $bitmap = New-Object System.Drawing.Bitmap(3, 2)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  try {
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $destRect = New-Object System.Drawing.Rectangle(0, 0, 3, 2)
    $srcRect = New-Object System.Drawing.Rectangle($sx, $sy, $sw, $sh)
    $graphics.DrawImage($source, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  } finally {
    $graphics.Dispose()
  }

  $colors = New-Object System.Collections.Generic.List[string]
  for ($y = 0; $y -lt 2; $y++) {
    for ($x = 0; $x -lt 3; $x++) {
      $pixel = $bitmap.GetPixel($x, $y)
      $colors.Add(('#{0:X2}{1:X2}{2:X2}' -f $pixel.R, $pixel.G, $pixel.B))
    }
  }
  $bitmap.Dispose()
  "COLORS=$($colors -join ',')"
} finally {
  $source.Dispose()
}
`

async function sampleWallpaperColors() {
  if (process.platform !== 'win32') return { colors: null }
  if (Date.now() - cachedAt < CACHE_MS) return cachedPayload

  cachedAt = Date.now()
  try {
    const { stdout } = await execFileAsync('powershell.exe', [
      '-NoLogo',
      '-NoProfile',
      '-NonInteractive',
      '-ExecutionPolicy',
      'Bypass',
      '-Command',
      WALLPAPER_COLORS_SCRIPT,
    ], {
      windowsHide: true,
      timeout: 5_000,
      maxBuffer: 1024 * 1024,
      env: { ...process.env, DSH_CODEX_WINDOW_PID: String(process.ppid ?? 0) },
    })
    const line = stdout.split(/\r?\n/u).find((entry) => entry.startsWith('COLORS='))
    const colors = line === undefined
      ? []
      : line.slice(7).split(',').filter((color) => /^#[0-9a-f]{6}$/iu.test(color))
    cachedPayload = colors.length === 6
      ? { colors, sampledAt: cachedAt }
      : { colors: null }
  } catch {
    cachedPayload = { colors: null }
  }
  return cachedPayload
}

export const inject = ['webServer']

export function apply(ctx) {
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: ROUTE,
    handler: async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      res.setHeader('Cache-Control', 'no-store')
      res.setHeader('X-Content-Type-Options', 'nosniff')
      if (req.method === 'OPTIONS') {
        res.writeHead(204)
        res.end()
        return
      }
      if (req.method !== 'GET') {
        res.writeHead(405)
        res.end()
        return
      }
      const remote = req.socket.remoteAddress
      const loopback = remote === '127.0.0.1' || remote === '::1' || (typeof remote === 'string' && remote.startsWith('::ffff:127.'))
      if (!loopback) {
        res.writeHead(403)
        res.end()
        return
      }
      const payload = await sampleWallpaperColors()
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify(payload))
    },
  }), 'dsh-codex-ui: wallpaper-derived gradient colors')
}
