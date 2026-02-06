# commit_separately.ps1

# 1. Reset the previous commit (mixed/soft) to keep changes but undo the commit
git reset --soft HEAD~1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Reset failed (maybe no commit to reset). Continuing with current status."
}

# 2. Unstage everything to add files one by one
git reset

# 3. Handle modified/added files
$status = git status -uall --porcelain
foreach ($line in $status) {
    # porcelain format: "XY filename" (e.g. " M file.txt" or "?? newfile.txt")
    # Substring(3) gets the filename
    $file = $line.Substring(3).Trim()
    
    # Skip empty lines
    if ([string]::IsNullOrWhiteSpace($file)) { continue }
    
    # Clean quotes if present (git status might quote filenames with spaces)
    $file = $file.Trim('"')

    Write-Host "Committing: $file"
    git add "$file"
    git commit -m "feat: Update $file for collaboration UI"
}

# 4. Push to feature branch
Write-Host "Pushing to feature/collaboration..."
git push origin feature/collaboration
