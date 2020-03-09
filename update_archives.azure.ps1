$ErrorActionPreference = "Stop";

# Retrieve commit hash from latest archive update
Write-Host -ForegroundColor Blue "Retrieving last update commit..";
$LastGCMUpdate = (git log -1 --pretty=format:"%H" ./files/GCMCodes.zip);

if ([string]::IsNullOrWhiteSpace($LastGCMUpdate)) {            
  Write-Host -ForegroundColor Red "Failed to retrieve the latest update commit";
  exit -1;       
}

Write-Host -ForegroundColor Green "Last GCM Archive Update:" $LastGCMUpdate;

# Check whether any one of the code files chnged
Write-Host -ForegroundColor Blue "Scanning for code changes.."

$CodeUpdates = (git diff --name-only $LastGCMUpdate HEAD -- './codes/*.xml')

if ([string]::IsNullOrWhiteSpace($CodeUpdates)) {            
  Write-Host -ForegroundColor Green "No code changes detected";
  exit 0;
}

Write-Host "Changed files since last archive Update:" $CodeUpdates;

# Start build
Write-Host -ForegroundColor Blue  "Packing new archive...";

# Setup workspace
New-Item -ItemType directory -Path "./.build";
Copy-Item "./codes/*.xml" "./.build/";
Set-Location "./.build";

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
Write-Host "Compressing and replacing GCM archive..";
Compress-Archive "./*.txt" "../files/GCMCodes.zip" -Force;

Write-Host -ForegroundColor Green "GCM Archive rebuilt";

# Convert files to Dolphin format
Remove-Item *.txt;

Write-Host "Converting XML files to Dolphin INI format..";
XmlToIni "GMSE01.xml" "GMSE01.txt" "GMSE01";
XmlToIni "GMSP01.xml" "GMSP01.txt" "GMSP01";
XmlToIni "GMSJ01.xml" "GMSJ01.txt" "GMSJ01";
XmlToIni "GMSJ0A.xml" "GMSJ01 (A).txt" "GMSJ01";

Write-Host "Compressing and replacing Dolphin archive..";
Compress-Archive "./*.txt" "../files/DolphinCodes.zip" -Force;

Write-Host -ForegroundColor Green "Dolphin Archive rebuilt";

# Cleanup
Write-Host "Cleaning up..";
Set-Location ..;
Remove-Item "./.build" -Recurse;
Write-Host -ForegroundColor Green "Done";

# Set Azure variable to commit and push changes
Write-Host "##vso[task.setvariable variable=pushChanges;]Yes"