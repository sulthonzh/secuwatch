# Review: ChromeDevTools/chrome-devtools-mcp
**Date:** 2026-05-25
**Stars:** 41,519
**Reviewed:** MCP server for Chrome DevTools automation via AI agents

---

## Summary
Chrome DevTools MCP is a Model-Context-Protocol server that exposes Chrome DevTools capabilities to AI coding assistants. It provides tools for browser automation, debugging, performance analysis, and memory profiling. Security review focused on experimental memory tools and file path validation.

---

## Findings

### 1. Path Traversal in getHeapSnapshotRetainers (MEDIUM)
**Location:** `src/McpContext.ts:845-848`

**Issue:** The `getHeapSnapshotRetainers()` method is missing the `this.validatePath(filePath)` call that all other heap snapshot methods have. This allows reading arbitrary files from the host system.

**Code:**
```typescript
async getHeapSnapshotRetainers(
  filePath: string,
  nodeId: number,
): Promise<DevTools.HeapSnapshotModel.HeapSnapshotModel.ItemsRange> {
  return await this.#heapSnapshotManager.getRetainers(filePath, nodeId);
}
```

**Comparison with other methods:**
- `getHeapSnapshotStats()` - ✅ has `this.validatePath(filePath)`
- `getHeapSnapshotStaticData()` - ✅ has `this.validatePath(filePath)`
- `getHeapSnapshotNodesById()` - ✅ has `this.validatePath(filePath)`
- `getHeapSnapshotRetainers()` - ❌ missing validation

**Impact:**
- Read arbitrary files from the host system
- Access sensitive files like SSH keys, API tokens, configuration files
- Works when `--experimentalMemory` flag is enabled

**Fix:** Add `this.validatePath(filePath);` at the start of the method.

**Issue Filed:** https://github.com/ChromeDevTools/chrome-devtools-mcp/issues/2119

---

## Code Quality Observations

### Strengths
1. **Consistent validatePath usage** - Most tools properly validate file paths against workspace roots
2. **Good error handling** - validatePath throws descriptive errors with workspace context
3. **Path normalization** - Uses `path.resolve()` to normalize paths before validation
4. **Defense in depth** - Multiple layers of validation in file operations

### Areas for Improvement
1. **Inconsistent validation** - The getHeapSnapshotRetainers omission suggests a gap in code review coverage
2. **No allowlist for heap snapshot operations** - All heap snapshot tools should probably require a dedicated "safe" directory, not just workspace roots

---

## Other Security Considerations

### Reviewed but Not Vulnerable

1. **evaluateScript tool** - Arbitrary JS execution is by design for browser debugging. The tool validates file paths when saving output.

2. **URL navigation** - No SSRF protection found, but this is expected for a browser automation tool. The tool can connect to any URL by design.

3. **File upload (upload_file)** - Uses validatePath() properly to prevent path traversal.

4. **validatePath implementation** - Properly normalizes paths and checks against workspace roots using path.resolve() and startsWith().

---

## Tools Analyzed

- Input automation (click, drag, fill, fill_form, upload_file, etc.) - path validated
- Navigation (navigate_page, new_page, list_pages) - expected behavior
- Performance (performance_analyze_insight, etc.) - path validated
- Memory (take_heapsnapshot, get_heapsnapshot_summary, get_heapsnapshot_details, get_heapsnapshot_class_nodes, get_heapsnapshot_retainers) - **get_heapsnapshot_retainers has missing validation**
- Debugging (evaluate_script, get_console_message, etc.) - path validated for file saves

---

## Severity Assessment

**MEDIUM** - The vulnerability allows arbitrary file read, but:
- Requires `--experimentalMemory` flag to be enabled
- Does not allow file write or code execution
- Impact is information disclosure, not system compromise

---

## Recommendation

Accept the issue. The fix is trivial (adding one line of existing code). The maintainers should audit all public methods in McpContext that accept file paths to ensure consistent validation coverage.