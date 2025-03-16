import { Builder, By, until, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import { SignUpTest, BASE_URL } from "./test-input.config";
import { Sign } from "crypto";

// const BASE_URL = "http://localhost:5173"; // Change if needed

async function testSignUp() {
  let driver: WebDriver;

  try {
    const options = new chrome.Options();
    options.addArguments("--headless");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
    await driver.get(`${BASE_URL}/sign-up`);

    const emailInput = await driver.findElement(By.name("email"));
    const usernameInput = await driver.findElement(By.name("username"));
    const studentIdInput = await driver.findElement(By.name("student_id"));
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
    await usernameInput.sendKeys(SignUpTest.UsernameTaken.username);
    await studentIdInput.sendKeys(SignUpTest.UsernameTaken.studentId);
    await signUpButton.click();
    await driver.wait(until.elementLocated(By.id("username-error")), 3000);
    console.log("✅ Username Taken Test Passed");

    // Test Case 3: Student ID is taken
    await emailInput.clear();
    await usernameInput.clear();
    await studentIdInput.clear();
    await emailInput.sendKeys(SignUpTest.StudentIdTaken.email);
    await usernameInput.sendKeys(SignUpTest.StudentIdTaken.username);
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
    await driver.wait(until.urlIs(`${BASE_URL}/sign-in`), 5000);
    console.log("✅ Sign-Up Success Test Passed");
  } catch (error) {
    console.error("❌ Sign-up test failed:", error);
  } finally {
    await driver?.quit();
  }
}

testSignUp();
