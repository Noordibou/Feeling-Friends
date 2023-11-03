module.exports = {
    // A pattern that Jest uses to look for test files.
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js)$',
  
    // An array of file extensions that Jest should look for.
    moduleFileExtensions: ['js'],
  
    // The root directory for your project.
    // Adjust this to your project's directory structure.
    // Here, we assume a typical setup with tests in a "src" directory.
    rootDir: 'src',
  
    // Set the test environment. 'jsdom' is suitable for browser-like unit tests.
    testEnvironment: 'jsdom',
  
    // Other options can be added as needed.
  };