# Playwright E2E Test Guidelines

**Applies to:** `/tests/**`

## Goal

Write end-to-end tests that verify user-visible behavior and give confidence that the application works correctly for real users.

## Core Philosophy

> "The more your tests resemble the way your software is used, the more confidence they can give you." — Kent C. Dodds

Follow these official guides:

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles)

## Testing Principles

### Test User-Visible Behavior

- Test what users see and do, not implementation details
- A user doesn't know about Redux state, React hooks, or CSS classes
- A user DOES know about: text on screen, buttons they can click, forms they can fill

### Avoid Implementation Details

**DON'T test:**

- Internal state shape or React component props
- CSS classes or DOM structure
- Function names or variable names
- How many times a function was called

**DO test:**

- Text content visible on the page
- User interactions (click, type, submit)
- Navigation and URL changes
- Form submissions and their results
- Error messages shown to users

### Test Isolation

- Each test should be completely independent
- Don't rely on state from previous tests
- Use `beforeEach` for common setup, not shared state
- Clean up after tests when needed

### Avoid Testing Third-Party Dependencies

- Don't test YouTube's embed player works
- Don't test Firebase's internal behavior
- DO test that YOUR code integrates correctly with these services
- Mock external APIs when testing error scenarios

## Best Practices

### Use Semantic Locators (Priority Order)

1. **Role-based** (best): `page.getByRole('button', { name: 'Submit' })`
2. **Label-based**: `page.getByLabel('Email')`
3. **Placeholder**: `page.getByPlaceholder('Enter email')`
4. **Text**: `page.getByText('Welcome')`
5. **Test ID** (last resort): `page.getByTestId('submit-button')`

```typescript
// ❌ Bad - relies on implementation details
page.locator('.btn-primary.submit-form');
page.locator('button:nth-child(2)');
page.locator('[data-internal-id="xyz"]');

// ✅ Good - user-facing attributes
page.getByRole('button', {name: 'Sign in'});
page.getByLabel('Phone number');
page.getByText('Your library is empty');
```

### Use Web-First Assertions

Always `await` assertions - they auto-retry until the condition is met:

```typescript
// ❌ Bad - doesn't wait, flaky
expect(await page.getByText('Success').isVisible()).toBe(true);

// ✅ Good - auto-retries until visible or timeout
await expect(page.getByText('Success')).toBeVisible();
```

### Prefer Chaining and Filtering

```typescript
// Find the "Add to cart" button inside the "Product 2" list item
await page
  .getByRole('listitem')
  .filter({hasText: 'Product 2'})
  .getByRole('button', {name: 'Add to cart'})
  .click();
```

### One Assertion Per Concept

Don't assert multiple unrelated things. Each test should verify one user story:

```typescript
// ❌ Bad - testing multiple unrelated things
test('page works', async ({page}) => {
  await expect(page.getByText('Title')).toBeVisible();
  await expect(page).toHaveURL('/search');
  await expect(page.getByRole('button')).toHaveCount(5);
});

// ✅ Good - one focused test
test('shows editor after selecting audio', async ({page}) => {
  await selectAudio(page, 'test song');
  await expect(page.getByRole('textbox', {name: /lyrics/i})).toBeVisible();
});
```

### Write Descriptive Test Names

Test names should describe the user behavior being tested:

```typescript
// ❌ Bad
test('test 1', ...);
test('editor works', ...);

// ✅ Good
test('typing lyrics auto-saves after 2 seconds', ...);
test('switching pages preserves unsaved changes', ...);
test('free users see upgrade prompt at 3 page limit', ...);
```

## Test Structure

### Arrange → Act → Assert

```typescript
test('saves lyrics when user types', async ({page}) => {
  // Arrange: Set up the test state
  await signIn(page);
  await selectAudio(page, 'test beat');

  // Act: Perform the user action
  await page.getByRole('textbox', {name: /lyrics/i}).fill('My lyrics');
  await page.waitForTimeout(2500); // Wait for auto-save

  // Assert: Verify the outcome
  await page.reload();
  await expect(page.getByRole('textbox', {name: /lyrics/i})).toHaveValue('My lyrics');
});
```

### Use Page Object Pattern for Complex Flows

```typescript
// helpers/page-screen.ts
export class PageScreenHelper {
  constructor(private page: Page) {}

  async signIn(phone = TEST_PHONE) {
    await this.page.getByRole('button', {name: 'Sign in'}).click();
    await this.page.getByLabel('Phone number').fill(phone);
    await this.page.getByRole('button', {name: 'Send Code'}).click();
    await this.page.getByLabel('Verification code').fill('123456');
  }

  async selectAudio(query: string) {
    await this.page.getByPlaceholder(/artist/i).fill(query);
    await this.page.getByPlaceholder(/artist/i).press('Enter');
    await this.page.getByTestId('audio-item').first().click();
  }

  get editor() {
    return this.page.getByRole('textbox', {name: /lyrics/i});
  }

  get title() {
    return this.page.getByRole('textbox', {name: /title/i});
  }
}
```

## What NOT to Test

### Implementation Details

```typescript
// ❌ Don't test internal state
expect(component.state.isLoading).toBe(false);
expect(useSaveHook).toHaveBeenCalledWith({body: 'test'});

// ❌ Don't test CSS classes
expect(button.className).toContain('active');

// ❌ Don't test DOM structure
expect(container.children.length).toBe(3);
```

### Third-Party Library Behavior

```typescript
// ❌ Don't test that YouTube player plays video
// ✅ DO test that your app shows the player when audio is selected
```

### Every Possible Edge Case

Focus on the critical user paths. Not every code path needs an E2E test - some are better as unit tests.

## Debugging

### Local Debugging

```bash
# Run with UI mode
npx playwright test --ui

# Run specific test in debug mode
npx playwright test pagescreen.spec.ts:42 --debug

# Run with trace on
npx playwright test --trace on
```

### CI Debugging

Enable trace on first retry in `playwright.config.ts`:

```typescript
use: {
  trace: 'on-first-retry',
}
```

## Checklist Before Commit

- [ ] Tests verify user-visible behavior, not implementation details
- [ ] Each test is independent and doesn't rely on others
- [ ] Test names clearly describe the user story being tested
- [ ] Using semantic locators (role, label, text) over CSS/test IDs
- [ ] All assertions use `await` with web-first matchers
- [ ] No flaky `waitForTimeout` without good reason (document why)
- [ ] External APIs are mocked for error scenario tests
- [ ] Tests pass in isolation and when run together

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Kent C. Dodds: Write Tests](https://kentcdodds.com/blog/write-tests)
- [Kent C. Dodds: Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details)
- [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles)
