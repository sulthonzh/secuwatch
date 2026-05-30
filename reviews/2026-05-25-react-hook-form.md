# Review: react-hook-form/react-hook-form

**Date:** 2026-05-25
**Repo:** https://github.com/react-hook-form/react-hook-form
**Stars:** 44,731
**Version:** 7.76.1

## Review Summary

Reviewed react-hook-form, a popular form validation library for React. Focused on prototype pollution vulnerabilities since it handles deeply nested object paths.

## Finding: Prototype Pollution Read Vulnerability

**Severity:** MEDIUM
**File:** `src/utils/get.ts`
**Issue:** https://github.com/react-hook-form/react-hook-form/issues/13477

### Vulnerability Description

The `get()` utility function allows reading properties from `Object.prototype` via the `__proto__` key. While the `set()` function has protection against prototype pollution (line 31 checks for `__proto__`, `constructor`, `prototype`), the `get()` function lacks the same protection.

### Root Cause

```typescript
// src/utils/get.ts (current code)
export default <T>(
  object: T,
  path?: string | null,
  defaultValue?: unknown,
): any => {
  // ... early returns ...

  const paths = isKey(path) ? [path] : stringToPath(path);

  // ❌ NO VALIDATION OF PATHS HERE
  const result = paths.reduce<any>((result, key) => {
    return isNullOrUndefined(result) ? undefined : result[key];
  }, object);

  // ...
}
```

The `stringToPath` utility correctly parses paths like `__proto__[polluted]` into `['__proto__', 'polluted']`. However, `get()` doesn't validate these keys before accessing the object.

### Proof of Concept

```javascript
// Pollute Object.prototype
Object.prototype.polluted = 'SECRET_DATA';

const formValues = { name: 'John' };

// Attack 1: Read via dot notation
get(formValues, '__proto__.polluted'); // Returns 'SECRET_DATA'

// Attack 2: Read via array notation
get(formValues, '__proto__[polluted]'); // Returns 'SECRET_DATA'
```

### Impact

1. **Data Leakage**: If an attacker can pollute `Object.prototype` (via vulnerable dependency, JSON merge, etc.), they can exfiltrate sensitive data using react-hook-form's `get()` function.

2. **Widespread Usage**: The `get()` utility is used extensively throughout the library:
   - `watch()` function
   - `useController`
   - `validateField`
   - `createFormControl`

3. **User-Facing Exposure**: End users can trigger this via `watch('__proto__.polluted')` or similar API calls.

### Recommended Fix

Add the same prototype protection found in `set.ts`:

```typescript
// Add this validation after parsing paths
if (paths.some(key => key === '__proto__' || key === 'constructor' || key === 'prototype')) {
  return defaultValue;
}
```

## Other Checks Performed

- ✅ No `eval`, `innerHTML`, or `dangerouslySetInnerHTML` usage
- ✅ No SSRF vectors (no HTTP/fetch calls in form logic)
- ✅ No SQL injection risks (library operates in-memory)
- ✅ `set()` properly protected against prototype pollution
- ⚠️ `unset()` lacks prototype protection (lower priority - delete operation)

## Conclusion

react-hook-form is well-written with good security practices. The `set()` function already has prototype pollution protection. The same protection should be applied to `get()` for defense-in-depth.

The issue was filed with concrete PoC and fix proposal.