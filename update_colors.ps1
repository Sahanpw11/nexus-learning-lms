# PowerShell script to update all text colors and backgrounds for light theme

$pages = @(
    "Notes.js",
    "Users.js", 
    "Students.js",
    "Analytics.js",
    "Notifications.js",
    "Settings.js"
)

foreach ($page in $pages) {
    $filePath = "frontend\src\pages\$page"
    if (Test-Path $filePath) {
        Write-Host "Updating $page..."
        
        $content = Get-Content $filePath -Raw
        
        # Background changes
        $content = $content -replace 'bg-black', 'style={{backgroundColor:"#fcfcf7"}}'
        $content = $content -replace 'bg-gradient-dark', 'style={{backgroundColor:"#fcfcf7"}}'
        $content = $content -replace 'min-h-screen bg-black', 'min-h-screen style={{backgroundColor:"#fcfcf7"}}'
        
        # Text color changes
        $content = $content -replace 'text-white(?!\s|$)', 'text-gray-800'
        $content = $content -replace 'text-text-white-muted', 'text-gray-600'
        $content = $content -replace 'text-text-white-subtle', 'text-gray-500'
        
        # Hover states
        $content = $content -replace 'hover:text-white', 'hover:text-gray-800'
        
        # Background glass effects
        $content = $content -replace 'bg-white/5', 'bg-gray-100'
        $content = $content -replace 'bg-white/10', 'bg-gray-100'
        $content = $content -replace 'hover:bg-white/5', 'hover:bg-gray-100'
        $content = $content -replace 'hover:bg-white/10', 'hover:bg-gray-100'
        
        # Borders
        $content = $content -replace 'border-white/10', 'border-gray-300'
        $content = $content -replace 'border-white/20', 'border-gray-300'
        
        # Placeholders
        $content = $content -replace 'placeholder-text-white-muted', 'placeholder-gray-500'
        $content = $content -replace 'placeholder:text-text-white-subtle', 'placeholder:text-gray-500'
        
        # Fix background opacity for light theme
        $content = $content -replace 'opacity-30', 'opacity-10'
        $content = $content -replace 'opacity-20', 'opacity-8'
        
        Set-Content $filePath -Value $content
        Write-Host "$page updated successfully"
    }
}

Write-Host "All pages updated!"
