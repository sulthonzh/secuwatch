# LangChain.js Security Review

**Date:** 2026-05-24
**Repo:** langchain-ai/langchainjs
**Stars:** 20K+ (estimated from npm downloads and visibility)

## Overview

LangChain.js is a TypeScript framework for building LLM-powered applications. It provides modular components for chains, agents, tools, and integrations with various LLM providers.

## Security Analysis

### 🔴 FINDING: Unvalidated SSRF in tiktoken encoding loader

**File:** `libs/langchain-core/src/utils/tiktoken.ts:16`

**Vulnerability:** The `getEncoding()` function fetches encoding data from an external URL without validating the `encoding` parameter. While the base domain is hardcoded to `tiktoken.pages.dev`, the path is completely unvalidated.

```typescript
export async function getEncoding(encoding: TiktokenEncoding) {
  if (!(encoding in cache)) {
    cache[encoding] = caller
      .fetch(`https://tiktoken.pages.dev/js/${encoding}.json`)  // No validation!
      .then((res) => res.json())
      .then((data) => new Tiktoken(data))
      .catch((e) => {
        delete cache[encoding];
        throw e;
      });
  }
  return await cache[encoding];
}
```

**Attack Vector:** An attacker controlling the `encoding` parameter can trigger requests like:
- `https://tiktoken.pages.dev/js/../../admin.json`
- `https://tiktoken.pages.dev/js/../../../internal/config.json`

**Impact:**
- Path traversal on external service
- Potential data exfiltration from `tiktoken.pages.dev`
- DoS via malformed paths causing errors
- Cache pollution (invalid entries persist until explicitly deleted)

**Severity:** MEDIUM (SSRF) - Fixed base URL limits severity, but violates defense-in-depth

**Issue Filed:** #10948

---

### 🟡 Other Areas Reviewed (No Issues Found)

1. **Shell tools** (`libs/providers/langchain-openai/src/tools/shell.ts`, `localShell.ts`)
   - Well-documented with security warnings
   - Execution handled by user-provided callbacks
   - Users responsible for sandboxing/validation

2. **File system operations** (`libs/langchain/src/storage/file_system.ts`)
   - `LocalFileStore` has proper path validation:
     - Key validation regex: `/^[a-zA-Z0-9_.\-/]+$/`
     - Path traversal check: `fullPath.startsWith(commonPath)`
   - Secure implementation

3. **Graph mermaid renderer** (`libs/langchain-core/src/runnables/graph_mermaid.ts`)
   - Constructs URL from base64-encoded mermaid syntax
   - Fixed domain: `mermaid.ink`
   - Encoded input prevents injection

4. **Bash tool** (`libs/providers/langchain-anthropic/src/tools/bash.ts`)
   - Execution handled by user-provided callback
   - Clear security warning in documentation

## Code Quality Observations

- **Path validation pattern:** Inconsistent across codebase. `LocalFileStore` uses strict validation + traversal checks; `tiktoken.ts` has none.
- **External URL handling:** Only `tiktoken.ts` and `graph_mermaid.ts` make external HTTP requests. `graph_mermaid.ts` is safer due to base64 encoding of path segment.
- **Tool execution framework:** Deliberately delegates execution to users - appropriate design for a library, but could benefit from built-in validation helpers.

## Recommendations

1. **Immediate:** Fix SSRF in `tiktoken.ts` with encoding name allowlist (see issue #10948)
2. **Code review:** Audit all other external URL constructions
3. **Documentation:** Add security best practices section for tool implementations
4. **Testing:** Add security tests for path traversal, SSRF, and input validation

## Additional Context

LangChain.js is production-used by major companies (LinkedIn, Uber, Klarna, GitLab) according to README. Security posture is generally good - this is the first significant issue found in a comprehensive review. The modular design and user-provided execution callbacks minimize attack surface.