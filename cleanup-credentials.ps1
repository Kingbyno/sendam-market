# PowerShell script to remove sensitive credentials from documentation files

$files = @(
    "GIT_PUSH_SUCCESS.md",
    "DATABASE_SETUP_GUIDE.md", 
    "VERCEL_DATABASE_FIX.md",
    "NEW_DEPLOYMENT_FIX.md",
    "LATEST_REDIRECT_FIX.md"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Cleaning $file..."
        
        # Replace Google Client ID
        (Get-Content $file) | ForEach-Object {
            $_ -replace "469518309195-sg7l7fgcjj6hbkargqqnqhs1888n78cf\.apps\.googleusercontent\.com", "YOUR_GOOGLE_CLIENT_ID"
        } | Set-Content $file
        
        # Replace Google Client Secret  
        (Get-Content $file) | ForEach-Object {
            $_ -replace "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", "YOUR_GOOGLE_CLIENT_SECRET"
        } | Set-Content $file
        
        Write-Host "✅ Cleaned $file"
    }
}

Write-Host "🎉 All documentation files cleaned!"
