import { Builder, By, until, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

const BASE_URL = "http://localhost:5173"; // Change if using a different port

async function testSignIn() {
  let driver: WebDriver;

  try {
    // Set up Chrome options correctly
    const options = new chrome.Options();
    options.addArguments("--headless"); // Correct way to set headless mode

    // Set up the Chrome WebDriver
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    console.log("🚀 ~ testSignIn ~ driver:", driver);
    // Navigate to the sign-in page
    await driver.get(`${BASE_URL}/sign-in`);

    // Wait for email input field to load
    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[type="email"]')),
      5000
    );
    console.log("🚀 ~ testSignIn ~ emailInput:", emailInput);
    await emailInput.sendKeys("phuongnamtran1902@gmail.com");

    // Enter password
    const passwordInput = await driver.findElement(
      By.css('input[type="password"]')
    );
    console.log("🚀 ~ testSignIn ~ passwordInput:", passwordInput);
    await passwordInput.sendKeys("123123");

    // Click the Sign In button
    const signInButton = await driver.findElement(By.css("button"));
    console.log("🚀 ~ testSignIn ~ signInButton:", signInButton);
    await signInButton.click();

    // Wait for navigation to dashboard or home page
    await driver.wait(until.urlIs(`${BASE_URL}/`), 5000);

    console.log("✅ Sign-in test passed!");
  } catch (error) {
    console.error("❌ Sign-in test failed:", error);
  } finally {
    // Quit the WebDriver
    await driver?.quit();
  }
}

testSignIn();
