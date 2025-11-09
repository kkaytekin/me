# PDF Generation Testing Guide

This guide helps you test and fine-tune the PDF generation locally before pushing to GitHub.

## Quick Start

### Option 1: Using the test script (Linux/Mac)

```bash
./test-pdf.sh
```

This will:
- Install Playwright if needed
- Generate the PDF
- Open it automatically

### Option 2: Using npm (All platforms)

```bash
# Install dependencies
npm install

# Install Playwright browsers (only needed once)
npm run install-browsers

# Generate PDF
npm run test-pdf
```

### Option 3: Manual execution

```bash
# Install Playwright
npm install playwright

# Install chromium browser
npx playwright install chromium --with-deps

# Run the generator
node generate-pdf.js
```

## Fine-Tuning the PDF

Edit `generate-pdf.js` to customize the PDF output:

### Adjust Page Size

```javascript
await page.pdf({
  format: 'A4',        // Options: 'Letter', 'Legal', 'A3', 'A4', 'A5'
  // OR use custom dimensions:
  // width: '8.5in',
  // height: '11in',
  ...
});
```

### Change Margins

```javascript
margin: {
  top: '0.5cm',      // Adjust these values
  right: '0.5cm',    // Options: 'cm', 'mm', 'in', 'px'
  bottom: '0.5cm',
  left: '0.5cm'
}
```

### Adjust Viewport (affects rendering)

```javascript
const context = await browser.newContext({
  viewport: {
    width: 1920,     // Larger = more content fits
    height: 1080
  },
  deviceScaleFactor: 2  // Higher = sharper (1-3 recommended)
});
```

### Increase Wait Time (for slow-loading content)

```javascript
// Wait for mermaid diagram to render
await page.waitForTimeout(3000);  // Increase if timeline doesn't render
```

### Add Page Numbering

```javascript
await page.pdf({
  ...
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: `
    <div style="font-size: 10px; text-align: center; width: 100%;">
      Page <span class="pageNumber"></span> of <span class="totalPages"></span>
    </div>
  `,
  ...
});
```

### Preview Before Generating (useful for debugging)

Add before `page.pdf()`:

```javascript
// Take a screenshot to see what will be in PDF
await page.screenshot({
  path: 'preview.png',
  fullPage: true
});
console.log('Preview saved as preview.png');
```

### Wait for Specific Elements

```javascript
// Wait for a specific element to load
await page.waitForSelector('.mermaid svg', { timeout: 5000 });
```

## Common Issues & Solutions

### PDF is blank or incomplete
- Increase wait time: `await page.waitForTimeout(5000);`
- Check console output for errors

### Timeline diagram missing
- Increase timeout to 5-10 seconds
- Check if mermaid CDN loads properly
- Add: `await page.waitForSelector('.mermaid svg');`

### Images missing in PDF
- Ensure `printBackground: true` is set
- Check that images are local or CDN is accessible
- Add longer wait time for image loading

### Text is cut off
- Reduce `deviceScaleFactor` (try 1.5 instead of 2)
- Adjust margins
- Use landscape orientation: `landscape: true`

### Colors don't appear
- Already handled in CSS with `print-color-adjust: exact`
- Ensure `printBackground: true` in pdf options

## Testing Workflow

1. Make changes to `generate-pdf.js`
2. Run `./test-pdf.sh` or `npm run test-pdf`
3. Review the generated `cv.pdf`
4. Iterate until satisfied
5. Commit and push changes

## Files Involved

- `generate-pdf.js` - Main PDF generation script
- `index.html` - Your CV website (contains print CSS)
- `.github/workflows/generate-pdf.yml` - GitHub Actions workflow
- `package.json` - Node.js dependencies

## Advanced: Debugging

### See what Playwright sees

```javascript
const browser = await chromium.launch({
  headless: false,  // Show browser window
  slowMo: 1000      // Slow down operations
});
```

### Print page content for debugging

```javascript
const content = await page.content();
console.log(content);
```

### Check for JavaScript errors

```javascript
page.on('console', msg => console.log('PAGE LOG:', msg.text()));
page.on('pageerror', error => console.log('PAGE ERROR:', error));
```
