import {test, expect, Page} from '@playwright/test';

/**
 * Lyrist E2E Tests - User Flows
 *
 * Tests real user journeys across the app.
 * All tests run on all browsers (desktop + mobile).
 * Uses lyrist-dev Firebase project (not emulator).
 */

// Set Firebase to use lyrist-dev (not emulator) for all tests
test.beforeEach(async ({page}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('USE_FIREBASE_EMULATOR', 'false');
  });
});

// ============================================
// LANDING PAGE FLOW
// ============================================

test.describe('Landing Page', () => {
  test('user can view landing page with header and pricing section', async ({page}) => {
    await page.goto('/');

    // Header loads - logo alt varies by viewport
    await expect(page.getByRole('img', {name: /Lyrist/}).first()).toBeVisible({timeout: 15000});
    await expect(page.getByText('Sign in')).toBeVisible();

    // Pricing section exists (scroll to it)
    const pricingButton = page.getByText('Start 3-day free trial');
    await pricingButton.scrollIntoViewIfNeeded();
    await expect(pricingButton).toBeVisible();
    await expect(page.getByText('$9.99')).toBeVisible();
  });

  test('user can open auth modal', async ({page}) => {
    await page.goto('/');
    await expect(page.getByText('Sign in')).toBeVisible({timeout: 15000});

    await page.getByText('Sign in').click();

    // Auth modal appears with input field
    await expect(page.locator('input').first()).toBeVisible({timeout: 5000});
  });

  test('user can navigate to pricing via Plus link', async ({page}) => {
    await page.goto('/');
    await expect(page.getByText('Plus')).toBeVisible({timeout: 15000});

    await page.getByText('Plus').click();

    // Pricing section becomes visible after scroll
    await expect(page.getByText('Take your songwriting to the next level')).toBeVisible({timeout: 5000});
  });

  test('user can access footer links', async ({page}) => {
    await page.goto('/');

    // Scroll to footer
    const footer = page.getByText('© 2025 Lyrist');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible({timeout: 15000});

    // FAQ link works - wait for navigation to complete
    await page.getByRole('link', {name: 'FAQ'}).click();
    await page.waitForURL(/\/faq/, {timeout: 10000});
  });
});

// ============================================
// SEARCH FLOW
// ============================================

test.describe('Search', () => {
  test('user can access search page and see platform tabs', async ({page}) => {
    await page.goto('/search');

    // Platform tabs visible on all devices
    await expect(page.getByText('YouTube')).toBeVisible({timeout: 15000});
    await expect(page.getByText('SoundCloud')).toBeVisible();
  });

  test('user can switch between platforms', async ({page}) => {
    await page.goto('/search');
    await expect(page.getByText('YouTube')).toBeVisible({timeout: 15000});

    await page.getByText('SoundCloud').click();
    await expect(page).toHaveURL(/plat=soundcloud/);

    await page.getByText('YouTube').click();
    await expect(page).toHaveURL(/plat=youtube/);
  });
});

// ============================================
// EDITOR FLOW
// ============================================

test.describe('Editor', () => {
  test('editor loads with YouTube audio parameter', async ({page}) => {
    await page.goto('/editor?audio=yt:dQw4w9WgXcQ');

    // Editor layout visible with library panel
    await expect(page.getByText('My Library')).toBeVisible({timeout: 15000});

    // YouTube iframe should be present
    await expect(page.frameLocator('iframe').first().locator('body')).toBeVisible({timeout: 10000});
  });

  test('editor handles missing audio gracefully', async ({page}) => {
    await page.goto('/editor');

    // Page loads with prompt to search for audio (text varies by layout)
    await expect(page.getByText(/Use Search to find audio/)).toBeVisible({timeout: 15000});
  });
});

// ============================================
// LIBRARY FLOW
// ============================================

test.describe('Library', () => {
  test('library page loads and shows My Library', async ({page}) => {
    await page.goto('/library');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText('My Library').first()).toBeVisible({timeout: 5000});
  });
});

// ============================================
// PRICING FLOW
// ============================================

test.describe('Pricing', () => {
  test('pricing page shows all plan options', async ({page}) => {
    await page.goto('/pricing');

    await expect(page.getByText('$2.99')).toBeVisible({timeout: 15000});
    await expect(page.getByText('$9.99')).toBeVisible();
    await expect(page.getByText('$69.99')).toBeVisible();
  });

  test('pricing page shows benefits', async ({page}) => {
    await page.goto('/pricing');

    await expect(page.getByText('Unlimited pages')).toBeVisible({timeout: 15000});
  });

  test('subscribe button opens auth when signed out', async ({page}) => {
    await page.goto('/pricing');

    await expect(page.getByText('Start 3-day free trial')).toBeVisible({timeout: 15000});
    await page.getByText('Start 3-day free trial').click();

    // Auth modal should appear
    await expect(page.locator('input').first()).toBeVisible({timeout: 5000});
  });
});

// ============================================
// NAVIGATION FLOW
// ============================================

test.describe('Navigation', () => {
  test('user can navigate to main app pages', async ({page}) => {

    // Landing - logo alt varies by viewport
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('img', {name: /Lyrist/}).first()).toBeVisible({timeout: 15000});

    // Pricing
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('$9.99')).toBeVisible({timeout: 15000});

    // Search
    await page.goto('/search');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('YouTube')).toBeVisible({timeout: 15000});

    // Library
    await page.goto('/library');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('My Library').first()).toBeVisible({timeout: 15000});
  });

  test('logo navigates to home', async ({page}) => {
    await page.goto('/search');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('YouTube')).toBeVisible({timeout: 15000});

    // Logo alt text varies: "Lyrist - Songwriting App Logo" on landing, "Lyrist logo" in app
    await page.getByRole('link', {name: /Lyrist/}).first().click();
    await page.waitForURL('/', {timeout: 10000});
  });

  test('deep links work', async ({page}) => {
    await page.goto('/search?q=test&plat=soundcloud');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('SoundCloud').first()).toBeVisible({timeout: 5000});
  });
});

// ============================================
// STATIC PAGES
// ============================================

test.describe('Static Pages', () => {
  test('FAQ page loads', async ({page}) => {
    await page.goto('/faq');
    await expect(page.locator('body')).toBeVisible({timeout: 15000});
  });

  test('Privacy page loads', async ({page}) => {
    await page.goto('/privacy');
    await expect(page.locator('body')).toBeVisible({timeout: 15000});
  });

  test('Terms page loads', async ({page}) => {
    await page.goto('/terms');
    await expect(page.locator('body')).toBeVisible({timeout: 15000});
  });
});
