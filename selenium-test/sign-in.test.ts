import { Builder, By, until, WebDriver } from "selenium-webdriver";
import { BASE_URL, SignInTest } from "./test-input.config";
import chrome from "selenium-webdriver/chrome";
import { forceClearInput, sleep } from ".";

// * Helper function to log test data
const logTestData = (
  testName: string,
  data: { email: string; password: string }
) => {
  console.log(`\n🔹 Running Test: ${testName}`);
  console.log(`📧 Email: ${data.email}`);
  console.log(`🔑 Password: ${data.password}`);
};

async function setupDriver(): Promise<WebDriver> {
  const options = new chrome.Options();
  // options.addArguments("--headless");

  return await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
}

async function findSignInElements(driver: WebDriver): Promise<any> {
  const emailInput = await driver.wait(
    until.elementLocated(By.css('input[type="email"]'))
  );
  const passwordInput = await driver.findElement(
    By.css('input[type="password"]')
  );
  const signInButton = await driver.findElement(By.css("button"));

  return { emailInput, passwordInput, signInButton };
}

async function clearAndFillInputs(
  emailInput: any,
  passwordInput: any,
  email: string,
  password: string
) {
  await sleep(500);
  await forceClearInput(emailInput);
  await forceClearInput(passwordInput);
  await sleep(500);
  await emailInput.sendKeys(email);
  await passwordInput.sendKeys(password);
}

async function testInvalidEmail(driver: WebDriver, elements: any) {
  logTestData("Invalid Email Format", SignInTest.InvalidEmail);

  await clearAndFillInputs(
    elements.emailInput,
    elements.passwordInput,
    SignInTest.InvalidEmail.email,
    SignInTest.InvalidEmail.password
  );
  await elements.signInButton.click();

  try {
    await driver.wait(until.elementLocated(By.css(".input-error")), 3000);
    console.log("✅ Invalid Email Test Passed");
  } catch {
    console.error("❌ Invalid Email Test Failed: No error displayed");
  }
}

async function testUserNotFound(driver: WebDriver, elements: any) {
  logTestData("User Not Found", SignInTest.UserNotFound);

  await clearAndFillInputs(
    elements.emailInput,
    elements.passwordInput,
    SignInTest.UserNotFound.email,
    SignInTest.UserNotFound.password
  );
  await elements.signInButton.click();

  try {
    await driver.wait(until.elementLocated(By.id("user-not-found")), 30000);
    console.log("✅ User Not Found Test Passed");
  } catch {
    console.error("❌ User Not Found Test Failed: No error displayed");
  }
}

async function testWrongPassword(driver: WebDriver, elements: any) {
  logTestData("Wrong Password", SignInTest.WrongPassword);

  await clearAndFillInputs(
    elements.emailInput,
    elements.passwordInput,
    SignInTest.WrongPassword.email,
    SignInTest.WrongPassword.password
  );
  await elements.signInButton.click();

  try {
    await driver.wait(until.elementLocated(By.id("invalid-password")), 30000);
    console.log("✅ Wrong Password Test Passed");
  } catch {
    console.error("❌ Wrong Password Test Failed: No error displayed");
  }
}

async function testSuccessfulSignIn(driver: WebDriver, elements: any) {
  logTestData("Successful Sign In", SignInTest.SignInSucess);

  await clearAndFillInputs(
    elements.emailInput,
    elements.passwordInput,
    SignInTest.SignInSucess.email,
    SignInTest.SignInSucess.password
  );
  await elements.signInButton.click();

  try {
    await driver.sleep(1000);
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl === `${BASE_URL}/`) {
      console.log("✅ Successfully navigated to home page");
      console.log("✅ Sign-In Success Test Passed");
    } else {
      throw new Error("Failed to navigate to home page");
    }
  } catch (error: any) {
    await driver
      .wait(until.elementLocated(By.id("signed-in")), 3000)
      .then((data) => {
        console.log(">>> ", data.getText());
      });
    console.error(
      "❌ Sign-In Success Test Failed: Did not navigate to home page",
      error
    );
  }
}

async function testSignIn() {
  let driver: WebDriver | undefined;

  try {
    driver = await setupDriver();
    await driver.get(`${BASE_URL}/sign-in`);
    console.log("🔹 Opened Sign-In Page");

    const elements = await findSignInElements(driver);
    console.log("✅ Found Input Fields & Button");

    // Run all test cases
    await sleep(5000);
    await testInvalidEmail(driver, elements);

    await sleep(5000);
    await testUserNotFound(driver, elements);

    await sleep(5000);
    await testWrongPassword(driver, elements);

    await sleep(5000);
    await testSuccessfulSignIn(driver, elements);

    await sleep(5000);
  } catch (error) {
    console.error("❌ Test execution error:", error);
  } finally {
    if (driver) {
      await driver.quit();
      console.log("🔹 Test Finished & Browser Closed");
    }
  }
}

// Run the test
testSignIn();
