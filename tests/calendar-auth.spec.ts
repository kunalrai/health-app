import { test, expect } from '@playwright/test';

test('Google Calendar auth redirect', async ({ page }) => {
  const response = await page.goto('http://localhost:3000/api/calendar/auth');
  
  const url = page.url();
  console.log('Final URL:', url);
  console.log('Status:', response?.status());
  
  if (url.includes('accounts.google.com')) {
    console.log('SUCCESS: Redirected to Google OAuth consent screen');
    console.log('Auth URL:', url);
  } else {
    console.log('Page content preview:', await page.content().catch(() => 'Could not get content'));
  }
});
