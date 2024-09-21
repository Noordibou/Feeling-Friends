const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { signupNewUser, deleteTeacherUser, login, logout, getClassroomId, getTeacherId, getRandomString, expectLoginFail } = require('../utils.js');

// Chrome options for Selenium
const chromeOptions = new chrome.Options();
chromeOptions.addArguments('--headless');

describe('Logout Button Test for Multiple URLs', () => {
    let driver;
    let email, password, firstname, lastname, username;
    let isFirstTest = true;
    let teacherId, classroomId;

    function getRandomEmail() {
        const randomString = getRandomString(8);
        return `${randomString}@email.com`;
    }

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
        email = getRandomEmail();
        firstname = getRandomString(6);
        lastname = getRandomString(6);
        username = getRandomString(8);
        password = getRandomString(8);
        await driver.get('http://localhost:3000/signup');
        await signupNewUser(driver, firstname, lastname, username, email, password);

        await driver.wait(until.urlIs('http://localhost:3000/teacher-home'), 3000);

        teacherId = await getTeacherId(driver);
        classroomId = await getClassroomId(driver);
        await driver.sleep(3000)
    });

    afterAll(async () => {
        try {
            await driver.get("http://localhost:3000/login");
            await login(driver, email, password);
            // temporary until login error is fixed
            await driver.sleep(500);
            await driver.navigate().refresh();
            await driver.wait(until.urlIs("http://localhost:3000/teacher-home"), 1000);
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

    jest.setTimeout(30000);

    const urlsToTest = [
        `http://localhost:3000/teacher-home`,
        `http://localhost:3000/classroom/${teacherId}/${classroomId}`,
        `http://localhost:3000/viewclasslist/${teacherId}/:classroomId`,
        `http://localhost:3000/${teacherId}/${classroomId}/:studentId`,
        `http://localhost:3000/edit-seating-chart/${teacherId}/${classroomId}`,
        `http://localhost:3000/editneedsgoals/${teacherId}/${classroomId}`,
        `http://localhost:3000/createclass`,
        `http://localhost:3000/addstudent/${teacherId}/${classroomId}`
    ];

    urlsToTest.forEach((url) => {
        it(`should successfully log out from ${url}`, async () => {

            try {

                if (!isFirstTest) {
                    await driver.wait(until.urlIs('http://localhost:3000/login'), 500);
                    await login(driver, email, password);
                    await driver.wait(until.urlIs('http://localhost:3000/teacher-home'), 1000);
                }
                // navigate to the url that will be tested
                await driver.get(url);
                
                await logout(driver)
                
                await driver.wait(until.urlContains('login'), 3000);
                
                const token = await driver.executeScript('return localStorage.getItem("userData");');
                expect(token).toBeNull();

            } catch (error) {
                console.error(`Test failed for URL: ${url}`, error);
                throw error;
            } finally {
                isFirstTest = false;
            }
        });
    });
});
