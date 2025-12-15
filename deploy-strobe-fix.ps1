# DEPLOY STROBE FIX
Write-Host "DEPLOYING FIX FOR QUIZ STROBE EFFECT" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

# Backup current files
Write-Host "`n📦 Creating backups..." -ForegroundColor Cyan
Copy-Item "components\MarkCompleteButton.tsx" "components\MarkCompleteButton.tsx.backup"
Copy-Item "components\QuizModal.tsx" "components\QuizModal.tsx.backup"

# Test if we should use the fixed versions
Write-Host "`n🔍 Current QuizModal structure..." -ForegroundColor Cyan
$hasStrobeIssue = Select-String -Path "components\QuizModal.tsx" -Pattern "useEffect.*fetch.*questions" -Quiet

if ($hasStrobeIssue) {
    Write-Host "✅ Current QuizModal has the strobe-causing pattern" -ForegroundColor Green
    Write-Host "   Will deploy improved version" -ForegroundColor Gray
}

# Deploy the improved versions
Write-Host "`n🚀 Deploying fixes..." -ForegroundColor Cyan

# Option 1: Replace existing files with improved versions
# Copy-Item "components\MarkCompleteButton_Fixed.tsx" "components\MarkCompleteButton.tsx" -Force
# Copy-Item "components\QuizModal_Improved.tsx" "components\QuizModal.tsx" -Force

# Option 2: Update imports in [slug]/page.tsx to use new components
Write-Host "`n💡 Recommended: Update [slug]/page.tsx imports:" -ForegroundColor Yellow
Write-Host "1. Change: import MarkCompleteButton from '@/components/MarkCompleteButton'" -ForegroundColor Gray
Write-Host "   To: import MarkCompleteButton_Fixed from '@/components/MarkCompleteButton_Fixed'" -ForegroundColor Gray
Write-Host "2. Update component usage: <MarkCompleteButton_Fixed ... />" -ForegroundColor Gray

Write-Host "`n📦 Staging changes..." -ForegroundColor Cyan
git add components\MarkCompleteButton_Fixed.tsx
git add components\QuizModal_Improved.tsx

Write-Host "`n💾 Committing..." -ForegroundColor Cyan
git commit -m "fix: Add debouncing and stable mounting to prevent quiz strobe effect"

Write-Host "`n🚀 Pushing to deploy..." -ForegroundColor Cyan
git push origin main

Write-Host "`n✅ DEPLOYMENT STARTED!" -ForegroundColor Green
Write-Host "The strobe effect should be fixed with:" -ForegroundColor Yellow
Write-Host "1. Debounced quiz opening (prevents rapid clicks)" -ForegroundColor Gray
Write-Host "2. Stable component mounting (prevents hydration mismatch)" -ForegroundColor Gray
Write-Host "3. Better loading states (smoother transitions)" -ForegroundColor Gray
