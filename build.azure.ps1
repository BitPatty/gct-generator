$ErrorActionPreference = "Stop";

Write-Host -ForegroundColor Blue "Ensuring yarn is installed..";
npm i -g yarn;

Write-Host -ForegroundColor Blue "Installing dependencies..";
yarn;

Write-Host -ForegroundColor Blue "Creating new build..";
yarn build;

Write-Host -ForegroundColor Blue "Initializing git repository";
$Remote = (git remote get-url origin);
Set-Location "./docs/.vuepress/dist";
git init;
git config --local user.name "BotPatty";
git config --local user.email "ci@zint.ch";
git remote add origin $Remote;
git add .;
git commit -m "auto-deployment";