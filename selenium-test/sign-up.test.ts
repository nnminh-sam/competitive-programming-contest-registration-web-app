import { Builder, By, until, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

const BASE_URL = "http://localhost:5173"; // Change if needed

async function testSignUp() {
  let driver: WebDriver;

  try {
    const options = new chrome.Options();
    options.addArguments("--headless");

    driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
    await driver.get(`${BASE_URL}/sign-up`);

    const emailInput = await driver.findElement(By.name("email"));
    const usernameInput = await driver.findElement(By.name("username"));
    const studentIdInput = await driver.findElement(By.name("student_id"));
    const signUpButton = await driver.findElement(By.css("button"));

    // Test Case 1: Invalid email format
    await emailInput.sendKeys("invalid-email");
    await signUpButton.click();
    await driver.wait(until.elementLocated(By.id("email-error")), 3000);
    console.log("✅ Invalid Email Test Passed");

    // Test Case 2: Username is taken
    await emailInput.clear();
    await usernameInput.clear();
    await studentIdInput.clear();
    await emailInput.sendKeys("newuser@example.com");
    await usernameInput.sendKeys("existingUser");
    await studentIdInput.sendKeys("12345");
    await signUpButton.click();
    await driver.wait(until.elementLocated(By.id("username-error")), 3000);
    console.log("✅ Username Taken Test Passed");

    // Test Case 3: Student ID is taken
    await emailInput.clear();
    await usernameInput.clear();
    await studentIdInput.clear();
    await emailInput.sendKeys("newuser@example.com");
    await usernameInput.sendKeys("newUsername");
    await studentIdInput.sendKeys("usedStudentID");
    await signUpButton.click();
    await driver.wait(until.elementLocated(By.id("student-id-error")), 3000);
    console.log("✅ Student ID Taken Test Passed");

    // Test Case 4: Email is taken
    await emailInput.clear();
    await usernameInput.clear();
    await studentIdInput.clear();
    await emailInput.sendKeys("existing@example.com");
    await usernameInput.sendKeys("newUsername");
    await studentIdInput.sendKeys("54321");
    await signUpButton.click();
    await driver.wait(until.elementLocated(By.id("email-taken-error")), 3000);
    console.log("✅ Email Taken Test Passed");

    // Test Case 5: Successful sign-up
    await emailInput.clear();
    await usernameInput.clear();
    await studentIdInput.clear();
    await emailInput.sendKeys("newuser@example.com");
    await usernameInput.sendKeys("newUsername123");
    await studentIdInput.sendKeys("uniqueID");
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
