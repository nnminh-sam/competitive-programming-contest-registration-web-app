import { Builder, By, until, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import { SignInTest, BASE_URL } from "./test-input.config";

// const BASE_URL = "http://localhost:5173"; // Adjust if needed

async function testSignIn() {
  let driver: WebDriver;

  try {
    const options = new chrome.Options();
    options.addArguments("--headless"); // Run in headless mode

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
    await driver.get(`${BASE_URL}/sign-in`);

    console.log("🔹 Opened Sign-In Page");

    // Locate elements
    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[type="email"]')),
      5000
    );
    const passwordInput = await driver.findElement(
      By.css('input[type="password"]')
    );
    const signInButton = await driver.findElement(By.css("button"));

    console.log("✅ Found Input Fields & Button");

    // Test Case 1: Invalid email format
    await emailInput.sendKeys(SignInTest.InvalidEmail.email);
    await passwordInput.sendKeys(SignInTest.InvalidEmail.password);
    await signInButton.click();

    try {
      await driver.wait(until.elementLocated(By.css(".input-error")), 3000);
      console.log("✅ Invalid Email Test Passed");
    } catch {
      console.error("❌ Invalid Email Test Failed: No error displayed");
    }

    // Test Case 2: Correct email but no user found
    await emailInput.clear();
    await passwordInput.clear();
    await emailInput.sendKeys(SignInTest.UserNotFound.email);
    await passwordInput.sendKeys(SignInTest.UserNotFound.password);
    await signInButton.click();

    try {
      await driver.wait(until.elementLocated(By.id("user-not-found")), 3000);
      console.log("✅ User Not Found Test Passed");
    } catch {
      console.error("❌ User Not Found Test Failed: No error displayed");
    }

    // Test Case 3: Correct email but wrong password
    await emailInput.clear();
    await passwordInput.clear();
    await emailInput.sendKeys(SignInTest.WrongPassword.email);
    await passwordInput.sendKeys(SignInTest.WrongPassword.password);
    await signInButton.click();

    try {
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.id("invalid-password")), 3000);
      console.log("✅ Wrong Password Test Passed");
    } catch {
      console.error("❌ Wrong Password Test Failed: No error displayed");
    }

    // Test Case 4: Successful sign-in
    await emailInput.clear();
    await passwordInput.clear();
    await emailInput.sendKeys(SignInTest.SignInSucess.email);
    await passwordInput.sendKeys(SignInTest.SignInSucess.password);
    await signInButton.click();

    try {
      await driver.sleep(1000);
      await driver.wait(until.urlIs(`${BASE_URL}`), 5000);
      console.log("✅ Sign-In Success Test Passed");
    } catch {
      console.error(
        "❌ Sign-In Success Test Failed: Did not navigate to home page"
      );
    }
  } catch (error) {
    console.error("❌ Test execution error:", error);
  } finally {
    await driver?.quit();
    console.log("🔹 Test Finished & Browser Closed");
  }
}

// Run the test
testSignIn();
