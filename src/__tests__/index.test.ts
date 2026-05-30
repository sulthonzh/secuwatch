describe('SecuWatch', () => {
  beforeAll(() => {
    // Mock process.exit to prevent CLI from exiting during tests
    jest.spyOn(process, 'exit').mockImplementation(() => {
      // Don't throw, just do nothing
      return undefined as never;
    });
    
    // Mock console.log to prevent output during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

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

  it('should handle CLI commands without exiting', () => {
    // Test that parsing help doesn't crash
    expect(() => {
      require('../index');
    }).not.toThrow();
  });
});