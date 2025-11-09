const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch();

  const context = await browser.newContext({
    viewport: { width: 794, height: 1123 }, // A4 size: 96 DPI
    deviceScaleFactor: 2
  });

  const page = await context.newPage();

  // Load the HTML file
  const htmlPath = 'file://' + path.resolve('index.html');
  console.log('Loading page:', htmlPath);
  await page.goto(htmlPath, { waitUntil: 'networkidle' });

  // Hide timeline section and reorder sections
  await page.evaluate(() => {
    // Hide timeline section
    const timelineSection = document.getElementById('timeline');
    if (timelineSection) {
      timelineSection.style.display = 'none';
    }

    // Reorder sections
    const aboutSection = document.getElementById('about');
    const educationSection = document.getElementById('education');
    const experienceSection = document.getElementById('experience');
    const projectsSection = document.getElementById('projects');
    
    const parent = aboutSection.parentNode;
    
    // Reorder sections: About -> Education -> Experience -> Projects
    if (aboutSection && educationSection && experienceSection && projectsSection) {
      parent.insertBefore(educationSection, aboutSection.nextSibling);
      parent.insertBefore(experienceSection, projectsSection);
    }
  });

  // Wait for page to update
  await page.waitForTimeout(1000);

  // Generate PDF
  console.log('Generating PDF...');
  await page.pdf({
    path: 'cv.pdf',
    format: 'A4',
    printBackground: false,
    margin: {
      top: '0.5cm',
      right: '0.5cm',
      bottom: '0.5cm',
      left: '0.5cm'
    },
    scale: 0.5
  });

  await browser.close();
  console.log('PDF generated successfully!');
})();
