# Review: triggerdotdev/trigger.dev

**Date:** 2026-05-24
**Repo:** https://github.com/triggerdotdev/trigger.dev
**Stars:** 15,065
**Language:** TypeScript
**Architecture:** AI agent/workflow platform with webhooks, integrations, realtime streams

---

## Summary

Trigger.dev is an open-source platform for building AI agents and workflows in TypeScript with long-running tasks, retries, queues, and observability. The project has a monorepo structure with a webapp (Remix), core SDK packages, and build extensions including Python support.

---

## Files Reviewed

- `apps/webapp/app/services/realtimeClient.server.ts` (main focus)
- `apps/webapp/app/routes/realtime.v1.runs.ts`
- `packages/python/src/index.ts`
- `apps/webapp/app/v3/vercel/vercelUrls.server.ts`
- `apps/webapp/app/runEngine/services/streamBatchItems.server.ts`
- `packages/core/src/v3/serverOnly/httpServer.ts`
- `packages/core/src/v3/serverOnly/resourceMonitor.ts`

---

## Findings

### 🔴 MEDIUM: SQL Injection via Unescaped Tags Parameter

**File:** `apps/webapp/app/services/realtimeClient.server.ts:171`

**Vulnerable Code:**
```typescript
if (params.tags) {
  whereClauses.push(`"runTags" @> ARRAY[${params.tags.map((t) => `'${t}'`).join(",")}]`);
}
```

**Issue:** User-provided tags from search parameters are directly interpolated into a PostgreSQL WHERE clause without SQL escaping. While the tags array is validated through Zod as `string().optional()`, no SQL escaping or sanitization occurs before query construction.

**Attack Vector:**
1. Authenticated user sends request to `/realtime/v1/runs?tags=<malicious_payload>`
2. Tags parameter flows through `streamRuns()` → `whereClause` construction
3. Unescaped WHERE clause is sent to Electric (PostgreSQL) in URL search param `where`
4. PostgreSQL executes with injected SQL syntax

**Example Attack:**
```
GET /realtime/v1/runs?tags=test' OR '1'='1
```

Constructs:
```sql
"runTags" @> ARRAY['test' OR '1'='1']
```

**Impact:**
- SQL injection in realtime streams API
- Potential information disclosure or DoS for authenticated users
- Requires valid JWT with `read:tags` or `read:runs` permissions
- Attack surface limited by ARRAY literal context and `@>` operator but still exploitable

**Mitigating Factors:**
- Authentication required (not public)
- WHERE clause is within ARRAY literal, limiting some injection techniques
- Uses PostgreSQL `@>` (array contains) operator

**Recommended Fix:**
1. **Immediate:** Escape single quotes in tags: `'${t.replace(/'/g, "''")}'`
2. **Long-term:** Use parameterized queries if Electric supports them
3. **Additional:** Audit similar patterns in other realtime endpoints

---

## Other Areas Reviewed

### Python Extension
- Code execution uses `tinyexec` with proper array arguments (no shell injection)
- Scripts written to temp files before execution (safe)
- Environment variables are properly passed through

### HTTP Server & Webhooks
- Query parameter parsing uses `new URL()` with `searchParams` (safe from injection)
- Vercel callback URL sanitization allows only vercel.com subdomains (good practice)
- No SSRF vectors found in HTTP handlers

### NDJSON Parser
- Uses `JSON.parse()` on user data (standard NDJSON format)
- Line-by-line processing prevents DoS from oversized items
- Proper UTF-8 decoding with error handling

### File Operations
- Limited file system access (resource monitor reads `/proc/` only)
- No path traversal patterns found

---

## Security Strengths

1. **Authentication & Authorization:** Strong RBAC system with proper token validation
2. **Input Validation:** Zod schemas used extensively for API inputs
3. **URL Sanitization:** Vercel callback URLs properly validated
4. **Code Isolation:** Python code runs in isolated environment via tinyexec
5. **Error Handling:** Comprehensive error handling with structured logging

---

## Issue Filed

**URL:** https://github.com/triggerdotdev/trigger.dev/issues/3739
**Severity:** MEDIUM (SQL injection)
**Status:** Open

---

## Recommendations

1. **High Priority:** Fix SQL injection in `realtimeClient.server.ts` using proper escaping
2. **Medium Priority:** Audit all `whereClause` construction code-wide for similar patterns
3. **Low Priority:** Consider implementing a centralized SQL escaping utility

---

## Conclusion

Trigger.dev has a solid security foundation with proper authentication, input validation, and isolation. The SQL injection vulnerability found in the realtime API is a moderate risk that requires prompt remediation. The project appears to follow security best practices overall, and the maintainer team is active with good review processes.