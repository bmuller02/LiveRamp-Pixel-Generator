import { test, expect } from '@playwright/test';

test.describe('New Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Site Pixel Custom Event Name and Optional Value', async ({ page }) => {
    // Step 1: LiveRamp ID
    await page.getByPlaceholder('Enter 6-digit ID').fill('123456');
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 2: Pixel Type
    await page.getByText('Site Pixel').click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 3: Site Config
    // Test Custom Event Name
    const eventNameSelect = page.locator('select').nth(1); // Assuming second select is Event Name
    await eventNameSelect.selectOption('custom');
    
    const customInput = page.getByPlaceholder('Enter custom event name');
    await expect(customInput).toBeVisible();
    await customInput.fill('my_custom_event');

    // Test Optional Event Value (Leave empty first)
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 4: Advertiser
    await page.getByPlaceholder('Enter advertiser name').fill('TestAdvertiser');
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 5: Summary
    // Verify Event Name in Summary
    await expect(page.getByText('view / my_custom_event')).toBeVisible();

    // Verify Pixel Code (No eventvalue)
    const pixelCode = page.locator('code').nth(1); // Second code block
    await expect(pixelCode).toContainText('eventname=my_custom_event');
    await expect(pixelCode).not.toContainText('eventvalue=');

    // Go back and add event value
    await page.getByRole('button', { name: 'Back' }).click(); // Back to Step 4
    await page.getByRole('button', { name: 'Back' }).click(); // Back to Step 3

    await page.getByPlaceholder('e.g. 1.00, true, product_id').fill('9.99');
    await page.getByRole('button', { name: 'Next' }).click(); // To Step 4
    await page.getByRole('button', { name: 'Next' }).click(); // To Step 5

    // Verify Pixel Code (With eventvalue)
    await expect(pixelCode).toContainText('eventvalue=9.99');
  });

  test('Email Button on Summary Page', async ({ page }) => {
    // Fast forward to Summary
    await page.getByPlaceholder('Enter 6-digit ID').fill('123456');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByText('Site Pixel').click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click(); // Default site config
    await page.getByPlaceholder('Enter advertiser name').fill('TestAdvertiser');
    await page.getByRole('button', { name: 'Next' }).click();

    // Check Email Button
    const emailLink = page.getByRole('link', { name: 'Email Platform Solutions' });
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute('href', 'mailto:platformsolutions@horizonmedia.com?subject=New LiveRamp pixel created from generator');
    
    // Check text
    await expect(page.getByText('If you plan to implement this pixel')).toBeVisible();
  });
});
