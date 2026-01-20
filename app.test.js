import { test, expect } from '@playwright/test';

test.describe('Social Media Content Generator - Application Launch Test', () => {
  
  test('application loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/Generátor obsahu pro sociální sítě/);
    
    // Check main heading
    await expect(page.getByRole('heading', { name: /Generátor obsahu pro sociální sítě/ })).toBeVisible();
  });

  test('form is present with all required fields', async ({ page }) => {
    await page.goto('/');
    
    // Check all form fields are present
    await expect(page.getByRole('textbox', { name: /Téma příspěvku/ })).toBeVisible();
    await expect(page.getByLabel(/Platforma/)).toBeVisible();
    await expect(page.getByLabel(/Tón příspěvku/)).toBeVisible();
    await expect(page.getByLabel(/Délka příspěvku/)).toBeVisible();
    
    // Check submit button
    await expect(page.getByRole('button', { name: /Generovat obsah/ })).toBeVisible();
  });

  test('form validation works', async ({ page }) => {
    await page.goto('/');
    
    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /Generovat obsah/ });
    await submitButton.click();
    
    // Form should not submit (validation should prevent it)
    // The result container should not be visible
    const resultContainer = page.locator('#result');
    await expect(resultContainer).toBeHidden();
  });

  test('content generation works end-to-end', async ({ page }) => {
    await page.goto('/');

    // Fill in the form
    await page.getByRole('textbox', { name: /Téma příspěvku/ }).fill('Test topic');
    await page.getByLabel(/Platforma/).selectOption('facebook');
    await page.getByLabel(/Tón příspěvku/).selectOption('friendly');
    await page.getByLabel(/Délka příspěvku/).selectOption('short');
    await page.getByLabel(/STDC fáze/).selectOption('see');

    // Submit form
    await page.getByRole('button', { name: /Generovat obsah/ }).click();

    // Wait for content to be generated (with timeout for mock delay)
    await page.waitForSelector('#result', { state: 'visible', timeout: 5000 });

    // Check that generated content is visible
    const generatedContent = page.locator('#generatedContent');
    await expect(generatedContent).toBeVisible();
    await expect(generatedContent).toContainText('Test topic');
  });

  test('copy button works', async ({ page }) => {
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto('/');

    // Fill and submit form
    await page.getByRole('textbox', { name: /Téma příspěvku/ }).fill('Copy test');
    await page.getByLabel(/Platforma/).selectOption('instagram');
    await page.getByLabel(/Tón příspěvku/).selectOption('professional');
    await page.getByLabel(/Délka příspěvku/).selectOption('medium');
    await page.getByLabel(/STDC fáze/).selectOption('think');
    await page.getByRole('button', { name: /Generovat obsah/ }).click();

    // Wait for content
    await page.waitForSelector('#result', { state: 'visible', timeout: 5000 });

    // Click copy button
    await page.getByRole('button', { name: /Zkopírovat/ }).click();

    // Check for success message
    await expect(page.locator('.success-message')).toBeVisible();
    await expect(page.locator('.success-message')).toContainText(/zkopírován/);
  });

  test('reset button works', async ({ page }) => {
    await page.goto('/');
    
    // Fill in the form
    await page.getByRole('textbox', { name: /Téma příspěvku/ }).fill('Reset test');
    await page.getByLabel(/Platforma/).selectOption('twitter');
    
    // Click reset button
    await page.getByRole('button', { name: /Vymazat formulář/ }).click();
    
    // Check that form is cleared
    await expect(page.getByRole('textbox', { name: /Téma příspěvku/ })).toHaveValue('');
  });

  test('responsive design - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that page still loads and is usable
    await expect(page.getByRole('heading', { name: /Generátor obsahu/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Generovat obsah/ })).toBeVisible();
  });

});
