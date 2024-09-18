const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { signup } = require('../utils.js');

// Configure Chrome options for Selenium
const chromeOptions = new chrome.Options();
// chromeOptions.addArguments('--headless'); // Run in headless mode for CI
// chromeOptions.addArguments('--no-sandbox');
// chromeOptions.addArguments('--disable-dev-shm-usage');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function signupTest() {
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
    
    try {
        await driver.get('http://localhost:3000');

        const signupElement = await driver.findElement(By.xpath("//a[@href='/signup']"));

        await signupElement.click();

        

        await sleep(2000);

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        // Close the browser
        await driver.quit();
    }
})();