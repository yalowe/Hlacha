module.exports = {
  test: {
    testTimeout: 20000,
    setupFiles: ['tests/setup-emulator-env.ts'],
    environment: 'node',
    globals: true
  }
};
