var { defineConfig, devices } = require('@playwright/test');

var ci = !!process.env.CI;

module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  expect: {
    timeout: 10000
  },
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:3000',
    headless: ci,
    launchOptions: ci ? {} : {
      slowMo: 1000
    }
  },
  webServer: {
    command: 'npm start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
    timeout: 30000
  }
});
