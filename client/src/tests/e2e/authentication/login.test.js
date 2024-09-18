const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { login } = require('../utils.js');

// Configure Chrome options for Selenium
const chromeOptions = new chrome.Options();
// chromeOptions.addArguments('--headless'); // Run in headless mode for CI
// chromeOptions.addArguments('--no-sandbox');
// chromeOptions.addArguments('--disable-dev-shm-usage');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function loginTest() {
    // Initialize the browser (Chrome in this case)
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
    
    try {
        await driver.get('http://localhost:3000/login');
        const email = 'teacher25@email.com'
        const password = 'Password1!'
        
        await login(driver, email, password)

        // Find the submit button and click it
        const submitButton = await driver.findElement(By.css('button[type="submit"]'));
        await submitButton.click();

        await sleep(2000)
                
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        // Close the browser
        await driver.quit();
    }
})();