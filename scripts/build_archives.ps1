# Stop on errors
$ErrorActionPreference = "Stop";

# Hide progress bars
$global:ProgressPreference = 'SilentlyContinue'

# Move to script directory
$rootDirectory = (Get-Item $PSScriptRoot).Parent.FullName
Set-Location $rootDirectory;

# Start build
Write-Host "Packing archives...";

# Setup workspace
New-Item -ItemType directory -Path "./tmp" > $null;
Copy-Item "Codes.xml" "./tmp/";
Set-Location "./tmp";

# Helper function to convert the XML files to the GCM txt format
function XmlToGcm($source, $destination, $versionname) {
  [xml]$xml = Get-Content $source;

  Add-Content $destination $versionname;
  Add-Content $destination "Super Mario Sunshine" -NoNewline;

  foreach ($code in $xml.codes.code) {
    $codeTitle = ($code.title | Where-Object { $_.lang -eq 'en-US' }).'#text';
    $codeSource = ($code.source | Where-Object { $_.version -eq $versionname }).'#text';

    Write-Host "$versionname`: $codeTitle";
    Write-Host $codeSource;

    if (!$codeSource || [string]::IsNullOrWhiteSpace($codeSource.'#text')) {
      Write-Host "No source found, skipping";
      continue;
    }

    Add-Content $destination  "";
    Add-Content $destination  "";
    Add-Content $destination  "$codeTitle ($($code.date)) [$($code.author)]";
    $codeSource = $codeSource -replace " +$", "" -replace "^? [^a-zA-Z0-9]", "";
    Add-Content $destination  $codeSource.Trim() -NoNewline;
  };
};

# Helper function to convert the XML files to the Dolphin INI format
function XmlToIni($source, $destination, $versionname) {
  [xml]$xml = Get-Content $source;

  Add-Content $destination "Paste the following on top of your games .ini file:"
  Add-Content $destination "[Gecko]" -NoNewline

  foreach ($code in $xml.codes.code) {
    $codeTitle = ($code.title | Where-Object { $_.lang -eq 'en-US' }).'#text';
    $codeSource = ($code.source | Where-Object { $_.version -eq $versionname }).'#text';

    Write-Host "$versionname`: $codeTitle";
    Write-Host $codeSource;

    if (!$codeSource || [string]::IsNullOrWhiteSpace($codeSource.'#text')) {
      Write-Host "No source found, skipping";
      continue;
    }

    Add-Content $destination  "";
    Add-Content $destination  "`$$codeTitle ($($code.date)) [$($code.author)]";
    $codeSource = $codeSource -replace " +$", "" -replace "^? [^a-zA-Z0-9]", "";
    Add-Content $destination  $codeSource.Trim() -NoNewline;
  };
}

# Convert files to GCM format
Write-Host "Converting XML files to GCM format..";
XmlToGcm "Codes.xml" "GMSE01.txt" "GMSE01";
XmlToGcm "Codes.xml" "GMSP01.txt" "GMSP01";
XmlToGcm "Codes.xml" "GMSJ01.txt" "GMSJ01";
XmlToGcm "Codes.xml" "GMSJ01 (A).txt" "GMSJ01";

# Replace zip file
Write-Host "Compressing GCM archive..";
Compress-Archive "./*.txt" "../site/.vuepress/public/files/GCMCodes.zip";
Write-Host "GCM Archive built";

# Convert files to Dolphin format
Remove-Item *.txt;

Write-Host "Converting XML files to Dolphin INI format..";
XmlToIni "Codes.xml" "GMSE01.txt" "GMSE01";
XmlToIni "Codes.xml" "GMSP01.txt" "GMSP01";
XmlToIni "Codes.xml" "GMSJ01.txt" "GMSJ01";
XmlToIni "Codes.xml" "GMSJ01 (A).txt" "GMSJ01";

Write-Host "Compressing Dolphin archive..";
Compress-Archive "./*.txt" "../site/.vuepress/public/files/DolphinCodes.zip";

Write-Host "Dolphin Archive built";

# Cleanup
Write-Host "Cleaning up..";
Set-Location ..;
Remove-Item "./tmp" -Recurse;
Write-Host "Done";