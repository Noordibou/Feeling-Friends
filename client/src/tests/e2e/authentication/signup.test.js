const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { signup, logout } = require('../utils.js');

// Configure Chrome options for Selenium
const chromeOptions = new chrome.Options();
chromeOptions.addArguments('--headless'); // Run in headless mode for CI
chromeOptions.addArguments('--no-sandbox');
chromeOptions.addArguments('--disable-dev-shm-usage');

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

(async function signupTest() {
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
    
    try {
        await driver.get('http://localhost:3000');

        const signupElement = await driver.findElement(By.xpath("//a[@href='/signup']"));

        await signupElement.click();

        const email = "wammyonni@email.com"
        const firstname = "wammy"
        const lastname = "Onni"
        const username= "wammyonni2123"
        const password = "eik3ndhc#dsi32!"


        await signup(driver, firstname, lastname, username, email, password)

        await driver.wait(until.urlIs('http://localhost:3000/teacher-home'), 10000);

        await logout(driver)


    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        // Close the browser
        await driver.quit();
    }
})();