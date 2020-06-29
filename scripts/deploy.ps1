# Stop on errors
$ErrorActionPreference = "Stop";
Set-StrictMode -Version Latest

# Hide progress bars
$global:ProgressPreference = 'SilentlyContinue';

Set-Location "./dist"

# Set git email and username
Write-Host "Configuring git"
Write-Host "Using identity $env:PUBLISHER_NAME / $env:PUBLISHER_EMAIL"
git init
git config --local user.name "$env:PUBLISHER_NAME" | Out-Null;
git config --local user.email "$env:PUBLISHER_EMAIL" | Out-Null;

# Commit all files in the dist/ directory
Write-Host "Commiting build"
git add .;
git commit -m "auto-deployment";

try {
  # Force push to gh-pages
  Write-Host "Pushing to gh-pages branch";
  git push -uqf $env:REPOSITORY_TOKEN HEAD:gh-pages 2>&1 | Out-Null;
}
catch {
  Write-Error "Push failed";
}

Write-Host "Finished";