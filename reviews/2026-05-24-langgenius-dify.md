# OSS Code Review: langgenius/dify

**Date:** 2026-05-24
**Repository:** https://github.com/langgenius/dify
**Stars:** 142,426
**Language:** Python (API) + TypeScript (Web)
**Review Type:** Security Audit

## Review Scope

- API: `/api/core/tools/utils/parser.py`
- API: `/api/core/tools/utils/web_reader_tool.py`
- API: `/api/core/helper/ssrf_proxy.py`
- API: `/api/services/tools/mcp_tools_manage_service.py`
- API: `/api/core/mcp/client/sse_client.py`

## Findings

### 🟡 MEDIUM: SSRF Bypass in ApiBasedToolSchemaParser

**File:** `api/core/tools/utils/parser.py` (line 379)

**Issue:** Direct `httpx.get()` call to user-provided URLs without SSRF protection

**Vulnerable Code:**
```python
response = httpx.get(
    api_url, headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "}, timeout=5
)
```

The `api_url` is provided by users in OpenAPI plugin manifests and is passed directly to `httpx.get()` without any validation or SSRF protection.

**Impact:**
- SSRF Attack: Attackers can scan internal network infrastructure
- Internal Service Access: Access to local services (192.168.x.x, 10.x.x.x, 172.16-31.x.x, localhost)
- Metadata Access: Potential access to cloud metadata endpoints (169.254.169.254)
- Proxy Bypass: Completely bypasses the configured SSRF proxy used elsewhere in the codebase

**Recommendation:**
Replace with `ssrf_proxy.get()` to ensure consistency with SSRF protections used elsewhere in the codebase.

**Issue URL:** https://github.com/langgenius/dify/issues/36576

---

## Positive Findings

- SSRF proxy implementation (`api/core/helper/ssrf_proxy.py`) is well-designed
- URL validation in `api/services/tools/mcp_tools_manage_service.py` properly checks schemes
- SSE transport endpoint validation in `api/core/mcp/client/sse_client.py` validates URL origins
- Most code paths use `ssrf_proxy` correctly for external requests

## Overall Quality

**Security: 7/10**
- Good SSRF proxy infrastructure
- One instance of SSRF bypass found in tool schema parsing
- No obvious SQL injection or command injection vulnerabilities found
- Proper use of parameterized queries throughout

**Code Quality: 8/10**
- Well-structured codebase with clear separation of concerns
- Comprehensive SSRF protection infrastructure
- Good error handling in most places

---

## Issues Filed

1. **#36576** - Security: SSRF bypass in ApiBasedToolSchemaParser - unprotected httpx.get() call

---

## Next Actions

Monitor issue #36576 for maintainer response and potential fix.