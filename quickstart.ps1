#!/usr/bin/env pwsh
# ═══════════════════════════════════════════════════
# ComicWise Quick Start Script
# ═══════════════════════════════════════════════════

Write-Host "🚀 ComicWise Quick Start" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "📝 Creating .env from .env.example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ Created .env - Please update with your credentials" -ForegroundColor Green
        exit 1
    } else {
        Write-Host "❌ .env.example not found. Please create .env manually." -ForegroundColor Red
        exit 1
    }
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
pnpm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Generate database migrations
Write-Host "🗄️  Generating database migrations..." -ForegroundColor Cyan
pnpm drizzle-kit generate

# Push schema to database
Write-Host "📤 Pushing schema to database..." -ForegroundColor Cyan
pnpm drizzle-kit push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push schema" -ForegroundColor Red
    Write-Host "⚠️  Please check your DATABASE_URL in .env" -ForegroundColor Yellow
    exit 1
}

# Seed database
Write-Host "🌱 Seeding database..." -ForegroundColor Cyan
pnpm tsx src/scripts/seed.ts

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Seeding failed but continuing..." -ForegroundColor Yellow
}

# Start development server
Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Starting development server..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Available commands:" -ForegroundColor Yellow
Write-Host "  pnpm dev          - Start development server" -ForegroundColor Gray
Write-Host "  pnpm build        - Build for production" -ForegroundColor Gray
Write-Host "  pnpm start        - Start production server" -ForegroundColor Gray
Write-Host "  pnpm db:studio    - Open Drizzle Studio" -ForegroundColor Gray
Write-Host "  pnpm db:seed      - Seed database" -ForegroundColor Gray
Write-Host ""

pnpm dev
