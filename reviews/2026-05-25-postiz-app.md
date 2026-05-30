# Postiz-app Security Review - 2026-05-25

**Repository**: gitroomhq/postiz-app
**Stars**: 30,755
**Commit**: d31226d
**Focus**: SSRF protection, authentication, input validation

---

## Summary

Postiz-app is a social media scheduling platform with a public API for creating posts, managing integrations, and uploading media. The application uses NestJS with Prisma ORM and implements SSRF protection for URL fetching operations.

## Security Analysis

### SSRF Protection ✅ (Mostly Secure)

The application implements **defense-in-depth SSRF protection**:

1. **URL Validation Layer** (`webhook.url.validator.ts`):
   - Protocol check (HTTPS only)
   - Hostname blacklist (localhost)
   - DNS resolution with IP blocklist check

2. **Request Layer** (`ssrfSafeDispatcher.ts`):
   - Pins DNS resolution at fetch time
   - Closes TOCTOU (time-of-check-time-of-use) window
   - Validates all resolved IPs against blocklist

3. **Blocklist Coverage**:
   - IPv4 private ranges: 0.0.0.0/8, 10.0.0.0/8, 127.0.0.0/8, 169.254.0.0/16, 172.16.0.0/12, 192.168.0.0/16, 100.64.0.0/10, 198.18.0.0/15, 224.0.0.0/4 (multicast)
   - IPv6 private ranges: loopback, unspecified, link-local, unique local, multicast
   - IPv4-mapped IPv6 addresses correctly handled

**Endpoints using SSRF-safe dispatcher**:
- `/api/video` - Video proxy endpoint
- `/public/v1/upload-from-url` - Upload media from URL
- Webhook delivery endpoints

**Assessment**: The SSRF protection is **robust** and follows security best practices.

### Authentication & Authorization ✅

**Public API** (`/public/v1/*`):
- Uses `@GetOrgFromRequest()` decorator for org extraction
- Integration endpoint (`/social/:integration`) validates against allowlist
- Resource access checked via database queries (orgId filtering)
- `@CheckPolicies()` decorator enforces subscription limits

**Enterprise API** (`/enterprise/*`):
- JWT-based authentication with shared secret
- Organization lookup by apiKey
- Integration operations scoped to organization

**Assessment**: Authentication appears sound with proper scoping.

### Input Validation ✅

- DTOs use `class-validator` decorators
- Date strings validated with `@IsDateString()`
- Integration parameters validated against allowlist
- Media uploads restrict MIME types (JPEG, PNG, GIF, WebP, AVIF, BMP, TIFF, MP4)

### Code Quality Observations

**Good Practices**:
1. SSRF protection validates DNS at request time (not validation time)
2. Redirect handling in video proxy re-validates each hop (MAX_REDIRECTS = 5)
3. Error handling uses structured HTTP exceptions
4. File uploads validate MIME types via magic byte detection (`file-type`)

---

## Vulnerability Found

### Issue #1556: Incomplete IP version validation in SSRF blocker

**Severity**: LOW (future risk)

**Location**: `libraries/nestjs-libraries/src/dtos/webhooks/webhook.url.validator.ts:64`

**Problem**:
```typescript
const literalIpVersion = net.isIP(hostname);
if (literalIpVersion) {  // Truthy check
  return !isBlockedIp(hostname);
}
```

`net.isIP()` returns `0`, `4`, or `6`. The code uses a truthy check, which works for current Node.js but creates a future compatibility risk if new IP versions are added.

**Impact**:
- Current: No exploit
- Future: If Node.js adds IP version 7/8+, these would bypass IPv4/IPv6-specific blocklist checks

**Fix**:
```typescript
const literalIpVersion = net.isIP(hostname);
if (literalIpVersion === 4 || literalIpVersion === 6) {
  return !isBlockedIp(hostname);
}
```

---

## Recommendations

1. **Accept the IP version fix** (Issue #1556) - Low-effort, improves future-proofing

2. **Consider adding rate limiting** to public API endpoints to prevent abuse

3. **Add integration test coverage** for SSRF protection edge cases (DNS rebinding, redirect chains, etc.)

4. **Document the SSRF protection** architecture for maintainers and security researchers

---

## Conclusion

Postiz-app demonstrates **strong security posture** with robust SSRF protection that uses defense-in-depth (validation + request-level DNS pinning). The codebase follows security best practices for input validation, authentication, and authorization.

The only issue found is a **future compatibility risk** in IP validation that should be fixed for robustness, but poses no immediate threat.

**Overall Assessment**: WELL-SECURED codebase for a 30K-star project.

---

**Review Date**: 2026-05-25
**Reviewer**: OSS Code Reviewer
**Review Time**: ~45 minutes