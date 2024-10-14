import axios from 'axios';
import { Builder, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { signupNewUser, deleteTeacherUser, login, getClassroomId, getTeacherId, getRandomString, expectLoginFail } from '../utils.js';
import axeSource from 'axe-core';

const chromeOptions = new chrome.Options();
chromeOptions.addArguments('--headless');
chromeOptions.addArguments('--no-sandbox');
chromeOptions.addArguments('--disable-dev-shm-usage');

describe('Accessibility tests', () => {
  let driver;
  let email, password, firstname, lastname, username;
  let teacherId, classroomId;
  let formattedData;
  const BASE_URL = process.env.REACT_APP_URL + "/api/axe-violations"

  function getRandomEmail() {
    const randomString = getRandomString(8);
    return `${randomString}@email.com`;
  }
  async function addAxeViolations(axeData) { 

    const response = await axios.post(BASE_URL, axeData, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    // Validate the response
    expect(response.status).toBe(200); // Adjust based on expected status code
    expect(response.data).toEqual({
        // Expected response structure
    });
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


    await driver.sleep(3000);
  });

  afterAll(async () => {
    try {
      await driver.get("http://localhost:3000/login");
      await login(driver, email, password);
      await driver.sleep(500); // Replace with explicit waits for better reliability
      await driver.navigate().refresh();
      await driver.wait(until.urlIs("http://localhost:3000/teacher-home"), 1000);
      await driver.sleep(500);
      await deleteTeacherUser(driver);
      await driver.get("http://localhost:3000/login");
      await login(driver, email, password);
      await driver.sleep(1000);
      await expectLoginFail(driver, email, password, true);
    } finally {
      await driver.quit();
    }
  });
  // Initialize URLs after getting IDs
  const urls = [
    `http://localhost:3000/teacher-home`,
    `http://localhost:3000/classroom/${teacherId}/${classroomId}`,
    `http://localhost:3000/viewclasslist/${teacherId}/${classroomId}`,
    `http://localhost:3000/${teacherId}/${classroomId}/:studentId`, // Replace with actual studentId later
    `http://localhost:3000/edit-seating-chart/${teacherId}/${classroomId}`,
    `http://localhost:3000/editneedsgoals/${teacherId}/${classroomId}`,
    `http://localhost:3000/createclass`,
    `http://localhost:3000/add-student`
  ];
  jest.setTimeout(30000);
  // Accessibility tests for each URL
  urls.forEach(url => {
    test(`should have no accessibility violations on ${url}`, async () => {
      // Navigate to the current URL
      await driver.get(url);
  
      // Inject axe-core into the page
      await driver.executeScript(axeSource.source);
  
      // Run accessibility checks
      const results = await driver.executeAsyncScript(function(callback) {
        /* global axe */
        axe.run(function(err, results) {
          if (err) {
            console.error(err);
            return callback([]); // If there's an error, return an empty array
          }
          callback(results);
        });
      });
  
      // Reformat the results as per your structure
      const formattedResults = results.violations.map(violation => ({
        issueTitle: `${violation.help} (${violation.nodes.map(node => node.html).join(', ')})`,
        issueDesc: violation.nodes.map(node =>
          node.any.map(issue => {
            // Check if relatedNodes exist, otherwise fallback to the html of the node
            const relatedNodes = issue.relatedNodes.map(rn => rn.html).join(', ') || node.html;
            return `${issue.message} (${issue.impact}), Related Nodes: ${relatedNodes}`;
          })
        ).flat()
      }));
  
      formattedData = {
        pageUrl: url,
        issues: formattedResults
      };
      
      await addAxeViolations(formattedData)
      // Assert that there are no violations (this will still fail the test if there are issues)
      expect(results.violations.length).toBe(0);
    }, 30000);
  });
});