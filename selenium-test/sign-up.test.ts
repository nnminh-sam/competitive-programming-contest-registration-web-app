import { Builder, By, until, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import { BASE_URL, SignUpTest } from "./test-input.config";

// const BASE_URL = "http://localhost:5173"; // Change if needed

async function testSignUp() {
  let driver: WebDriver | undefined;

  try {
    const options = new chrome.Options();
    options.addArguments("--headless");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
    await driver.get(`${BASE_URL}/sign-up`);

    const emailInput = await driver.findElement(By.name("email"));
    const passwordInput = await driver.findElement(By.name("password"));
    const usernameInput = await driver.findElement(By.name("username"));
    const studentIdInput = await driver.findElement(By.name("student_id"));
    const firstName = await driver.findElement(By.name("first_name"));
    const lastName = await driver.findElement(By.name("last_name"));
    console.log("🚀 ~ testSignUp ~ lastName:", lastName);
    const schoolYear = await driver.findElement(By.id("school_year"));
    console.log("🚀 ~ testSignUp ~ schoolYear:", schoolYear);
    const signUpButton = await driver.findElement(By.css("button"));
    console.log("✅ Element loaded");

    // Test Case 1: Invalid email format
    await emailInput.sendKeys(SignUpTest.InvalidEmail.email);
    await signUpButton.click();
    await driver.wait(until.elementLocated(By.id("invalid-email")), 5000);
    console.log("✅ Invalid Email Test Passed");

    // Test Case 2: Username is taken
    await emailInput.clear();
    await usernameInput.clear();
    await studentIdInput.clear();
    await emailInput.sendKeys(SignUpTest.UsernameTaken.email);
    await passwordInput.sendKeys(SignUpTest.UsernameTaken.password);
    await firstName.sendKeys(SignUpTest.UsernameTaken.firstName);
    await lastName.sendKeys(SignUpTest.UsernameTaken.lastName);
    await usernameInput.sendKeys(SignUpTest.UsernameTaken.username);
    await studentIdInput.sendKeys(SignUpTest.UsernameTaken.studentId);
    await signUpButton.click();

    // Add more logging and increase timeout
    console.log("Waiting for username error message...");
    try {
      const errorElement = await driver.wait(
        until.elementLocated(By.id("username-error")),
        10000
      );
      const errorText = await errorElement.getText();
      console.log("Found error message:", errorText);
      console.log("✅ Username Taken Test Passed");
    } catch (error) {
      console.error("Failed to find username error message:", error);
      // Try to get any error message that might be visible
      const errorElements = await driver.findElements(By.css(".text-red-500"));
      for (const element of errorElements) {
        const text = await element.getText();
        console.log("Found error message:", text);
      }
      throw error;
    }

    // Test Case 3: Student ID is taken
    await emailInput.clear();
    await usernameInput.clear();
    await studentIdInput.clear();

    await emailInput.sendKeys(SignUpTest.StudentIdTaken.email);
    await usernameInput.sendKeys(SignUpTest.StudentIdTaken.username);
    await passwordInput.sendKeys(SignUpTest.StudentIdTaken.password);
    await firstName.sendKeys(SignUpTest.StudentIdTaken.firstName);
    await lastName.sendKeys(SignUpTest.StudentIdTaken.lastName);
    await studentIdInput.sendKeys(SignUpTest.StudentIdTaken.studentId);
    await signUpButton.click();
    await driver.wait(until.elementLocated(By.id("studentid-error")), 3000);
    console.log("✅ Student ID Taken Test Passed");

    // Test Case 4: Email is taken
    await emailInput.clear();
    await usernameInput.clear();
    await studentIdInput.clear();
    await emailInput.sendKeys(SignUpTest.EmailTaken.email);
    await usernameInput.sendKeys(SignUpTest.EmailTaken.username);
    await studentIdInput.sendKeys(SignUpTest.EmailTaken.studentId);
    await signUpButton.click();
    await driver.wait(until.elementLocated(By.id("email-taken-error")), 3000);
    console.log("✅ Email Taken Test Passed");

    // Test Case 5: Successful sign-up
    await emailInput.clear();
    await usernameInput.clear();
    await studentIdInput.clear();
    await emailInput.sendKeys(SignUpTest.SignUpSuccess.email);
    await usernameInput.sendKeys(SignUpTest.SignUpSuccess.username);
    await studentIdInput.sendKeys(SignUpTest.SignUpSuccess.studentId);
    await signUpButton.click();
    await driver.wait(until.urlIs(`${BASE_URL}`), 5000);
    console.log("✅ Sign-Up Success Test Passed");
  } catch (error) {
    console.error("❌ Sign-up test failed:", error);
  } finally {
    await driver?.quit();
  }
}

testSignUp();
