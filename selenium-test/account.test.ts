import { Builder, By, until, WebDriver } from "selenium-webdriver";
import { BASE_URL, AccountTest, SignInAccount } from "./test-input.config";
import chrome from "selenium-webdriver/chrome";
import { forceClearInput, sleep } from ".";

// * Helper function to log test data
const logTestData = (
  testName: string,
  data: { email: string; username: string; studentId: string }
) => {
  console.log(`\n🔹 Running Test: ${testName}`);
  console.log(`📧 Email: ${data.email}`);
  console.log(`👤 Username: ${data.username}`);
  console.log(`🎓 Student ID: ${data.studentId}`);
};

async function setupDriver(): Promise<WebDriver> {
  const options = new chrome.Options();
  // options.addArguments("--headless");

  return await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
}

async function findAccountElements(driver: WebDriver) {
  const emailInput = await driver.findElement(By.css('input[type="email"]'));
  const usernameInput = await driver.findElement(
    By.css('input[name="username"]')
  );
  const firstNameInput = await driver.findElement(
    By.css('input[name="first_name"]')
  );
  const lastNameInput = await driver.findElement(
    By.css('input[name="last_name"]')
  );
  const studentIdInput = await driver.findElement(
    By.css('input[name="student_id"]')
  );
  const genderSelect = await driver.findElement(By.id("gender"));
  const schoolYearSelect = await driver.findElement(By.id("school_year"));
  const checkButton = await driver.findElement(
    By.css("button[name='save-btn']")
  );

  return {
    emailInput,
    usernameInput,
    firstNameInput,
    lastNameInput,
    studentIdInput,
    genderSelect,
    schoolYearSelect,
    checkButton,
  };
}

async function clearAndFillInputs(
  driver: WebDriver,
  elements: any,
  data: {
    email: string;
    username: string;
    studentId: string;
  }
) {
  await sleep(500);
  await forceClearInput(elements.emailInput);
  await forceClearInput(elements.usernameInput);
  await forceClearInput(elements.firstNameInput);
  await forceClearInput(elements.lastNameInput);
  await forceClearInput(elements.studentIdInput);
  await sleep(500);

  await elements.emailInput.sendKeys(data.email);
  await elements.usernameInput.sendKeys(data.username);
  await elements.firstNameInput.sendKeys("Test");
  await elements.lastNameInput.sendKeys("User");
  await elements.studentIdInput.sendKeys(data.studentId);
}

async function testInvalidEmail(driver: WebDriver, elements: any) {
  logTestData("Invalid Email Format", AccountTest.InvalidEmail);

  await clearAndFillInputs(driver, elements, AccountTest.InvalidEmail);
  await sleep(2000);
  await elements.checkButton.click();

  try {
    await driver.wait(
      until.elementLocated(
        By.xpath("/html/body/div/div/div[2]/div/div[2]/div[7]")
      ),
      3000
    );
    console.log("✅ Invalid Email Test Passed");
    await sleep(2000);
  } catch {
    console.error("❌ Invalid Email Test Failed: No error displayed");
    await sleep(2000);
  }
}

async function testUsernameTaken(driver: WebDriver, elements: any) {
  logTestData("Username Already Taken", AccountTest.UsernameTaken);

  await clearAndFillInputs(driver, elements, AccountTest.UsernameTaken);
  await sleep(2000);
  await elements.checkButton.click();

  try {
    await driver.wait(
      until.elementLocated(
        By.xpath("/html/body/div/div/div[2]/div/div[2]/div[7]")
      ),
      3000
    );
    console.log("✅ Username Taken Test Passed");
    await sleep(2000);
  } catch {
    console.error("❌ Username Taken Test Failed: No error displayed");
    await sleep(2000);
  }
}

async function testStudentIdTaken(driver: WebDriver, elements: any) {
  logTestData("Student ID Already Taken", AccountTest.StudentIdTaken);

  await clearAndFillInputs(driver, elements, AccountTest.StudentIdTaken);
  await sleep(2000);
  await elements.checkButton.click();

  try {
    await driver.wait(
      until.elementLocated(
        By.xpath("/html/body/div/div/div[2]/div/div[2]/div[7]")
      ),
      3000
    );
    console.log("✅ Student ID Taken Test Passed");
    await sleep(2000);
  } catch {
    console.error("❌ Student ID Taken Test Failed: No error displayed");
    await sleep(2000);
  }
}

async function testEmailTaken(driver: WebDriver, elements: any) {
  logTestData("Email Already Taken", AccountTest.EmailTaken);

  await clearAndFillInputs(driver, elements, AccountTest.EmailTaken);
  await sleep(2000);
  await elements.checkButton.click();

  try {
    await driver.wait(
      until.elementLocated(
        By.xpath("/html/body/div/div/div[2]/div/div[2]/div[7]")
      ),
      3000
    );
    console.log("✅ Email Taken Test Passed");
    await sleep(2000);
  } catch {
    console.error("❌ Email Taken Test Failed: No error displayed");
    await sleep(2000);
  }
}

async function testUpdateAccountSuccess(driver: WebDriver, elements: any) {
  logTestData("Update Account Success", AccountTest.SuccessUpdate);

  await clearAndFillInputs(driver, elements, AccountTest.SuccessUpdate);
  await sleep(2000);
  await elements.checkButton.click();

  try {
    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'Update success')]")),
      3000
    );
    console.log("✅ Update Account Success Test Passed");
    await sleep(2000);
  } catch {
    console.error(
      "❌ Update Account Success Test Failed: No success message displayed"
    );
    await sleep(2000);
  }
}

async function signIn(driver: WebDriver) {
  await driver.get(`${BASE_URL}/sign-in`);
  console.log("🔹 Opened Sign-In Page");

  const emailInput = await driver.findElement(By.css('input[type="email"]'));
  const passwordInput = await driver.findElement(
    By.css('input[type="password"]')
  );
  const signInButton = await driver.findElement(By.css("button"));

  await forceClearInput(emailInput);
  await forceClearInput(passwordInput);
  await sleep(500);

  await emailInput.sendKeys(SignInAccount.email);
  await passwordInput.sendKeys(SignInAccount.password);
  await signInButton.click();

  try {
    await driver.wait(until.elementLocated(By.id("signed-in")), 3000);
    console.log("✅ Successfully signed in");
    await sleep(2000);
  } catch {
    console.error("❌ Sign in failed");
    throw new Error("Sign in failed");
  }
}

async function runTest(
  testFn: (driver: WebDriver, elements: any) => Promise<void>,
  testName: string
) {
  let driver: WebDriver | undefined;

  try {
    driver = await setupDriver();

    // Sign in first
    await signIn(driver);

    // Then navigate to account page
    await driver.get(`${BASE_URL}/account`);
    console.log(`🔹 Opened Account Page for ${testName}`);

    const elements = await findAccountElements(driver);
    console.log("✅ Found Input Fields & Button");

    await testFn(driver, elements);
  } catch (error) {
    console.error(`❌ Test execution error for ${testName}:`, error);
  } finally {
    if (driver) {
      await driver.quit();
      console.log(`🔹 ${testName} Finished & Browser Closed`);
    }
  }
}

async function testAccount() {
  // await runTest(testInvalidEmail, "Invalid Email Test");
  // await sleep(5000);

  // await runTest(testUsernameTaken, "Username Taken Test");
  // await sleep(5000);

  // await runTest(testStudentIdTaken, "Student ID Taken Test");
  // await sleep(5000);

  // await runTest(testEmailTaken, "Email Taken Test");
  // await sleep(5000);

  await runTest(testUpdateAccountSuccess, "Update Account Success Test");
  await sleep(5000);
}

// Run the test
testAccount();
