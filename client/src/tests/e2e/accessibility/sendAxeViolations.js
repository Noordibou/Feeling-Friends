const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const axios = require('axios');
const axeSource = require('axe-core');
const { signupNewUser, deleteTeacherUser, login, getClassroomId, getTeacherId, getRandomString, expectLoginFail } = require('../utils.js');
require('dotenv').config();

const chromeOptions = new chrome.Options();
// chromeOptions.addArguments('--headless');

let driver;
let email, password, firstname, lastname, username;
let teacherId, classroomId;
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
    teacherId = await getTeacherId(driver);
    classroomId = await getClassroomId(driver);

    // List of URLs to check
    const urls = [
      `http://localhost:3000/teacher-home`,
      `http://localhost:3000/classroom/${teacherId}/${classroomId}`,
      `http://localhost:3000/viewclasslist/${teacherId}/${classroomId}`,
      `http://localhost:3000/${teacherId}/${classroomId}/:studentId`, // Replace with actual studentId
      `http://localhost:3000/edit-seating-chart/${teacherId}/${classroomId}`,
      `http://localhost:3000/editneedsgoals/${teacherId}/${classroomId}`,
      `http://localhost:3000/createclass`,
      `http://localhost:3000/addstudent/${teacherId}/${classroomId}`
    ];

    // Accessibility tests for each URL
    for (const url of urls) {
      console.log(`Testing accessibility for: ${url}`);
      await driver.get(url);
      
      // Inject axe-core into the page
      await driver.executeScript(axeSource.source);
      
      // Run accessibility checks
      const results = await driver.executeAsyncScript(function(callback) {
        axe.run(function(err, results) {
          if (err) {
            console.error('Error running Axe:', err);
            callback([]); // Return an empty array in case of error
          } else {
            callback(results);
          }
        });
      });
      
      // Reformat the results
      const formattedResults = results.violations.map(violation => ({
        issueTitle: `${violation.help} (${violation.nodes.map(node => node.html).join(', ')})`,
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
      
      // Send results to backend
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

// Run the accessibility tests
runAccessibilityTests();