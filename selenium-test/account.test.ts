import { Builder, By, logging, until, WebDriver } from "selenium-webdriver";
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

    const emailInput = await driver.findElement(By.name("email"));
    const usernameInput = await driver.findElement(By.name("username"));
    const studentIdInput = await driver.findElement(By.name("student-id"));

    for (let i = 0; i < AccountTest.length; i++) {
      const testCase = AccountTest[i];
      console.log("🚀 ~ testAccountPage ~ testCase:", testCase);
      await emailInput.clear();
      await usernameInput.clear();
      await studentIdInput.clear();

      await emailInput.sendKeys(testCase.email);
      await usernameInput.sendKeys(testCase.username);
      await studentIdInput.sendKeys(testCase.studentId);

      // Submit the form
      const submitBtn = await driver.findElement(By.css("button"));
      await submitBtn.click();

      switch (i) {
        case 0:
          try {
            await driver.wait(
              until.elementLocated(By.id("invalid-email")),
              3000
            );
            console.log("✅ Invalid Email");
          } catch (error: any) {
            console.error(`❌ Invalid email: ${error.message}`);
          }
          break;
        case 1:
          try {
            await driver.wait(
              until.elementLocated(By.id("username-taken")),
              3000
            );
            console.log("✅ Username is taken Test Passed");
          } catch (error: any) {
            console.error(`❌ Username is taken Test Failed: ${error.message}`);
          }
          break;
        case 2:
          try {
            await driver.wait(
              until.elementLocated(By.id("student-id-taken")),
              3000
            );
            console.log("✅ Student ID is taken Test Passed");
          } catch (error: any) {
            console.error(
              `❌ Student ID is taken Test Failed: ${error.message}`
            );
          }
          break;
        case 3:
          try {
            await driver.wait(until.elementLocated(By.id("email-taken")), 3000);
            console.log("✅ Email taken pass test");
          } catch (error: any) {
            console.error(`❌ Invalid email test Failed: ${error.message}`);
          }
          break;
        default:
          console.error(`❌ Test failed: ${testCase.scenario}`);
      }
    }
  } finally {
    await driver.quit();
  }
}

testAccountPage();
