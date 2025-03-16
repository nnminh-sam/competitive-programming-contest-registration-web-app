export const BASE_URL = "http://localhost:5173";

export const SignInTest = {
  InvalidEmail: {
    email: "invalid emal",
    password: "randompassword",
  },
  UserNotFound: {
    email: "unusedemail@gmail.com",
    password: "randompassword",
  },
  WrongPassword: {
    email: "nnminh@gmail.com",
    // email: "phuongnamtran1902@gmail.com",
    password: "randompassword",
  },
  SignInSucess: {
    email: "nnminh@gmail.com",
    password: "12345678",
  },
};

export const SignUpTest = {
  InvalidEmail: {
    email: "invalid-email",
    username: "newUser",
    studentId: "12345",
  },
  UsernameTaken: {
    email: "newuser@example.com",
    username: "nnminh",
    studentId: "12345",
  },
  StudentIdTaken: {
    email: "newuser@example.com",
    username: "newUsername",
    studentId: "N21DCCN053",
  },
  EmailTaken: {
    email: "nnminh@gmail.com",
    username: "newUsername",
    studentId: "54321",
  },
  SignUpSuccess: {
    email: "randomuser1@gmail.com",
    username: "randomuser1",
    studentId: "randomuser1",
  },
};

export const AccountTest = [
  {
    scenario: "Invalid email",
    email: "invalid-email",
    username: "anyUser",
    studentId: "12345",
    expectedError: "Invalid email",
  },
  {
    scenario: "Username is taken",
    email: "valid@example.com",
    username: "usedUsername",
    studentId: "12345",
    expectedError: "Username is taken",
  },
  {
    scenario: "Student ID is taken",
    email: "valid@example.com",
    username: "unusedUsername",
    studentId: "usedStudentId",
    expectedError: "Student id is taken",
  },
  {
    scenario: "Email is taken",
    email: "used@example.com",
    username: "unusedUsername",
    studentId: "unusedStudentId",
    expectedError: "Email is taken",
  },
  {
    scenario: "Sign up success",
    email: "new@example.com",
    username: "newUsername",
    studentId: "newStudentId",
    expectedError: "Sign up success",
  },
];
