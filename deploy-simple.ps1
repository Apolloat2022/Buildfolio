# DEPLOYMENT COMMANDS
Write-Host "🚀 Deploying Certificate System..." -ForegroundColor Green

# Check status
git status

# Add changes
git add .

# Commit
git commit -m "feat: Add certificate system integration"

# Push to deploy
git push origin main

Write-Host "`n✅ Deployment started!" -ForegroundColor Green
Write-Host "⏱️  Wait 2-3 minutes for Vercel" -ForegroundColor Yellow
Write-Host "`n🎯 Test: https://buildfolio.tech/projects/ecommerce-store" -ForegroundColor Cyan
