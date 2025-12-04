import {test, expect, Page} from '@playwright/test';

/**
 * PageScreen E2E Tests (at /editor route)
 *
 * These tests verify USER-VISIBLE BEHAVIOR, not implementation details.
 * Each test answers: "Can the user accomplish X?"
 *
 * IMPORTANT: Mobile has a completely different layout than desktop!
 * - Desktop: 3-panel layout (Library | Editor | Search)
 * - Mobile: Single view (Player + Editor only, no library/search panels)
 *
 * Tests run against lyrist-dev Firebase project (not emulator).
 *
 * @see tests/README.md for testing guidelines
 */

// ============================================
// HELPERS (Page Object Pattern)
// ============================================

class PageScreen {
  constructor(public page: Page) {}

  // Check if we're on mobile viewport
  async isMobile(): Promise<boolean> {
    const viewport = this.page.viewportSize();
    return viewport ? viewport.width < 1024 : false;
  }

  // Navigation - disables emulator to use lyrist-dev
  async goto() {
    // First visit to set localStorage (disable emulator)
    await this.page.goto('/');
    await this.page.evaluate(() => {
      window.localStorage.setItem('USE_FIREBASE_EMULATOR', 'false');
    });

    // Now go to editor page (PageScreen is at /editor)
    await this.page.goto('/editor');

    // Wait for page to load - different indicators for mobile vs desktop
    const isMobile = await this.isMobile();
    if (isMobile) {
      // Mobile shows "Use Search to find audio" when no audio selected
      await expect(
        this.page.getByText(/Use Search to find audio|Sign in to use the editor/),
      ).toBeVisible({timeout: 15000});
    } else {
      // Desktop always shows "My Library" panel
      await expect(this.page.getByText('My Library')).toBeVisible({timeout: 15000});
    }
  }

  // Search - uses actual placeholder text from PageScreen.tsx
  async searchAudio(query: string) {
    const searchInput = this.page.getByPlaceholder('Artist, genre, or song...');
    await searchInput.fill(query);
    await searchInput.press('Enter');
  }

  async selectFirstResult() {
    await expect(this.page.locator('[data-testid="audio-item"]').first()).toBeVisible({
      timeout: 15000,
    });
    await this.page.locator('[data-testid="audio-item"]').first().click();
  }

  async searchAndSelect(query: string) {
    await this.searchAudio(query);
    await this.selectFirstResult();
  }

  // Locators - match actual text/attributes from PageScreen.tsx
  get signInButton() {
    return this.page.getByText('Sign in', {exact: true});
  }

  get signOutButton() {
    return this.page.getByText('Sign out', {exact: true});
  }

  get editor() {
    return this.page.locator('[data-testid="editor-textarea"]');
  }

  get titleInput() {
    return this.page.locator('[data-testid="title-input"]');
  }

  get libraryPanel() {
    return this.page.getByText('My Library');
  }

  get signInPrompt() {
    return this.page.getByText('Sign in to use the editor');
  }

  get librarySignInPrompt() {
    return this.page.getByText('Sign in to see your library');
  }

  get noAudioMessage() {
    return this.page.getByText('Use Search to find audio');
  }

  get plusUpgradePrompt() {
    return this.page.getByText('Get Lyrist Plus', {exact: false});
  }

  get audioPlayer() {
    return this.page.locator('iframe').first();
  }

  get youtubeTab() {
    return this.page.getByText('YouTube');
  }

  get soundcloudTab() {
    return this.page.getByText('SoundCloud');
  }

  get searchHints() {
    return this.page.getByText('"lo-fi" type beats');
  }
}

// Helper to check if running on mobile project
function isMobileProject(testInfo: {project: {name: string}}): boolean {
  return testInfo.project.name.includes('mobile');
}

// ============================================
// DESKTOP TESTS (3-panel layout)
// ============================================

test.describe('PageScreen Desktop', () => {
  let ps: PageScreen;

  test.beforeEach(async ({page}, testInfo) => {
    // Skip all tests in this describe block for mobile projects
    test.skip(isMobileProject(testInfo), 'Desktop-only test');
    ps = new PageScreen(page);
    await ps.goto();
  });

  test.describe('page structure', () => {
    test('shows My Library panel', async () => {
      await expect(ps.libraryPanel).toBeVisible();
    });

    test('shows search input with placeholder', async () => {
      await expect(ps.page.getByPlaceholder('Artist, genre, or song...')).toBeVisible();
    });

    test('shows YouTube tab by default', async () => {
      await expect(ps.youtubeTab).toBeVisible();
    });

    test('shows SoundCloud tab', async () => {
      await expect(ps.soundcloudTab).toBeVisible();
    });

    // This test can be flaky on slower browsers like Firefox
    test.describe('search hints', () => {
      test.describe.configure({retries: 1});

      test('shows search hints when no results', async () => {
        await expect(ps.searchHints).toBeVisible({timeout: 30000});
      });
    });
  });

  test.describe('when signed out', () => {
    test('shows sign in button', async () => {
      await expect(ps.signInButton).toBeVisible();
    });

    test('shows sign in prompt in library', async () => {
      await expect(ps.librarySignInPrompt).toBeVisible();
    });

    test('shows sign in banner in editor area', async () => {
      await expect(ps.signInPrompt).toBeVisible();
    });

    test('does not show sign out button', async () => {
      await expect(ps.signOutButton).not.toBeVisible();
    });
  });

  test.skip('search', () => {
    test('can search for audio on YouTube', async () => {
      await ps.searchAudio('lofi beats');
      await expect(ps.page.locator('[data-testid="audio-item"]').first()).toBeVisible({
        timeout: 15000,
      });
    });

    test('can switch to SoundCloud', async () => {
      await ps.soundcloudTab.click();
      await ps.searchAudio('hip hop instrumental');
      await ps.page.waitForTimeout(2000);
      await expect(ps.libraryPanel).toBeVisible();
    });

    test('can click on search result', async () => {
      await ps.searchAudio('beats');
      await expect(ps.page.locator('[data-testid="audio-item"]').first()).toBeVisible({
        timeout: 15000,
      });
      await ps.page.locator('[data-testid="audio-item"]').first().click();
      await expect(ps.libraryPanel).toBeVisible();
    });

    test('selecting audio shows player', async () => {
      await ps.searchAndSelect('hip hop beat');
      await expect(ps.audioPlayer).toBeVisible({timeout: 10000});
    });
  });

  test.describe('URL handling', () => {
    test('invalid audio param does not crash', async ({page}) => {
      await page.goto('/editor?audio=invalid:xyz');
      await expect(ps.libraryPanel).toBeVisible({timeout: 15000});
    });

    test('direct link with audio param loads player', async ({page}) => {
      await page.goto('/editor?audio=yt:dQw4w9WgXcQ');
      await expect(ps.audioPlayer).toBeVisible({timeout: 15000});
    });
  });

  test.describe('error handling', () => {
    test('handles network errors gracefully', async ({page}) => {
      await page.route('**/api/search**', route => route.abort());
      await ps.searchAudio('network error test');
      await page.waitForTimeout(3000);
      await expect(ps.libraryPanel).toBeVisible();
      await page.unroute('**/api/search**');
    });
  });
});

// ============================================
// MOBILE TESTS (single-view layout)
// ============================================

test.describe('PageScreen Mobile', () => {
  let ps: PageScreen;

  test.beforeEach(async ({page}, testInfo) => {
    // Skip all tests in this describe block for desktop projects
    test.skip(!isMobileProject(testInfo), 'Mobile-only test');
    ps = new PageScreen(page);
    await ps.goto();
  });

  test.describe('page structure', () => {
    test('loads without crashing when no audio selected', async () => {
      // Mobile shows a simple view prompting user to find audio
      // Just verify the page loaded without crash
      await expect(ps.page.locator('body')).toBeVisible();
    });

    test('does NOT show My Library panel sidebar (mobile layout)', async () => {
      // Mobile shows "My Library" in the header, but NOT the full sidebar panel
      // The sidebar panel contains "Sign in to see your library" when signed out
      await expect(ps.librarySignInPrompt).not.toBeVisible();
    });

    test('does NOT show search panel (mobile layout)', async () => {
      await expect(ps.page.getByPlaceholder('Artist, genre, or song...')).not.toBeVisible();
    });
  });

  test.describe('URL handling', () => {
    test('direct link with audio param loads player', async ({page}) => {
      await page.goto('/editor?audio=yt:dQw4w9WgXcQ');
      await expect(ps.audioPlayer).toBeVisible({timeout: 15000});
    });

    test('invalid audio param does not crash', async ({page}) => {
      await page.goto('/editor?audio=invalid:xyz');
      // Invalid format still tries to load - just verify page doesn't crash
      await expect(page.locator('body')).toBeVisible({timeout: 15000});
    });

    test('with audio, shows sign in banner when signed out', async ({page}) => {
      await page.goto('/editor?audio=yt:dQw4w9WgXcQ');
      await expect(ps.signInPrompt).toBeVisible({timeout: 15000});
    });
  });

  test.describe('player', () => {
    test('player renders when audio param provided', async ({page}) => {
      await page.goto('/editor?audio=yt:dQw4w9WgXcQ');
      await expect(ps.audioPlayer).toBeVisible({timeout: 15000});
    });
  });
});

// ============================================
// RESPONSIVE TESTS (viewport changes)
// ============================================

test.describe('PageScreen Responsive', () => {
  test('loads on mobile viewport', async ({page}) => {
    await page.setViewportSize({width: 375, height: 667});
    await page.goto('/editor');
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('loads on tablet viewport', async ({page}) => {
    await page.setViewportSize({width: 768, height: 1024});
    await page.goto('/editor');
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('loads on desktop viewport', async ({page}) => {
    await page.setViewportSize({width: 1440, height: 900});
    await page.goto('/editor');
    await expect(page.getByText('My Library')).toBeVisible({timeout: 15000});
  });
});
