import { Builder, By, until, WebDriver } from "selenium-webdriver";
import { BASE_URL, SignUpTest } from "./test-input.config";
import chrome from "selenium-webdriver/chrome";
import { forceClearInput, sleep } from ".";

// * Helper function to log test data
const logTestData = (
  testName: string,
  data: {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
    studentId?: string;
    school_year?: string;
  }
) => {
  console.log(`\n🔹 Running Test: ${testName}`);
  console.log(`📧 Email: ${data.email}`);
  console.log(`🔑 Password: ${data.password}`);
  console.log(`👤 Username: ${data.username}`);
  console.log(`👤 First Name: ${data.firstName}`);
  console.log(`👤 Last Name: ${data.lastName}`);
  if (data.studentId) console.log(`🎓 Student ID: ${data.studentId}`);
  if (data.school_year) console.log(`📚 School Year: ${data.school_year}`);
};

async function setupDriver(): Promise<WebDriver> {
  const options = new chrome.Options();
  // options.addArguments("--headless");

  return await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
}

async function findSignUpElements(driver: WebDriver) {
  const emailInput = await driver.findElement(By.css('input[type="email"]'));
  const passwordInput = await driver.findElement(
    By.css('input[type="password"]')
  );
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
  const signUpButton = await driver.findElement(
    By.css("button[name='submit']")
  );

  return {
    emailInput,
    passwordInput,
    usernameInput,
    firstNameInput,
    lastNameInput,
    studentIdInput,
    genderSelect,
    schoolYearSelect,
    signUpButton,
  };
}

async function clearAndFillInputs(
  elements: any,
  data: {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
    studentId: string;
  }
) {
  await sleep(500);
  await forceClearInput(elements.emailInput);
  await forceClearInput(elements.passwordInput);
  await forceClearInput(elements.usernameInput);
  await forceClearInput(elements.firstNameInput);
  await forceClearInput(elements.lastNameInput);
  await forceClearInput(elements.studentIdInput);
  await sleep(500);

  await elements.emailInput.sendKeys(data.email);
  await elements.passwordInput.sendKeys(data.password);
  await elements.usernameInput.sendKeys(data.username);
  await elements.firstNameInput.sendKeys(data.firstName);
  await elements.lastNameInput.sendKeys(data.lastName);
  await elements.studentIdInput.sendKeys(data.studentId);

  await elements.genderSelect.click();
  await sleep(300);
  const genderOption = await elements.genderSelect.findElement(
    By.xpath("/html/body/div[2]/div/div/div[2]/div/div/div/div[1]/div")
  );
  await genderOption.click();
  await sleep(300);

  await elements.schoolYearSelect.click();
  await sleep(300);
  const schoolYearOption = await elements.schoolYearSelect.findElement(
    By.xpath("/html/body/div[3]/div/div/div[2]/div[1]/div/div/div[1]/div")
  );
  await sleep(300);
  await schoolYearOption.click();
  await sleep(500);
}

async function testInvalidEmail(driver: WebDriver, elements: any) {
  logTestData("Invalid Email Format", SignUpTest.InvalidEmail);

  await clearAndFillInputs(elements, SignUpTest.InvalidEmail);
  await elements.signUpButton.click();

  try {
    await driver.wait(until.elementLocated(By.id("email-error")), 3000);
    console.log("✅ Invalid Email Test Passed");
  } catch {
    console.error("❌ Invalid Email Test Failed: No error displayed");
  }
}

async function testUsernameTaken(driver: WebDriver, elements: any) {
  logTestData("Username Already Taken", SignUpTest.UsernameTaken);

  await clearAndFillInputs(elements, SignUpTest.UsernameTaken);
  await elements.signUpButton.click();

  try {
    await driver.wait(until.elementLocated(By.id("username-error")), 3000);
    console.log("✅ Username Taken Test Passed");
  } catch {
    console.error("❌ Username Taken Test Failed: No error displayed");
  }
}

async function testStudentIdTaken(driver: WebDriver, elements: any) {
  logTestData("Student ID Already Taken", SignUpTest.StudentIdTaken);

  await clearAndFillInputs(elements, SignUpTest.StudentIdTaken);
  await elements.signUpButton.click();

  try {
    await driver.wait(until.elementLocated(By.id("student-id-error")), 3000);
    console.log("✅ Student ID Taken Test Passed");
  } catch {
    console.error("❌ Student ID Taken Test Failed: No error displayed");
  }
}

async function testEmailTaken(driver: WebDriver, elements: any) {
  logTestData("Email Already Taken", SignUpTest.EmailTaken);

  await clearAndFillInputs(elements, SignUpTest.EmailTaken);
  await elements.signUpButton.click();

  try {
    await driver.wait(until.elementLocated(By.id("email-taken-error")), 3000);
    console.log("✅ Email Taken Test Passed");
  } catch {
    console.error("❌ Email Taken Test Failed: No error displayed");
  }
}

async function testSuccessfulSignUp(driver: WebDriver, elements: any) {
  logTestData("Successful Sign Up", SignUpTest.SignUpSuccess);

  await clearAndFillInputs(elements, SignUpTest.SignUpSuccess);
  await elements.signUpButton.click();

  try {
    await driver.sleep(1000);
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl === `${BASE_URL}/`) {
      console.log("✅ Successfully navigated to home page");
      console.log("✅ Sign-Up Success Test Passed");
    } else {
      throw new Error("Failed to navigate to home page");
    }
  } catch (error: any) {
    console.error("❌ Sign-Up Success Test Failed:", error);
  }
}

async function runTest(
  testFn: (driver: WebDriver, elements: any) => Promise<void>,
  testName: string
) {
  let driver: WebDriver | undefined;

  try {
    driver = await setupDriver();
    await driver.get(`${BASE_URL}/sign-up`);
    console.log(`🔹 Opened Sign-Up Page for ${testName}`);

    const elements = await findSignUpElements(driver);
    console.log("✅ Found Input Fields & Button");

    await testFn(driver, elements);
  } catch (error) {
    console.error(`❌ Test execution error for ${testName}:`, error);
  } finally {
    if (driver) {
      await sleep(2000);
      await driver.quit();
      console.log(`🔹 ${testName} Finished & Browser Closed`);
    }
  }
}

async function testSignUp() {
  await runTest(testInvalidEmail, "Invalid Email Test");

  await runTest(testUsernameTaken, "Username Taken Test");

  await runTest(testStudentIdTaken, "Student ID Taken Test");

  await runTest(testEmailTaken, "Email Taken Test");

  await runTest(testSuccessfulSignUp, "Successful Sign Up Test");
}

// Run the test
testSignUp();
