import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add custom Jest config
const config = {
  // Use v8 for coverage (faster)
  coverageProvider: 'v8',
  
  // Test environment (jsdom for React)
  testEnvironment: 'jsdom',
  
  // Setup files that run before each test
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Which files to collect coverage from
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  
  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
}

// Export config with Next.js support
export default createJestConfig(config)
