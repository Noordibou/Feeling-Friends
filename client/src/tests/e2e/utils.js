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

async function signupNewUser(
  driver,
  firstname,
  lastname,
  username,
  email,
  password
) {
  try {
    const teacherButtonChoice = await driver.findElement(
      By.xpath('//button[contains(., "I\'m a teacher")]')
    );

    await teacherButtonChoice.click();

    const firstNameInput = await driver.findElement(By.name("firstname"));
    await firstNameInput.sendKeys(firstname);

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
    await driver.sleep(500);
    const logoutButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Logout')]")
    );
    await driver.wait(until.elementIsVisible(logoutButton), 5000);
    await logoutButton.click();
    await driver.wait(until.urlContains("/login"), 1000);
  } catch (err) {
    console.error("Error during logout:", err);
  }
}

async function deleteTeacherUser(driver) {
  const settingsElement = await driver.findElement(
    By.xpath("//span[text()='Settings']")
  );

  await settingsElement.click();
  await driver.wait(
    until.elementLocated(By.xpath("//button[h3[contains(text(), 'Delete')]]")),
    500
  );
  const deleteAccountButton = await driver.findElement(
    By.xpath("//button[h3[contains(text(), 'Delete')]]")
  );
  deleteAccountButton.click();

  const userFullNameElement = await driver.findElement(By.id("user-fullname"));
  const userFullNameText = await userFullNameElement.getText();

  const inputElement = await driver.findElement(By.id("name-input"));
  await inputElement.sendKeys(userFullNameText);

  const confirmDeleteButton = await driver.findElement(
    By.xpath("//button[contains(text(), 'Delete')]")
  );
  confirmDeleteButton.click();
  await driver.wait(until.urlContains("/signup"), 500);

  // Assert that local storage is empty
  const userData = await driver.executeScript(
    "return localStorage.getItem('userData');"
  );
  expect(userData).toBeNull();
}

async function expectLoginFail(driver, email, password) {
  await login(driver, email, password);
  await driver.wait(
    until.elementLocated(
      By.xpath(
        '//div[@class="Toastify__toast-body"]/div[contains(text(), "Incorrect password or email")]'
      )
    ),
    1000
  );

  const alertElement = await driver.findElement(
    By.xpath(
      '//div[@class="Toastify__toast-body"]/div[contains(text(), "Incorrect password or email")]'
    )
  );
  const alertText = await alertElement.getText();
  expect(alertText).toBe("Incorrect password or email");

  // Assert that local storage is empty
  const checkLSData = await driver.executeScript(
    "return localStorage.getItem('userData');"
  );
  expect(checkLSData).toBeNull();
}

function getRandomString(length) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function getTeacherId(driver) {
  // Assume there's an API or session from which you can retrieve the teacherId
  const userDataString  = await driver.executeScript('return localStorage.getItem("userData._id");');

  const userData = JSON.parse(userDataString);

  return userData;
}

// Example utility function for fetching classroomId
async function getClassroomId(driver) {
  // Retrieve the classroomId after creating or accessing a classroom
  const classroomId = await driver.executeScript('return localStorage.getItem("classroomId");');
  return classroomId;
}

module.exports = {
  login,
  signupNewUser,
  logout,
  deleteTeacherUser,
  expectLoginFail,
  getRandomString,
  getTeacherId,
  getClassroomId
};
