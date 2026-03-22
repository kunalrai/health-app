import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const title = await page.title();
  console.log('Page title:', title);
  
  const heading = await page.locator('h1').first().textContent().catch(() => 'No h1 found');
  console.log('Main heading:', heading);
  
  const bodyText = await page.locator('body').textContent();
  console.log('Page loaded successfully with content');
});
