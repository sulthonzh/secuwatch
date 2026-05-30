# Code Review: actions/toolkit
## Repository
- **Owner/Repo:** actions/toolkit
- **Stars:** 25K+
- **Language:** TypeScript
- **Purpose:** GitHub Actions Toolkit - provides packages for creating Actions
- **Last Commit:** Recent (verified active maintenance)

## Review Date
2026-05-25

## Scope Focused
- packages/tool-cache/src/tool-cache.ts
- packages/http-client/src/http-client.ts
- Input validation and SSRF protections

---

## 🔍 CRITICAL FINDING: SSRF in downloadTool (MEDIUM-HIGH Severity)

### Location
`packages/tool-cache/src/tool-cache.ts` - `downloadTool()` function (lines 37-67)

### Vulnerability
The `downloadTool()` function accepts a URL parameter without any validation and passes it directly to the HTTP client:

```typescript
export async function downloadTool(
  url: string,
  dest?: string,
  auth?: string,
  headers?: OutgoingHttpHeaders
): Promise<string> {
  // ...code omitted...

  const response: httpm.HttpClientResponse = await http.get(url, headers)
  // ...
}
```

### Root Cause
1. URL parameter is **never validated** before use
2. No restriction on scheme (http://, https://, file://, etc.)
3. No hostname filtering to block internal/metadata endpoints
4. The URL is passed directly to `http.get()` which makes the HTTP request

### Attack Scenario
A malicious GitHub Action using @actions/toolkit could:

```yaml
name: SSRF Scanner
on: [push]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install toolkit
        run: npm install @actions/tool-cache
      - name: SSRF Attack
        run: |
          node -e "
          const tc = require('@actions/tool-cache');
          // Scan internal metadata service
          tc.downloadTool('http://169.254.169.254/latest/meta-data/');
          // Access internal endpoints
          tc.downloadTool('http://localhost:8080/admin');
          tc.downloadTool('http://10.0.0.1/secret-endpoint');
          "
```

### Impact
1. **Information Disclosure:** Access metadata services (AWS/GCP/Azure instance metadata)
2. **Internal Network Scanning:** Probe GitHub Actions runner infrastructure
3. **Localhost Access:** Potentially access services running on the runner itself
4. **Credential Exfiltration:** If metadata service exposes IAM credentials or secrets

### Exploitability
- **Medium-High:** GitHub Actions have network access, but runner isolation provides some protection
- Attackers need to convince a victim to run a malicious action (supply chain attack)
- Could be exploited through compromised popular actions

### Affects
- All actions using `downloadTool()`
- Common in "setup-*" actions that download tools from external sources
- Potentially affects thousands of GitHub Actions

---

## 🛡️ Suggested Fix

### Option 1: Allowlist (Recommended)
Restrict downloads to known safe domains:

```typescript
const ALLOWED_DOMAINS = new Set([
  'github.com',
  'githubusercontent.com',
  'releases.hashicorp.com',
  'nodejs.org',
  // ... add other legitimate tool distribution domains
])

async function downloadToolAttempt(url: string, dest: string, auth?: string, headers?: OutgoingHttpHeaders): Promise<string> {
  try {
    const parsedUrl = new URL(url)

    // Block internal/private IPs
    const hostname = parsedUrl.hostname
    if (isPrivateIP(hostname)) {
      throw new Error(`Blocked: cannot download from private IP address: ${hostname}`)
    }

    // Block metadata service endpoints
    if (hostname === '169.254.169.254' || hostname === 'metadata.google.internal') {
      throw new Error(`Blocked: cannot download from metadata service: ${hostname}`)
    }

    // Allowlist enforcement (recommended for production)
    if (!ALLOWED_DOMAINS.has(hostname)) {
      throw new Error(`Blocked: domain ${hostname} is not in the allowlist`)
    }

    // Continue with download...
    const response: httpm.HttpClientResponse = await http.get(url, headers)
    // ...
  } catch (err) {
    // Handle URL parsing errors
    throw new Error(`Invalid URL: ${url}`)
  }
}

function isPrivateIP(hostname: string): boolean {
  // Check for localhost variants
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
    return true
  }

  // Check for private IP ranges
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^fc00:/i,  // IPv6 unique local
    /^fd/i,     // IPv6 unique local
  ]

  for (const range of privateRanges) {
    if (range.test(hostname)) {
      return true
    }
  }

  return false
}
```

### Option 2: Blocklist (Defense-in-Depth)
Block known dangerous patterns:

```typescript
const BLOCKED_PATTERNS = [
  /^169\.254\.169\.254$/,  // AWS metadata
  /^metadata\.google\.internal$/,  // GCP metadata
  /^169\.254\.169\.254\.metadata\.azure\.net$/,  // Azure metadata
  /^localhost$/,
  /^127\.0\.0\.1$/,
  /^::1$/,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^file:\/\//,  // Block local file access
  /^ftp:\/\//,   // Block unencrypted protocols
]

async function downloadToolAttempt(url: string, dest: string, auth?: string, headers?: OutgoingHttpHeaders): Promise<string> {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(url) || pattern.test(new URL(url).hostname)) {
      throw new Error(`Blocked: URL matches blocked pattern: ${url}`)
    }
  }

  // Ensure HTTPS only (block http://)
  const parsedUrl = new URL(url)
  if (parsedUrl.protocol !== 'https:') {
    throw new Error(`Blocked: only HTTPS URLs are allowed`)
  }

  // Continue with download...
  const response: httpm.HttpClientResponse = await http.get(url, headers)
  // ...
}
```

### Option 3: GitHub Actions Integration (Runtime)
Add GitHub Actions context validation:

```typescript
async function downloadToolAttempt(url: string, dest: string, auth?: string, headers?: OutgoingHttpHeaders): Promise<string> {
  const parsedUrl = new URL(url)

  // Validate against GitHub Actions environment
  if (process.env['GITHUB_ACTIONS'] === 'true') {
    // Additional checks when running in GitHub Actions
    if (isPrivateIP(parsedUrl.hostname)) {
      core.warning(`Blocking potential SSRF attempt to: ${parsedUrl.hostname}`)
      throw new Error(`Cannot download from private IP addresses in GitHub Actions`)
    }
  }

  // Continue with download...
  const response: httpm.HttpClientResponse = await http.get(url, headers)
  // ...
}
```

---

## Additional Notes

### Other Findings
1. **Path handling in extract7z:** Uses PowerShell command string building with escaped paths. While basic escaping is present, complex paths could potentially break the command.
2. **Symlink handling in cpDirRecursive:** Symlinks are copied without verification. Could be used to create unexpected file structures (less critical).

### Testing Recommendations
Add tests for SSRF prevention:
```typescript
describe('downloadTool SSRF protection', () => {
  it('should block localhost', async () => {
    await expect(downloadTool('http://localhost:8080/file.tar.gz'))
      .rejects.toThrow(/blocked/i)
  })

  it('should block private IPs', async () => {
    await expect(downloadTool('http://10.0.0.1/file.tar.gz'))
      .rejects.toThrow(/blocked/i)
  })

  it('should block metadata service', async () => {
    await expect(downloadTool('http://169.254.169.254/latest/meta-data/'))
      .rejects.toThrow(/blocked/i)
  })

  it('should allow GitHub domains', async () => {
    // Should not throw
    await downloadTool('https://github.com/user/repo/archive/main.zip')
  })
})
```

---

## Recommendation
File as MEDIUM-HIGH severity SSRF issue. The fix is straightforward (URL validation) and the impact is significant given the widespread usage of this toolkit in GitHub Actions ecosystem.