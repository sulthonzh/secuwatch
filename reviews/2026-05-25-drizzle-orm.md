# Drizzle ORM Security Review

## Repo
- **Name:** drizzle-team/drizzle-orm
- **Stars:** ~28K (estimated from GitHub popularity, headless TypeScript ORM)
- **Version:** 0.32.1

## Finding: Missing SSRF Validation in Database Connections

### Location
- `drizzle-kit/src/cli/connections.ts` (lines ~260, ~630, and throughout)
- `drizzle-kit/src/serializer/studio.ts` (line ~750)

### Description
Drizzle Kit accepts database URLs (postgresql://, mysql://, libsql://, etc.) without validating that the URLs point to safe hosts. While primarily a developer tool, this enables Server-Side Request Forgery (SSRF) in scenarios where:
- CI/CD pipelines use dynamic user-provided configuration
- Multi-tenant platforms use Drizzle Kit per tenant
- Studio is exposed with untrusted config sources

### Vulnerability Pattern
```typescript
// PostgreSQL connections (connections.ts ~260)
const client = 'url' in credentials
  ? new pg.Pool({ connectionString: credentials.url, max: 1 })  // ❌ No validation
  : new pg.Pool({ ...credentials, ssl, max: 1 });

// MySQL connections (connections.ts ~630)
const connection = result.url
  ? await createConnection(result.url)  // ❌ No validation
  : await createConnection(result.credentials!);
```

### Attack Vectors
1. **Cloud Metadata Access:** `postgres://user@169.254.169.254:5432/db` (AWS IMDS v1)
2. **Internal Network Scanning:** `mysql://user:pass@internal.company.service/db`
3. **File Path Traversal:** `libsql://file:../../sensitive.db` (SQLite file URLs)

### Impact
- **Severity:** MEDIUM (since primarily a dev tool)
- **Exploitability:** Medium (requires specific deployment scenarios)
- **Breach:** Internal network access, metadata theft, file read

### Suggested Fix
Add `isSafePublicUrl()` validation function to:
- Block localhost and private IP ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
- Block cloud metadata endpoints (169.254.169.254)
- Validate file:// URLs for path traversal
- Allow bypass via environment variable for trusted CI/CD

Additional security for Studio:
- Add authentication to proxy endpoint
- Rate limiting
- Configurable host allowlist

### Issue Filed
- **URL:** https://github.com/drizzle-team/drizzle-orm/issues/5803
- **Status:** Open (just filed)

---

## Other Notable Findings

### Path Traversal in Migration Files (LOW)
- `preparePrevSnapshot()` in `migrationPreparator.ts` reads migration files via `fs.readFileSync(lastSnapshot)`
- `snapshots` array comes from `readdirSync(meta)` - user-controlled path
- Impact limited: Only reads files from `out/meta` directory

### SQL Injection Protection (WELL IMPLEMENTED)
- Drizzle ORM core uses proper parameterization via `escapeParam()` and `escapeName()`
- `sql.identifier()` has documentation warning about SQL injection
- No raw concatenation of user input into SQL queries found

### Studio Proxy (POTENTIAL SSRF)
- Studio accepts arbitrary SQL via `proxy` endpoint
- SQL execution is delegated to database connection with SSRF risk
- Consider adding authentication and rate limiting

## Assessment
- **Security Posture:** Good overall, with proper SQL parameterization
- **Gap:** Missing SSRF validation for database URLs (addressed in issue #5803)
- **Recommendation:** Add URL validation + documentation warning for production use