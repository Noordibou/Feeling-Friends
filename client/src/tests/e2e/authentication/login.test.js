const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const {
  login,
  deleteTeacherUser,
  signupNewUser,
  logout,
  expectLoginFail,
  getRandomString,
} = require("../utils.js");

// Configure Chrome options for Selenium
const chromeOptions = new chrome.Options();
chromeOptions.addArguments('--headless');

let driver;
const emailString = getRandomString(6);
const email = `test${emailString}@email.com`;
const password = "Password1!";
const testFirstname = getRandomString(6);
const testLastname = getRandomString(6);
const testUsername = getRandomString(8);

// executes before all the tests
beforeAll(async () => {
  driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(chromeOptions)
    .build();
  await driver.get("http://localhost:3000/signup");

  // Pre-test setup: Sign up a new user
  await signupNewUser(
    driver,
    testFirstname,
    testLastname,
    testUsername,
    email,
    password
  );
  await driver.sleep(1000);
  await logout(driver);
});

// executes after all tests
afterAll(async () => {

  try{
    await login(driver, email, password);
    await driver.sleep(500);
    const userData = await deleteTeacherUser(driver);
    expect(userData).toBeNull();
    await driver.get("http://localhost:3000/login");
    await login(driver, email, password);
    await driver.sleep(1000);
    await expectLoginFail(driver, email, password, true);
  } finally {
    await driver.quit();
  }
});

jest.setTimeout(25000);

test("Login flow and verify local storage and redirection", async () => {
  // GIVEN (sets up the test)
  await driver.get("http://localhost:3000/login");
  // GIVEN, THEN, WHEN as comments for each section
  // Login with the newly signed up user
  await login(driver, email, password);
//   await driver.sleep(500);
//   await driver.navigate().refresh();
  // Use explicit waits for teacher-home to load
  await driver.wait(until.urlIs("http://localhost:3000/teacher-home"), 1000);

  // Check redirection
  const currentUrl = await driver.getCurrentUrl();
  expect(currentUrl).toBe("http://localhost:3000/teacher-home");

  const localStorageData = await driver.executeScript(
    "return localStorage.getItem('userData');"
  );
  expect(localStorageData).not.toBeNull();
  await driver.sleep(500);
});

test("Login fails and error toast appears with invalid credentials", async () => {
  // GIVEN:
  await driver.get("http://localhost:3000/login");
  const invalidEmail = "invalid-email@test.com";
  const invalidPassword = "InvalidPassword123";

  // THEN:
  // Attempt login with incorrect credentials
  await login(driver, invalidEmail, invalidPassword);
  await driver.sleep(500);
  await driver.wait(
    until.elementLocated(
      By.xpath(
        '//div[@class="Toastify__toast-body"]/div[contains(text(), "Incorrect password or email")]'
      )
    ),
    1000
  );
  await driver.sleep(500);
  // Now fetch the element and its text
  const alertElement = await driver.findElement(
    By.xpath(
      '//div[@class="Toastify__toast-body"]/div[contains(text(), "Incorrect password or email")]'
    )
  );
  const alertText = await alertElement.getText();
  expect(alertText).toBe("Incorrect password or email");
});

test("Login fails and error toast appears with empty fields", async () => {
  await driver.get("http://localhost:3000/login");

  const submitButton = await driver.findElement(
    By.css('button[type="submit"]')
  );
  await submitButton.click();
  await driver.wait(
    until.elementLocated(
      By.xpath(
        '//div[@class="Toastify__toast-body"]/div[contains(text(), "Please enter both email and password.")]'
      )
    ),
    3000
  );
  await driver.sleep(500);
  // Now fetch the element and its text
  const alertElement = await driver.findElement(
    By.xpath(
      '//div[@class="Toastify__toast-body"]/div[contains(text(), "Please enter both email and password.")]'
    )
  );
  const alertText = await alertElement.getText();
  expect(alertText).toBe("Please enter both email and password.");
});
