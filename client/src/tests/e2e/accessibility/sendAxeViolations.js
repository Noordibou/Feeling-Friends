const { Builder, By, until, Select } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const axios = require('axios');
const axeSource = require('axe-core');
const { signupNewUser, deleteTeacherUser, login, getRandomString, expectLoginFail } = require('../utils.js');
require('dotenv').config();

const chromeOptions = new chrome.Options();
chromeOptions.addArguments('--headless');
chromeOptions.addArguments('--no-sandbox');
chromeOptions.addArguments('--disable-dev-shm-usage');

let driver;
let email, password, firstname, lastname, username;
let teacherId, classroomId, studentId, studentName;
let formattedData;
const BASE_URL = process.env.REACT_APP_URL + "/api/axe-violations";

async function addAxeViolations(axeData) {
  try {
    const response = await axios.post(BASE_URL, axeData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Axe violations sent successfully', response.data);
  } catch (error) {
    console.error('Error sending Axe violations:', error.response ? error.response.data : error.message);
  }
}

function getRandomEmail() {
  const randomString = getRandomString(8);
  return `${randomString}@email.com`;
}

async function getUserId(driver) {
  // Wait for localStorage to contain the 'userData'
  const userId = await driver.executeScript(`
    let userData;
    const checkLocalStorage = () => {
      userData = localStorage.getItem('userData');
      return userData !== null;
    };
    const wait = () => new Promise((resolve) => {
      const interval = setInterval(() => {
        if (checkLocalStorage()) {
          clearInterval(interval);
          const parsedData = JSON.parse(userData);
          resolve(parsedData._id); // Return just the _id
        }
      }, 100); // Check every 100 milliseconds
    });
    return wait();
  `);

  return userId;
}

async function createClassroom(driver) {
  // Navigate to classroom creation page
  await driver.sleep(500);
  await driver.get('http://localhost:3000/createclass');
  console.log("navigated to page")
  await driver.sleep(500);
  // Fill out classroom creation form
  const inputSubjectElement = await driver.findElement(By.css('input[placeholder="Math"]'));
  const inputLocationElement = await driver.findElement(By.css('input[placeholder="Classroom 101"]'));
  const morningInput = await driver.findElement(By.css('input[placeholder="00:00 AM"]'));
  const eveningInput = await driver.findElement(By.css('input[placeholder="00:00 PM"]'));
  console.log("could get inputs yay")
  await driver.sleep(500);
  // Input the values
  await inputSubjectElement.sendKeys('TestClass');
  await inputLocationElement.sendKeys('Class 202');
  await morningInput.sendKeys('08:00 AM');
  await eveningInput.sendKeys('09:00 AM');
  await driver.sleep(500);

  const studentEntry = await driver.findElement(By.xpath(`//div[div/span[contains(text(), "${studentName}")]]`));
  const label = await studentEntry.findElement(By.xpath('.//label'));
  await driver.executeScript("arguments[0].scrollIntoView(true);", label);
  await driver.wait(until.elementIsVisible(label), 500);

  await label.click();

  const saveButton = await driver.findElement(By.css('div[aria-label="Save"]'));
  await driver.executeScript("arguments[0].scrollIntoView();", saveButton);
  await driver.executeScript("arguments[0].click();", saveButton);
  
  // Wait for navigation or any necessary condition after saving
  await driver.sleep(2000); // Adjust timing as necessary based on your app behavior

  const userData = await driver.executeScript('return localStorage.getItem("userData");');
  const parsedUserObject = JSON.parse(userData);
  classroomId = parsedUserObject.classrooms[0]._id;
  studentId = parsedUserObject.classrooms[0].students[0].student;
}

async function addStudent(driver) {
  await driver.sleep(500);
  await driver.get(`http://localhost:3000/add-student`);
  await driver.sleep(500);
  await driver.findElement(By.id('firstName')).sendKeys('Test Student');
  await driver.findElement(By.id('lastName')).sendKeys('Test Lastname');
  await driver.findElement(By.id('email')).sendKeys('studentEmail@email.com');
  studentName = "Test Student" 

  const iepStatusSelect = await driver.findElement(By.id('iepStatus'));
  const selectElement = new Select(iepStatusSelect);

  // Select the "Yes" option by visible text
  await selectElement.selectByVisibleText('Yes');
  const saveButton = await driver.findElement(By.css('button[aria-label="Save changes"]'));
  await saveButton.click();
}


async function deleteStudent(driver, teacherId, classroomId, studentId) {
  // Navigate to the student's page
  const studentUrl = `http://localhost:3000/${teacherId}/${classroomId}/${studentId}`;
  await driver.sleep(500);
  await driver.get(studentUrl);
  await driver.sleep(500);
  await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");

  // Find the delete button by text and click it
  await driver.wait(
    until.elementLocated(By.xpath("//button[h3[contains(text(), 'Delete')]]")),
    500
  );
  const deleteAccountButton = await driver.findElement(
    By.xpath("//button[h3[contains(text(), 'Delete Student')]]")
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



  console.log(`Deleted student with ID: ${studentId}`);
}

async function runAccessibilityTests() {
  driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
  
  try {
    // Setup: signup and get teacher & classroom IDs
    email = getRandomEmail();
    firstname = getRandomString(6);
    lastname = getRandomString(6);
    username = getRandomString(8);
    password = getRandomString(8);
    
    await driver.get('http://localhost:3000/signup');
    await signupNewUser(driver, firstname, lastname, username, email, password);
    await driver.wait(until.urlIs('http://localhost:3000/teacher-home'), 3000);
    
    // Retrieve local storage item after signup
    teacherId = await getUserId(driver);
    
    // Check if teacherId is retrieved successfully
    if (!teacherId) {
      console.error("Teacher ID not found in local storage.");
    } else {
      console.log("Retrieved Teacher ID:", teacherId);
    }

    // Add a student to the newly created classroom
    await addStudent(driver, classroomId);
    await driver.sleep(500);
    // Create a new classroom using the helper function
    await createClassroom(driver);

    const urls = [
      `http://localhost:3000/teacher-home`,
      `http://localhost:3000/classroom/${teacherId}/${classroomId}`,
      `http://localhost:3000/viewclasslist/${teacherId}/${classroomId}`,
      `http://localhost:3000/${teacherId}/${classroomId}/${studentId}`,
      `http://localhost:3000/edit-seating-chart/${teacherId}/${classroomId}`,
      `http://localhost:3000/editneedsgoals/${teacherId}/${classroomId}`,
      `http://localhost:3000/createclass`,
      `http://localhost:3000/add-student`
    ];

    for (const url of urls) {
      console.log(`Testing accessibility for: ${url}`);
      await driver.get(url);
      
      // Inject axe-core into the page
      await driver.executeScript(axeSource.source);
      
      const results = await driver.executeAsyncScript(function(callback) {
        /* global axe */
        axe.run(function(err, results) {
          if (err) {
            console.error('Error running Axe:', err);
            callback([]);
          } else {
            callback(results);
          }
        });
      });
      
      const formattedResults = results.violations.map(violation => ({
        issueTitle: `${violation.help}`,
        issueDesc: violation.nodes.map(node =>
          node.any.map(issue => {
            const relatedNodes = issue.relatedNodes.map(rn => rn.html).join(', ') || node.html;
            return `${issue.message} (${issue.impact}), Related Nodes: ${relatedNodes}`;
          })
        ).flat()
      }));
      
      formattedData = {
        pageUrl: url,
        issues: formattedResults
      };
      
      console.log(`Accessibility violations for ${url}:`, results.violations.length);
      
      await addAxeViolations(formattedData);
    }
  } catch (error) {
    console.error('Error during tests:', error);
  } finally {
    // Cleanup
    try {
      await driver.get("http://localhost:3000/login");
      await login(driver, email, password);
      await driver.sleep(500); 
      await driver.navigate().refresh();
      await driver.wait(until.urlIs("http://localhost:3000/teacher-home"), 1000);
      await driver.sleep(500);
      await deleteStudent(driver, teacherId, classroomId, studentId)
      await driver.sleep(500);
      await deleteTeacherUser(driver);
      await driver.get("http://localhost:3000/login");
      await login(driver, email, password);
      await driver.sleep(1000);
      await expectLoginFail(driver, email, password, false);
    } finally {
      await driver.quit();
    }
  }
}

runAccessibilityTests();