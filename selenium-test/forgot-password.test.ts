import { Builder, By, until, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import { BASE_URL, SignInTest } from "./test-input.config";

async function testForgotPassword() {
  let driver: WebDriver;

  try {
    const options = new chrome.Options();
    options.addArguments("--headless");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    await driver.get(`${BASE_URL}/forgot-password`);

    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[type="email"]')),
      5000
    );
    const submitButton = await driver.findElement(By.css("button"));

    // Test Case 1: Invalid email format
    await emailInput.sendKeys(SignInTest.InvalidEmail.email);
    await submitButton.click();

    try {
      await driver.wait(until.elementLocated(By.css(".input-error")), 3000);
      console.log("✅ Invalid Email Test Passed");
    } catch {
      console.error("❌ Invalid Email Test Failed: No error displayed");
    }

    // Test Case 2: Valid email
    await emailInput.clear();
    await emailInput.sendKeys(SignInTest.SignInSucess.email);
    await submitButton.click();

    await driver.wait(until.elementLocated(By.id("success-message")), 10000);
    console.log("✅ Valid Email Test Passed");

  } catch (error) {
    console.error("❌ Forgot Password test failed:", error);
  } finally {
    await driver?.quit();
  }
}

testForgotPassword();
