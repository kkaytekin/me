const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch();

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();

  // Load the HTML file
  const htmlPath = 'file://' + path.resolve('index.html');
  console.log('Loading page:', htmlPath);
  await page.goto(htmlPath, { waitUntil: 'networkidle' });

  // Wait for mermaid diagram to render
  console.log('Waiting for page to fully render...');
  await page.waitForTimeout(3000);

  // Generate PDF
  console.log('Generating PDF...');
  await page.pdf({
    path: 'cv.pdf',
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0.5cm',
      right: '0.5cm',
      bottom: '0.5cm',
      left: '0.5cm'
    }
  });

  await browser.close();
  console.log('PDF generated successfully!');
})();
