# Stop on errors
$ErrorActionPreference = "Stop";

# Hide progress bars
$global:ProgressPreference = 'SilentlyContinue'

# Start build
Write-Host "Packing archives...";

# Setup workspace
New-Item -ItemType directory -Path "./tmp" > $null;
Copy-Item "./site/.vuepress/public/codes/*.xml" "./tmp/";
Set-Location "./tmp";

# Helper function to convert the XML files to the GCM txt format
function XmlToGcm($source, $destination, $versionname) {
  [xml]$xml = Get-Content $source;

  Add-Content $destination $versionname;
  Add-Content $destination "Super Mario Sunshine" -NoNewline;

  foreach ($code in $xml.codes.code) {
    Add-Content $destination  "";
    Add-Content $destination  "";
    Add-Content $destination  "$($code.title."#text") ($($code.date)) [$($code.author)]";
    $codeSource = $code.source -replace " +$", "" -replace "^? [^a-zA-Z0-9]", "";
    Add-Content $destination  $codeSource.Trim() -NoNewline;
  };
};

# Helper function to convert the XML files to the Dolphin INI format
function XmlToIni($source, $destination, $versionname) {
  [xml]$xml = Get-Content $source;

  Add-Content $destination "Paste the following on top of your games .ini file:"
  Add-Content $destination "[Gecko]" -NoNewline

  foreach ($code in $xml.codes.code) {
    Add-Content $destination  "";
    Add-Content $destination  "`$$($code.title."#text") ($($code.date)) [$($code.author)]";
    $codeSource = $code.source -replace " +$", "" -replace "^? [^a-zA-Z0-9]", "";
    Add-Content $destination  $codeSource.Trim() -NoNewline;
  };
}

# Convert files to GCM format
Write-Host "Converting XML files to GCM format..";
XmlToGcm "GMSE01.xml" "GMSE01.txt" "GMSE01";
XmlToGcm "GMSP01.xml" "GMSP01.txt" "GMSP01";
XmlToGcm "GMSJ01.xml" "GMSJ01.txt" "GMSJ01";
XmlToGcm "GMSJ0A.xml" "GMSJ01 (A).txt" "GMSJ01";

# Replace zip file
Write-Host "Compressing GCM archive..";
Compress-Archive "./*.txt" "../site/.vuepress/public/files/GCMCodes.zip";
Write-Host "GCM Archive built";

# Convert files to Dolphin format
Remove-Item *.txt;

Write-Host "Converting XML files to Dolphin INI format..";
XmlToIni "GMSE01.xml" "GMSE01.txt" "GMSE01";
XmlToIni "GMSP01.xml" "GMSP01.txt" "GMSP01";
XmlToIni "GMSJ01.xml" "GMSJ01.txt" "GMSJ01";
XmlToIni "GMSJ0A.xml" "GMSJ01 (A).txt" "GMSJ01";

Write-Host "Compressing Dolphin archive..";
Compress-Archive "./*.txt" "../site/.vuepress/public/files/DolphinCodes.zip";

Write-Host "Dolphin Archive built";

# Cleanup
Write-Host "Cleaning up..";
Set-Location ..;
Remove-Item "./tmp" -Recurse;
Write-Host "Done";