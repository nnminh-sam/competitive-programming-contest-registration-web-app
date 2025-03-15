export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  student_id: string;
  school_year: string;
  username: string;
  gender: "Male" | "Female" | "Other";
}
