const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { signupNewUser, login, logout, deleteTeacherUser, getRandomString, expectLoginFail } = require('../utils.js');

// Configure Chrome options for Selenium
const chromeOptions = new chrome.Options();
// chromeOptions.addArguments('--headless'); // Uncomment for headless mode in CI
// chromeOptions.addArguments('--no-sandbox');
// chromeOptions.addArguments('--disable-dev-shm-usage');

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
    let email
    let firstname
    let lastname
    let username
    let password

    // Setup: Initialize the browser before all tests
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();

        email = getRandomEmail();
        firstname = getRandomString(6);
        lastname = getRandomString(6);
        username = getRandomString(8);
        password = getRandomPassword();
    });

    // Teardown: Close the browser after all tests
    afterAll(async () => {
        await driver.get("http://localhost:3000/login");
        await login(driver, email, password);
        // temporary until login error is fixed
        await driver.sleep(500);
        await driver.navigate().refresh();
        await driver.wait(until.urlIs("http://localhost:3000/teacher-home"), 1000);
        await driver.sleep(500);
        await deleteTeacherUser(driver);
        await driver.get("http://localhost:3000/login");
        await login(driver, email, password);
        await driver.sleep(1000);
        await expectLoginFail(driver, email, password);
        if (driver) {
            await driver.quit();
        }
    });

    jest.setTimeout(20000);

    // Test case for the signup flow
    it('should sign up and redirect to the teacher-home page', async () => {
        try {
            await driver.get('http://localhost:3000');

            const signupElement = await driver.findElement(By.xpath("//a[@href='/signup']"));
            await signupElement.click();

            // Use the signup utility function
            await signupNewUser(driver, firstname, lastname, username, email, password);

            // Wait for redirection to the home page
            await driver.wait(until.urlIs('http://localhost:3000/teacher-home'), 3000);

            // Verify the current URL
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toBe('http://localhost:3000/teacher-home'); // Adjust URL if necessary

            // Check if localStorage contains 'userData'
            const localStorageItem = await driver.executeScript("return localStorage.getItem('userData');");
            expect(localStorageItem).not.toBeNull(); // Assert user data is present
            await logout(driver)
        } catch (error) {
            console.error('Test failed:', error);
            throw error; // Rethrow the error so Jest marks the test as failed
        }
    });


    it('should display error for duplicate email signup', async () => {
        await driver.get('http://localhost:3000/signup');

        // First signup
        await signupNewUser(driver, firstname, lastname, username, email, password);
        // Wait for redirection to the home page
        await driver.wait(until.urlIs('http://localhost:3000/teacher-home'), 3000);
        await logout(driver);
        
        // Try to signup again with the same email
        await driver.get('http://localhost:3000/signup');
        await signupNewUser(driver, firstname, lastname, username, email, password);
    
        // Check for duplicate email message
            // Find the toast container
        const toastContainer = await driver.findElement(By.css('.Toastify__toast-container'));

        // Check if the toast contains the error class
        const errorToast = await toastContainer.findElement(By.css('.Toastify__toast--error'));
        expect(await errorToast.isDisplayed()).toBe(true);

        // Verify the specific error message inside the toast
        const toastMessage = await errorToast.findElement(By.css('.Toastify__toast-body')).getText();
        expect(toastMessage).toContain("Email already exists");
    });


    it('should display error message if teacher role left unclicked', async () => {
        await driver.get('http://localhost:3000/signup');
        
        // First signup
        for (const field of fieldsToTest) {
            
            const inputElement = await driver.findElement(By.name(field.name));
            
            // Ensure the email field is filled with a valid format
            if (field.name === 'email') {
            await inputElement.sendKeys('adifferenttest@email.com');
            } else {
            await inputElement.sendKeys('aDifferentTestValue');
            }

        }
        // Click the submit button to trigger validation
        const submitButton = await driver.findElement(By.css('button[type="submit"]'));
        await submitButton.click();
        await driver.sleep(500)
        // Wait for the toast to appear (adjust the timeout if needed)
        await driver.wait(until.elementLocated(By.css('.Toastify__toast-container')), 5000);
        
        // Find the toast container
        const toastContainer = await driver.findElement(By.css('.Toastify__toast-container'));

        // Check if the toast contains the error class
        const errorToast = await toastContainer.findElement(By.css('.Toastify__toast--error'));
        expect(await errorToast.isDisplayed()).toBe(true);

        // Verify the specific error message inside the toast
        const toastMessage = await errorToast.findElement(By.css('.Toastify__toast-body')).getText();
        expect(toastMessage).toContain("Please choose a role!");
        
    });



    const fieldsToTest = [
        { name: 'firstname', label: 'First Name', errorMessage: 'Please enter your first name!' },
        { name: 'lastname', label: 'Last Name', errorMessage: 'Please enter your last name!' },
        { name: 'email', label: 'Email', errorMessage: 'Please enter an email!' },
        { name: 'username', label: 'Username', errorMessage: 'Please enter a username' },
        { name: 'password', label: 'Password', errorMessage: 'Passwords do not match!' },
        { name: 'confirmPassword', label: 'Confirm Password', errorMessage: 'Passwords do not match!' }
    ];
    
    test.each(fieldsToTest)(
        'should display validation error for empty $label field',
        async ({ name, errorMessage }) => {
            await driver.get('http://localhost:3000/signup');
            const teacherButtonChoice = await driver.findElement(
                By.xpath('//button[contains(., "I\'m a teacher")]')
            );
            await teacherButtonChoice.click();
            // Fill in all fields except the current one being tested
            for (const field of fieldsToTest) {
                if (field.name !== name) {
                  const inputElement = await driver.findElement(By.name(field.name));
                  
                  // Ensure the email field is filled with a valid format
                  if (field.name === 'email') {
                    await inputElement.sendKeys('test@email.com');
                  } else {
                    await inputElement.sendKeys('TestValue');
                  }
                }
              }
    
            // Click the submit button to trigger validation
            const submitButton = await driver.findElement(By.css('button[type="submit"]'));
            await submitButton.click();
            await driver.sleep(500)
            // Wait for the toast to appear (adjust the timeout if needed)
            await driver.wait(until.elementLocated(By.css('.Toastify__toast-container')), 500);
            
            // Find the toast container
            const toastContainer = await driver.findElement(By.css('.Toastify__toast-container'));
    
            // Check if the toast contains the error class
            const errorToast = await toastContainer.findElement(By.css('.Toastify__toast--error'));
            expect(await errorToast.isDisplayed()).toBe(true);
    
            // Verify the specific error message inside the toast
            const toastMessage = await errorToast.findElement(By.css('.Toastify__toast-body')).getText();
            expect(toastMessage).toContain(errorMessage);
        }
    );

});
