$audioDir = Join-Path $PSScriptRoot "audio"
$scriptJs = Join-Path $PSScriptRoot "script.js"
$swJs     = Join-Path $PSScriptRoot "sw.js"

if (-not (Test-Path $audioDir)) {
    Write-Host "❌ مجلد audio غير موجود!" -ForegroundColor Red; pause; exit 1
}

$mp3Files = Get-ChildItem -Path $audioDir -Filter "*.mp3" | Select-Object -ExpandProperty Name

if ($mp3Files.Count -eq 0) {
    Write-Host "⚠️ لا يوجد ملفات MP3!" -ForegroundColor Yellow; pause; exit 1
}

Write-Host "`n✅ تم العثور على $($mp3Files.Count) ملف:" -ForegroundColor Green
$mp3Files | ForEach-Object { Write-Host "   - $_" -ForegroundColor Cyan }

$entries = $mp3Files | ForEach-Object {
    "    {`n        src: 'audio/$_',`n        surah: 'اسم السورة أو الآية',`n        reader: 'اسم القارئ'`n    }"
}

$newArray = "const audioFiles = [`n" + ($entries -join ",`n") + "`n];"

$scriptContent = Get-Content $scriptJs -Raw -Encoding UTF8
$scriptContent = $scriptContent -replace '(?s)const audioFiles = \[.*?\];', $newArray
Set-Content -Path $scriptJs -Value $scriptContent -Encoding UTF8
Write-Host "`n✅ تم تحديث script.js — لا تنسَ تعديل surah و reader يدوياً!" -ForegroundColor Green

$swContent = Get-Content $swJs -Raw -Encoding UTF8

$swContent = $swContent -replace "wswas-app-cache-v(\d+)", {
    "wswas-app-cache-v$([int]$Matches[1] + 1)"
}

$cacheLines = $mp3Files | ForEach-Object { "    './audio/$_'" }
$swContent = $swContent -replace "(?m)(    '\./audio/[^\n]+\n)+(    '\./audio/[^\n]+)", ($cacheLines -join ",`n")

Set-Content -Path $swJs -Value $swContent -Encoding UTF8
Write-Host "✅ تم تحديث sw.js" -ForegroundColor Green

Write-Host "`n🎉 انتهى! افتح التطبيق وجرّب." -ForegroundColor Magenta
pause
