# Turborepo Code Review - 2026-05-25

**Repo:** vercel/turbo
**Stars:** 30,434
**Language:** Rust (with some TypeScript)
**Reviewed:** 2026-05-25

---

## Issue Filed
- **URL:** https://github.com/vercel/turborepo/issues/12941
- **Title:** [Security/Medium]: SSRF via experimental OpenTelemetry endpoint configuration
- **Severity:** Medium

---

## Vulnerability Details

### Type: Server-Side Request Forgery (SSRF)

The OpenTelemetry (OTEL) endpoint URL from the `TURBO_EXPERIMENTAL_OTEL_ENDPOINT` environment variable (or `turbo.json` `experimentalObservability.otel.endpoint` field) lacks sufficient validation against SSRF.

### Root Cause

The endpoint validation in `crates/turborepo-run-summary/src/observability/otel.rs` (lines 108-117) only checks:
- The endpoint must be HTTPS (or empty)
- The endpoint must not contain userinfo

However, it does NOT validate against:
- Private/internal IP ranges (127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
- Cloud metadata endpoints (169.254.169.254 for AWS, 169.254.170.2 for GKE, etc.)
- Link-local addresses

### Exploitation Steps

```bash
# Set OTEL to enabled
export TURBO_EXPERIMENTAL_OTEL_ENABLED=1

# Send telemetry to AWS metadata endpoint (SSRF)
export TURBO_EXPERIMENTAL_OTEL_ENDPOINT=http://169.254.169.254/latest/meta-data/

# Run Turbo
turbo run build
```

### Impact

An attacker with control over environment variables (e.g., malicious PR contributor in CI/CD, compromised dependency script) can:

1. Exfiltrate telemetry data (build hashes, task durations, file paths) to arbitrary endpoints
2. Access internal services via localhost/private network addresses
3. Probe cloud metadata endpoints to extract credentials/instance metadata

The telemetry data includes:
- Run metadata (task hashes, durations, cache status)
- File paths (from task inputs/outputs)
- SCM revision information

### Attack Surface

- Requires: Attacker can set environment variables
- Scenarios:
  - CI/CD with malicious PRs from untrusted contributors
  - Compromised `package.json` scripts that set env vars
  - Shared dev environment with malicious actor

### Severity Assessment: MEDIUM

- **Exploitability:** Medium (requires env var control, but feature is experimental)
- **Impact:** Medium (telemetry data exfiltration, potential credential exposure via metadata endpoints)
- **Scope:** Limited to environments using experimental OTEL feature
- **Defense in depth:** Requires `TURBO_EXPERIMENTAL_OTEL_ENABLED=1` to activate

---

## Code Review Notes

### Security Review Focus Areas

1. **Path Traversal:** Checked `cache_dir` handling - protected by camino's `Utf8Path::clean()` which normalizes `..` components
2. **Command Injection:** Task execution uses `Command::new()` with `.arg()` which properly escapes arguments
3. **SSRF:** Found vulnerability in OTEL endpoint validation
4. **Unsafe Rust:** Several `unsafe` blocks found, mostly in:
   - `turborepo-shim/src/run.rs` - environment variable manipulation
   - `turborepo-vt100/` - terminal control codes (test-only)
   - `turborepo-filewatch/src/fsevent.rs` - macOS FSEvent API bindings
   - Most unsafe blocks appear legitimate for FFI/low-level operations

### Other Observations

- Turborepo is primarily written in Rust, which provides strong memory safety guarantees
- User input from `turbo.json` goes through proper schema validation via `turborepo-turbo-json` crate
- Cache directory paths are properly anchored to repo root and normalized
- No obvious XSS vectors (build tool, not web-facing)

---

## Recommendation

Add IP address range validation to the `is_valid_https_endpoint` function to prevent SSRF to:
- Private IP ranges (RFC1918: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
- Loopback addresses (127.0.0.0/8, ::1)
- Cloud metadata endpoints (169.254.169.254, metadata.google.internal, etc.)

Alternative: Use an allowlist-based approach for known OTEL providers (Datadog, Honeycomb, etc.).