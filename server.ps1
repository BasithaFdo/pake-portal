# ==============================================================================
# SkyLine Hub -- Modern Local Core Web & 3D Telemetry Server
# Architect: Basitha Ninduwara Fernando
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$port = 8080
$rootDir = Join-Path $PSScriptRoot 'public'

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:' + $port + '/')

try {
    $listener.Start()
} catch {
    Write-Host ('[!] Failed to start SkyLine Hub listener on port ' + $port + ' : ' + $_) -ForegroundColor Red
    exit
}

Clear-Host
Write-Host ''
Write-Host '  ============================================================================' -ForegroundColor Cyan
Write-Host '    ____ _  ____   ___     ___ _   _ _____   _   _ _   _ ____  ' -ForegroundColor Cyan
Write-Host '   / ___| |/ /\ \ / / |   |_ _| \ | | ____| | | | | | | | __ ) ' -ForegroundColor Cyan
Write-Host '   \___ \  /  \ V /| |    | ||  \| |  _|   | |_| | | | |  _ \ ' -ForegroundColor Magenta
Write-Host '    ___) | . \   | | | |___ | || |\  | |___  |  _  | |_| | |_) |' -ForegroundColor Magenta
Write-Host '   |____/|_|\_\  |_| |_____|___|_| \_|_____| |_| |_|\___/|____/ ' -ForegroundColor Blue
Write-Host '  ============================================================================' -ForegroundColor Cyan
Write-Host '   [*] ENGINE:     SkyLine Hub Core Server v2.5 [ONLINE]' -ForegroundColor Green
Write-Host '   [*] ARCHITECT:  Basitha Ninduwara Fernando - Full-Stack, RPA & FiveM' -ForegroundColor White
Write-Host '   [*] 3D SHOWROOM:Brians Nissan Skyline GT-R R34 (Fast & Furious WebGL)' -ForegroundColor Yellow
Write-Host '   [*] CLOUD VAULT:SkyLine Cloud Private Storage Console' -ForegroundColor Magenta
Write-Host '  ----------------------------------------------------------------------------' -ForegroundColor DarkGray
Write-Host ('   [>] Landing Page:    http://localhost:' + $port + '/') -ForegroundColor Cyan
Write-Host ('   [>] 3D Showroom:     http://localhost:' + $port + '/preview.html#fivem') -ForegroundColor Yellow
Write-Host ('   [>] Cloud Drive:     http://localhost:' + $port + '/dashboard_preview.html') -ForegroundColor Magenta
Write-Host ('   [>] Real Logo SVG:   http://localhost:' + $port + '/assets/skyline-logo.svg') -ForegroundColor Green
Write-Host ('   [>] Serving From:    ' + $rootDir) -ForegroundColor DarkCyan
Write-Host '  ============================================================================' -ForegroundColor DarkGray
Write-Host '   Press [Ctrl+C] at any time to halt server execution.' -ForegroundColor DarkGray
Write-Host ''

$mimeTypes = @{
    '.html'  = 'text/html; charset=utf-8'
    '.css'   = 'text/css; charset=utf-8'
    '.js'    = 'application/javascript; charset=utf-8'
    '.json'  = 'application/json; charset=utf-8'
    '.glb'   = 'model/gltf-binary'
    '.gltf'  = 'model/gltf+json'
    '.png'   = 'image/png'
    '.jpg'   = 'image/jpeg'
    '.jpeg'  = 'image/jpeg'
    '.svg'   = 'image/svg+xml'
    '.ico'   = 'image/x-icon'
    '.webp'  = 'image/webp'
    '.woff2' = 'font/woff2'
    '.ttf'   = 'font/ttf'
}

function Get-LogTag($ext) {
    switch ($ext) {
        '.html'  { return '[WEB] ' }
        '.css'   { return '[CSS] ' }
        '.js'    { return '[JS]  ' }
        '.glb'   { return '[3D]  ' }
        '.gltf'  { return '[3D]  ' }
        '.svg'   { return '[LOGO]' }
        '.png'   { return '[IMG] ' }
        '.jpg'   { return '[IMG] ' }
        '.ico'   { return '[ICON]' }
        '.json'  { return '[DATA]' }
        default  { return '[FILE]' }
    }
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($urlPath) -or $urlPath -eq '/') {
            $urlPath = 'preview.html'
        }

        $cleanPath = $urlPath.Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $filePath = Join-Path $rootDir $cleanPath
        $timeStr = (Get-Date).ToString('HH:mm:ss')

        $response.AddHeader('Access-Control-Allow-Origin', '*')
        $response.AddHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST')
        $response.AddHeader('Cache-Control', 'no-cache, no-store, must-revalidate')

        if ($request.HttpMethod -eq 'OPTIONS') {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = $mimeTypes[$ext]
            if (-not $contentType) {
                $contentType = 'application/octet-stream'
            }
            $response.ContentType = $contentType

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            if ($request.HttpMethod -ne 'HEAD') {
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }

            $tag = Get-LogTag $ext
            $sizeKb = [Math]::Round($bytes.Length / 1024, 1)
            Write-Host ('  [' + $timeStr + '] ' + $tag + ' ' + $request.HttpMethod + ' /' + $urlPath + ' - 200 OK (' + $sizeKb + ' KB)') -ForegroundColor DarkGreen
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes('404 - SkyLine Hub File Not Found: ' + $urlPath)
            $response.OutputStream.Write($msg, 0, $msg.Length)
            Write-Host ('  [' + $timeStr + '] [WARN] ' + $request.HttpMethod + ' /' + $urlPath + ' - 404 Not Found') -ForegroundColor Yellow
        }

        $response.Close()
    } catch {
        # Ignore client aborts
    }
}