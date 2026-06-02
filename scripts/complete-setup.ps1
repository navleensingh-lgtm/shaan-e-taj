# Run AFTER: gh auth login (as Navleen) then: gh auth switch -u navleen
$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host "=== 1. Verify Navleen GitHub ===" -ForegroundColor Cyan
$login = gh api user --jq .login
if ($login -ne "navleen") {
  Write-Host "Active account is '$login', not 'navleen'. Run: gh auth login" -ForegroundColor Red
  exit 1
}

Write-Host "=== 2. Delete extra repos on workpuneetkumar-sketch (if you have access) ===" -ForegroundColor Cyan
gh auth switch -u workpuneetkumar-sketch 2>$null
gh auth refresh -h github.com -s delete_repo 2>$null
gh repo delete workpuneetkumar-sketch/zyoris --yes 2>$null
gh repo delete workpuneetkumar-sketch/zyoris-frontend --yes 2>$null
gh auth switch -u navleen

Write-Host "=== 3. Create private repo navleen/shaan-e-taj ===" -ForegroundColor Cyan
if (-not (git rev-parse HEAD 2>$null)) {
  git add -A
  git commit -m "Shaan-e-Taj: full luxury e-commerce website"
}
$exists = gh repo view navleen/shaan-e-taj 2>$null
if ($LASTEXITCODE -ne 0) {
  gh repo create shaan-e-taj --private --description "Shaan-e-Taj luxury couture website" --source=. --remote=origin --push
} else {
  git remote remove origin 2>$null
  git remote add origin https://github.com/navleen/shaan-e-taj.git
  git push -u origin HEAD:main 2>$null
  if ($LASTEXITCODE -ne 0) { git push -u origin HEAD:master }
}

Write-Host "=== Done. Next: VPS deploy — see HOSTING.md ===" -ForegroundColor Green
