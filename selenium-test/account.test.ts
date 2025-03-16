import { Builder, By, until, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import { BASE_URL, AccountTest } from "./test-input.config";

async function testAccountPage() {
  let driver: WebDriver;

  try {
    // Open Account Page
    const options = new chrome.Options();
    options.addArguments("--headless");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
    await driver.get(`${BASE_URL}/account`);

    // Test Cases
    // const testCases = [
    //   {
    //     scenario: "Invalid email",
    //     email: "invalid-email",
    //     username: "anyUser",
    //     studentId: "12345",
    //     expectedError: "Invalid email error",
    //   },
    //   {
    //     scenario: "Username is taken",
    //     email: "valid@example.com",
    //     username: "usedUsername",
    //     studentId: "12345",
    //     expectedError: "Username is taken",
    //   },
    //   {
    //     scenario: "Student ID is taken",
    //     email: "valid@example.com",
    //     username: "unusedUsername",
    //     studentId: "usedStudentId",
    //     expectedError: "Student ID is taken",
    //   },
    //   {
    //     scenario: "Email is taken",
    //     email: "used@example.com",
    //     username: "unusedUsername",
    //     studentId: "unusedStudentId",
    //     expectedError: "Email is taken",
    //   },
    //   {
    //     scenario: "Sign up success",
    //     email: "new@example.com",
    //     username: "newUsername",
    //     studentId: "newStudentId",
    //     expectedError: "Sign up success",
    //   },
    // ];

    for (const testCase of AccountTest) {
      console.log(`Running test: ${testCase.scenario}`);

      // Find and fill the input fields
      const emailInput = await driver.findElement(By.name("email"));
      await emailInput.sendKeys(testCase.email);
      const usernameInput = await driver.findElement(By.name("username"));
      await usernameInput.sendKeys(testCase.username);
      const studentIdInput = await driver.findElement(By.name("student-id"));
      await studentIdInput.sendKeys(testCase.studentId);

      // Submit the form
      await driver.findElement(By.name("save-btn")).click();

      // Wait for the error/success message
      const errorMessage = await driver.wait(
        until.elementLocated(By.css(".error-message, .success-message")),
        5000
      );

      const errorText = await errorMessage.getText();
      console.log(`Expected: "${testCase.expectedError}", Got: "${errorText}"`);

      if (errorText !== testCase.expectedError) {
        console.error(`❌ Test failed: ${testCase.scenario}`);
      } else {
        console.log(`✅ Test passed: ${testCase.scenario}`);
      }
    }
  } finally {
    await driver.quit();
  }
}

testAccountPage();
