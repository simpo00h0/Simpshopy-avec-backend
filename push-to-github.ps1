# Push vers GitHub avec ton token (une seule fois).
# 1. Va sur https://github.com/settings/tokens et crée un token (scope: repo).
# 2. Dans PowerShell : .\push-to-github.ps1  puis colle ton token quand demandé.

$token = Read-Host "Colle ton token GitHub"
$url = "https://simpo00h0:$token@github.com/simpo00h0/Simpshopy-avec-backend.git"
Set-Location $PSScriptRoot
git push $url master
Write-Host "Si le push a reussi, ton projet est sur GitHub."
