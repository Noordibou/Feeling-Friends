const { Builder, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { login, deleteTeacherUser, signupNewUser, logout, expectLoginFail, getRandomString } = require('../utils.js');

// Configure Chrome options for Selenium
const chromeOptions = new chrome.Options();
// chromeOptions.addArguments('--headless'); // Uncomment to run in headless mode for CI

let driver;
const emailString = getRandomString(6)
const email = `test${emailString}@email.com`
const password = 'Password1!';
const testFirstname = getRandomString(6);
const testLastname = getRandomString(6);
const testUsername = getRandomString(8);

// executes before all the tests
beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
    await driver.get('http://localhost:3000/signup');
    
    // Pre-test setup: Sign up a new user
    await signupNewUser(driver, testFirstname, testLastname, testUsername, email, password); 
    await logout(driver)
    await driver.sleep(500)
});

// executes after all tests
afterAll(async () => {
    try {
        // Ensure the session is still valid before cleanup
        if (driver) {
            await deleteTeacherUser(driver);
            await driver.get('http://localhost:3000/login');
            await driver.sleep(500);
            await expectLoginFail(driver, email, password);
        }
    } catch (err) {
        console.error("Error during afterAll:", err);
    } finally {
        // Ensure driver is properly quit
        if (driver) {
            await driver.quit();
        }
    }
});


jest.setTimeout(40000);

test('Login flow and verify local storage and redirection', async () => {
    // GIVEN (sets up the test)
    await driver.get('http://localhost:3000/login');
    // GIVEN, THEN, WHEN as comments for each section
    // Login with the newly signed up user
    await login(driver, email, password);

    // FIXME: will delete once finished building test
    await driver.sleep(500);
    await driver.navigate().refresh();
    
    // Use explicit waits instead of sleep to wait for page load and redirect
    await driver.wait(until.urlIs('http://localhost:3000/teacher-home'), 1000);

    // Check redirection
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toBe('http://localhost:3000/teacher-home');


    const localStorageData = await driver.executeScript("return localStorage.getItem('userData');");
    expect(localStorageData).not.toBeNull();
    await driver.sleep(500);
});
