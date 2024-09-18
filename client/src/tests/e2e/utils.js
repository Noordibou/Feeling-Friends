const { By, until } = require("selenium-webdriver");

async function login(driver, email, password) {
  const emailInput = await driver.findElement(By.name("email"));
  await emailInput.sendKeys(email);

  // Find the password input field and enter a demo password
  const passwordInput = await driver.findElement(By.name("password"));
  await passwordInput.sendKeys(password);

  // Find the submit button and click it
  const submitButton = await driver.findElement(By.css("button"));
  await submitButton.click();
}

async function signup(driver, firstname, lastname, username, email, password) {
    const teacherButtonChoice = await driver.findElement(By.xpath("//button[contains(., \"I'm a teacher\")]"));

        await teacherButtonChoice.click()

        const firstNameInput = await driver.findElement(By.name('firstname'));
        await firstNameInput.sendKeys(firstname)
        
        // enter last name
        const lastNameInput = await driver.findElement(By.name('lastname'));
        await lastNameInput.sendKeys(lastname)

        const emailInput = await driver.findElement(By.name('email'));
        await emailInput.sendKeys(email)

        const usernameInput = await driver.findElement(By.name('username'));
        await usernameInput.sendKeys(username)

        const passwordInput = await driver.findElement(By.name('password'));
        await passwordInput.sendKeys(password)

        const confirmPasswordInput = await driver.findElement(By.name('confirmPassword'));
        await confirmPasswordInput.sendKeys(password)

        const submitButton = await driver.findElement(By.css('button[type="submit"]'));

        await submitButton.click()
  }

module.exports = { login, signup };
