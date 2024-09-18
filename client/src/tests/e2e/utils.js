const { By, until } = require("selenium-webdriver");

async function login(driver, email, password) {
  try{
    const emailInput = await driver.findElement(By.name("email"));
    await emailInput.sendKeys(email);

    // Find the password input field and enter a demo password
    const passwordInput = await driver.findElement(By.name("password"));
    await passwordInput.sendKeys(password);

    // Find the submit button and click it
    const submitButton = await driver.findElement(
      By.css('button[type="submit"]')
    );
    await submitButton.click();
  } catch (err) {
    console.error("Error during login:", err);
  }
}

async function signupNewUser(driver, firstname, lastname, username, email, password) {
  try {
    const teacherButtonChoice = await driver.findElement(
      By.xpath('//button[contains(., "I\'m a teacher")]')
    );

    await teacherButtonChoice.click();

    const firstNameInput = await driver.findElement(By.name("firstname"));
    await firstNameInput.sendKeys(firstname);

    // enter last name
    const lastNameInput = await driver.findElement(By.name("lastname"));
    await lastNameInput.sendKeys(lastname);

    const emailInput = await driver.findElement(By.name("email"));
    await emailInput.sendKeys(email);

    const usernameInput = await driver.findElement(By.name("username"));
    await usernameInput.sendKeys(username);

    const passwordInput = await driver.findElement(By.name("password"));
    await passwordInput.sendKeys(password);

    const confirmPasswordInput = await driver.findElement(
      By.name("confirmPassword")
    );
    await confirmPasswordInput.sendKeys(password);

    const submitButton = await driver.findElement(
      By.css('button[type="submit"]')
    );

    await submitButton.click();
  } catch (err) {
    console.error("Error during sign up:", err);
  }
}

async function logout(driver) {
  try {
    const logoutButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Logout')]")
    );
    await logoutButton.click();
    await driver.wait(until.urlContains("/login"), 1000);
  } catch (err) {
    console.error("Error during logout:", err);  
  }
}

async function deleteTeacherUser(driver) {
  try {
    // TODO: navigate to student profile (if deleting student)

    // navigate to settings tab (if deleting teacher)
    const settingsElement = await driver.findElement(By.xpath("//span[text()='Settings']"));

    // Click the element
    await settingsElement.click();
    await driver.wait(until.elementLocated(By.xpath("//button[h3[contains(text(), 'Delete')]]")), 500);
    const deleteAccountButton = await driver.findElement(By.xpath("//button[h3[contains(text(), 'Delete')]]"));
    deleteAccountButton.click()

    // get user's first and last name
    const userFullNameElement = await driver.findElement(By.id('user-fullname'));
    const userFullNameText = await userFullNameElement.getText();
    // enter that in input
    
    const inputElement = await driver.findElement(By.id('name-input'));
    await inputElement.sendKeys(userFullNameText)

    // delete user

    const confirmDeleteButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Delete')]")
    );
    confirmDeleteButton.click()
    await driver.wait(until.urlContains("/signup"), 500);

    // Assert that local storage is empty
    const userData = await driver.executeScript("return localStorage.getItem('userData');");
    expect(userData).toBeNull();
  } catch (err) {
    console.error("Error during delete user:", err);
  }
}

async function expectLoginFail(driver, email, password) {
  try {
    await login(driver, email, password)
    await driver.sleep(500)
    await driver.wait(until.elementLocated(By.xpath('//div[@class="Toastify__toast-body"]/div[contains(text(), "Incorrect password or email")]')), 1000);

    // Now fetch the element and its text
    const alertElement = await driver.findElement(By.xpath('//div[@class="Toastify__toast-body"]/div[contains(text(), "Incorrect password or email")]'));
    const alertText = await alertElement.getText();
    expect(alertText).toBe('Incorrect password or email');

    // Assert that local storage is empty
    const checkLSData = await driver.executeScript("return localStorage.getItem('userData');");
    expect(checkLSData).toBeNull();
  } catch (err) {
    console.error("Error during login failure expectation:", err);
  }
}

function getRandomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = { login, signupNewUser, logout, deleteTeacherUser, expectLoginFail, getRandomString };
