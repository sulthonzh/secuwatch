describe('SecuWatch', () => {
  it('should have the correct package metadata', () => {
    // Basic smoke test to ensure the package.json structure is correct
    expect(process.env.npm_package_name).toBe('secuwatch');
    expect(process.env.npm_package_version).toBe('1.0.0');
  });

  it('should export the main module', async () => {
    // Test that the main index file can be imported
    const indexModule = await import('../index');
    expect(indexModule).toBeDefined();
    expect(typeof indexModule).toBe('object');
  });
});