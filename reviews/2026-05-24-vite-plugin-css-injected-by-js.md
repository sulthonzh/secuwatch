# OSS Code Review - vite-plugin-css-injected-by-js

## Repository
- **Name:** marco-prontera/vite-plugin-css-injected-by-js
- **Stars:** 784
- **Language:** TypeScript
- **Description:** Vite plugin that bundles CSS into JavaScript at build time
- **Date:** 2026-05-24

## Security Issues Found

### Issue #168: XSS Vulnerability via Unsanitized HTML Attributes (HIGH)
- **Severity:** HIGH
- **File:** src/utils.ts, function defaultInjectCode
- **Problem:** Direct string interpolation of attribute values without sanitization
- **Impact:** Remote code execution via XSS
- **URL:** https://github.com/marco-prontera/vite-plugin-css-injected-by-js/issues/168

### Issue #169: ReDoS Vulnerability in HTML Regex Parser (MEDIUM)
- **Severity:** MEDIUM
- **File:** src/utils.ts, function removeLinkStyleSheets
- **Problem:** Nested quantifiers in regex can cause catastrophic backtracking
- **Impact:** Denial of Service in build process
- **URL:** https://github.com/marco-prontera/vite-plugin-css-injected-by-js/issues/169

## Code Quality Issues

### 1. Missing Input Validation
- No validation for CSS file names before regex operations
- No checks for malicious attribute names (e.g., onerror, onclick)
- Missing type guards for runtime type safety

### 2. Inconsistent Error Handling
- Try-catch blocks only around limited operations
- No error reporting for build failures
- Silent failures in virtual module generation

### 3. Global State Pollution
- Uses `globalThis` for caching without proper namespacing
- Risk of namespace collisions with other plugins

## Recommendations

1. Implement HTML attribute sanitization using a dedicated library
2. Replace regex-based HTML parsing with DOM-based parsers
3. Add comprehensive input validation and type guards
4. Improve error handling and logging
5. Add CSP recommendations in documentation
6. Implement proper namespacing for global state

## Overall Quality Score
6/10

Good plugin functionality with useful features, but security concerns need immediate attention. The ReDoS vulnerability could affect CI/CD pipelines, and XSS vulnerability poses a significant security risk to end users.

## Files Reviewed
- src/index.ts (main plugin logic)
- src/utils.ts (utility functions, injection code generation)
- src/runtime/dev.ts (development runtime)
- src/runtime/build.ts (build runtime)
- src/interface.ts (type definitions)
- README.md (documentation)