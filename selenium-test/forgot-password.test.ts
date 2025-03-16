import { Builder, By, until, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

const BASE_URL = "http://localhost:5173"; // Change if using a different port

async function testForgotPassword() {
  let driver: WebDriver;

  try {
    const options = new chrome.Options();
    options.addArguments("--headless");

    driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

    await driver.get(`${BASE_URL}/forgot-password`);

    const emailInput = await driver.wait(until.elementLocated(By.css('input[type="email"]')), 5000);
    await emailInput.sendKeys("validuser@example.com");

    const submitButton = await driver.findElement(By.css("button"));
    await submitButton.click();

    await driver.wait(until.elementLocated(By.css(".success-message")), 5000);

    console.log("✅ Forgot Password test passed!");
  } catch (error) {
    console.error("❌ Forgot Password test failed:", error);
  } finally {
    await driver?.quit();
  }
}

testForgotPassword();
