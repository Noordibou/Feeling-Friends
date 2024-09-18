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

async function signup(driver, firstname, lastname, username, email, password) {
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

async function deleteTeacherUser(driver, sleep) {
  // TODO: navigate to student profile (if deleting student)

  // navigate to settings tab (if deleting teacher)
  const settingsElement = await driver.findElement(By.xpath("//span[text()='Settings']"));

  // Click the element
  await settingsElement.click();
  await sleep(2000)
  // get delete button & click
  const deleteAccountButton = await driver.findElement(
    By.xpath("//button[h3[contains(text(), 'Delete')]]")
  );
  deleteAccountButton.click()
  await sleep(5000)

  // get user's first and last name
  const userFullNameElement = await driver.findElement(By.id('user-fullname'));
  const userFullNameText = await userFullNameElement.getText();
  // enter that in input
  
  const inputElement = await driver.findElement(By.id('name-input'));

  const isDisplayed = await inputElement.isDisplayed();
  console.log('Input element is displayed:', isDisplayed);

  // Get and print the tag name of the element
  const tagName = await inputElement.getTagName();
  console.log('Tag name of the element:', tagName);

  await inputElement.sendKeys(userFullNameText)

  // delete user

  const confirmDeleteButton = await driver.findElement(
    By.xpath("//button[contains(text(), 'Delete')]")
  );

  confirmDeleteButton.click()

  await sleep(1000)
  const localStorageKeys = await driver.executeScript("return Object.keys(window.localStorage);");
  console.log('Local storage keys:', localStorageKeys); // For debugging

  // Assert that local storage is empty
  expect(localStorageKeys.length).toBe(0);
  const storedData = await driver.executeScript("return sessionStorage.getItem('teacherDeleteInfo');");

  if (storedData) {
      const { success, teacherName } = JSON.parse(storedData);
      console.log('Success:', success);
      console.log('Teacher Name:', teacherName);

      // Verify that the success field indicates successful deletion
      expect(success).toBe(true); // Adjust based on expected success value

      // Optionally, verify the teacher's name or other data
      expect(teacherName).toBe('Expected Teacher Name'); // Adjust as needed
  } else {
      throw new Error('No data found in sessionStorage for teacherDeleteInfo.');
  }
}

module.exports = { login, signup, logout, deleteTeacherUser };
