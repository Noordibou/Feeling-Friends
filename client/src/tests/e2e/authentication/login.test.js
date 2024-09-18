const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { login, deleteTeacherUser } = require('../utils.js');

// Configure Chrome options for Selenium
const chromeOptions = new chrome.Options();
// chromeOptions.addArguments('--headless'); // Uncomment to run in headless mode for CI

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let driver;

beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
});

afterAll(async () => {
    await driver.quit();
});

beforeEach(async () => {
    await driver.get('http://localhost:3000/login');
});

jest.setTimeout(30000);

test('Login flow and verify local storage and redirection', async () => {
    const email = 'youtest@email.com';
    const password = 'Password1!';

    await login(driver, email, password);

    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    await submitButton.click();

    // Wait for page to load and refresh
    await driver.sleep(2000); // Use sleep or better approach for waiting
    await driver.navigate().refresh();
    await driver.sleep(2000);

    // Check local storage
    const localStorageItem = await driver.executeScript("return localStorage.getItem('userData');");
    expect(localStorageItem).not.toBeNull(); // Assert user data is present

    // Check redirection
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toBe('http://localhost:3000/teacher-home'); // Adjust URL as necessary

    await deleteTeacherUser(driver, sleep)
});