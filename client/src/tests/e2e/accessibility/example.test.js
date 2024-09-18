const { Builder } = require('selenium-webdriver');
const axeSource = require('axe-core');
const { readFileSync } = require('fs');
const { By } = require('selenium-webdriver');

(async function example() {
  // Initialize the WebDriver
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Navigate to the desired webpage
    await driver.get('http://localhost:3000');

    // Inject axe-core into the page
    await driver.executeScript(axeSource.source);

    // Run accessibility checks
    const results = await driver.executeAsyncScript(function(callback) {
      axe.run(function(err, results) {
        if (err) {
          console.error(err);
          return callback([]);
        }
        callback(results);
      });
    });

    // Log or handle accessibility results
    console.log('Accessibility Violations:', results.violations);

  } finally {
    await driver.quit();
  }
})();