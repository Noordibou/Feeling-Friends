const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { signup, logout, deleteTeacherUser } = require('../utils.js');

// Configure Chrome options for Selenium
const chromeOptions = new chrome.Options();
// chromeOptions.addArguments('--headless'); // Uncomment for headless mode in CI
// chromeOptions.addArguments('--no-sandbox');
// chromeOptions.addArguments('--disable-dev-shm-usage');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Function to generate random email
function getRandomEmail() {
    const randomString = getRandomString(8);
    return `${randomString}@email.com`;
}

// Function to generate random password
function getRandomPassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

describe('Signup Flow Test', () => {
    let driver;

    // Setup: Initialize the browser before all tests
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
    });

    // Teardown: Close the browser after all tests
    afterAll(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    jest.setTimeout(30000);

    // Test case for the signup flow
    it('should sign up and redirect to the teacher-home page', async () => {
        try {
            await driver.get('http://localhost:3000');

            const signupElement = await driver.findElement(By.xpath("//a[@href='/signup']"));
            await signupElement.click();

            const email = getRandomEmail();
            const firstname = getRandomString(6);
            const lastname = getRandomString(6);
            const username = getRandomString(8);
            const password = getRandomPassword();

            // Use the signup utility function
            await signup(driver, firstname, lastname, username, email, password);

            // Wait for redirection to the home page
            await driver.wait(until.urlIs('http://localhost:3000/teacher-home'), 10000);

            // Add a sleep to ensure the page is loaded
            await sleep(2000);

            // Verify the current URL
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toBe('http://localhost:3000/teacher-home'); // Adjust URL if necessary

            // Check if localStorage contains 'userData'
            const localStorageItem = await driver.executeScript("return localStorage.getItem('userData');");
            expect(localStorageItem).not.toBeNull(); // Assert user data is present
            await deleteTeacherUser(driver, sleep)
            
            // Log out the user
            await logout(driver);
        } catch (error) {
            console.error('Test failed:', error);
            throw error; // Rethrow the error so Jest marks the test as failed
        }
    });
});
