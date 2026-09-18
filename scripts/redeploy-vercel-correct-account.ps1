# Shaan-e-Taj — redeploy on the CORRECT Vercel account
# Run in PowerShell from repo root after logging in with the right email.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "1) Log out of wrong Vercel account..."
npx vercel@latest logout

Write-Host "`n2) Log in with your OTHER email (browser will open)..."
npx vercel@latest login

Write-Host "`n3) Confirm account:"
npx vercel@latest whoami

Write-Host "`n4) Remove old project link (wrong team)..."
if (Test-Path ".vercel") { Remove-Item ".vercel" -Recurse -Force }

Write-Host "`n5) Link + deploy to new account..."
npx vercel@latest link --yes
npx vercel@latest env pull .env.vercel.local --yes 2>$null
npx vercel@latest deploy --prod --yes

Write-Host "`nDone. Open the Production URL shown above."
