## Principles

**Validate assumptions before coding**

- Reproduce the bug path first (refresh vs navigation, mobile vs desktop)
- Add minimal instrumentation to confirm hypothesis before implementing fix

**Trace symptoms to root causes**

- "Text shrinks on reload" signals hydration; "works after navigation" confirms client-only code path
- Error messages in UI often originate from upstream API or encoding issues, not the visible component

**Platform-aware abstraction**

- Logic that depends on runtime environment (window size, device APIs) should branch early by platform
- Web and native have different defaults; scaling utilities designed for mobile often break SSR

**Component reuse over duplication**

- When the same UI appears in multiple contexts, extend the original component with internal conditions
- Avoid prop proliferation; prefer hooks that encapsulate context detection

**Test architecture mirrors product architecture**

- Separate test suites by platform/viewport to match divergent user experiences
- Selectors must target semantically unique content, not incidental text matches

**Resilience in async operations**

- Use waitUntil: 'domcontentloaded' for faster, more stable navigation in SPAs
- Flaky tests need both retries and extended timeouts; one alone is insufficient

**Layout debugging heuristics**

- Unequal spacing often means non-content elements (dividers, icons) are inside flex containers
- flex:1 on siblings guarantees equal distribution; nested wrappers break this

**API hygiene**

- Always encode user input in query strings
- Use framework-native request parsing (nextUrl.searchParams) over manual URL construction

**Incremental verification**

- After each fix, rerun the failing case before moving to the next issue
- Small, isolated changes are easier to validate and revert
