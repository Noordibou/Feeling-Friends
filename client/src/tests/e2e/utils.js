const { By, until } = require("selenium-webdriver");

async function login(driver, email, password) {
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
}

async function signupNewUser(driver, firstname, lastname, username, email, password) {
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
}

async function logout(driver) {
  const logoutButton = await driver.findElement(
    By.xpath("//button[contains(text(), 'Logout')]")
  );

  // Click the logout button
  await logoutButton.click();

  // Wait for the confirmation, like being redirected to the login page
  await driver.wait(until.urlContains("/login"), 10000);
}

async function deleteTeacherUser(driver) {
  // TODO: navigate to student profile (if deleting student)

  // navigate to settings tab (if deleting teacher)
  const settingsElement = await driver.findElement(By.xpath("//span[text()='Settings']"));

  // Click the element
  await settingsElement.click();
  await driver.sleep(1000)
  // get delete button & click
  const deleteAccountButton = await driver.findElement(
    By.xpath("//button[h3[contains(text(), 'Delete')]]")
  );
  deleteAccountButton.click()
  await driver.sleep(1000)

  // get user's first and last name
  const userFullNameElement = await driver.findElement(By.id('user-fullname'));
  const userFullNameText = await userFullNameElement.getText();
  // enter that in input
  
  const inputElement = await driver.findElement(By.id('name-input'));

  // Get and print the tag name of the element
  const tagName = await inputElement.getTagName();
  console.log('Tag name of the element:', tagName);

  await inputElement.sendKeys(userFullNameText)

  // delete user

  const confirmDeleteButton = await driver.findElement(
    By.xpath("//button[contains(text(), 'Delete')]")
  );

  confirmDeleteButton.click()
  await driver.sleep(1000)

  // Assert that local storage is empty
  const userData = await driver.executeScript("return localStorage.getItem('userData');");
  expect(userData).toBeNull();  
}



async function expectLoginFail(driver, email, password) {
  await login(driver, email, password)
  await driver.sleep(1000)
  await driver.wait(until.elementLocated(By.xpath('//div[@class="Toastify__toast-body"]/div[contains(text(), "Incorrect password or email")]')), 5000);

  // Now fetch the element and its text
  const alertElement = await driver.findElement(By.xpath('//div[@class="Toastify__toast-body"]/div[contains(text(), "Incorrect password or email")]'));
  const alertText = await alertElement.getText();
  expect(alertText).toBe('Incorrect password or email');

  // Assert that local storage is empty
  const checkLSData = await driver.executeScript("return localStorage.getItem('userData');");
  expect(checkLSData).toBeNull();
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
