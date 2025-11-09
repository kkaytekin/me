#!/bin/bash

# Script to test PDF generation locally

echo "==================================="
echo "Testing PDF Generation Locally"
echo "==================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Playwright..."
    npm install playwright
    echo ""
fi

# Check if Playwright browsers are installed
if ! npx playwright --version &> /dev/null; then
    echo "🌐 Installing Playwright browsers..."
    npx playwright install chromium --with-deps
    echo ""
fi

# Run the PDF generation
echo "🚀 Generating PDF..."
node generate-pdf.js

# Check if PDF was created
if [ -f "cv.pdf" ]; then
    echo ""
    echo "✅ PDF generated successfully!"
    echo "📄 Location: $(pwd)/cv.pdf"
    echo ""

    # Show file size
    size=$(du -h cv.pdf | cut -f1)
    echo "📊 File size: $size"
    echo ""

    # Try to open the PDF (platform-specific)
    if command -v xdg-open &> /dev/null; then
        echo "🔍 Opening PDF with default viewer..."
        xdg-open cv.pdf 2>/dev/null &
    elif command -v open &> /dev/null; then
        echo "🔍 Opening PDF with default viewer..."
        open cv.pdf 2>/dev/null &
    else
        echo "💡 Manual step: Open cv.pdf to view the result"
    fi
else
    echo ""
    echo "❌ PDF generation failed!"
    exit 1
fi
