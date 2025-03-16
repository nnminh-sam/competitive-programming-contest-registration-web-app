import { useFormik } from "formik";
import { FC, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Button from "../../components/Button";
import Icon from "../../components/Icon/Icon";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Text from "../../components/Text";
import Colors from "../../constants/color";
import { Affiliation } from "../../services/affiliation";
import AffiliationAtom from "../../services/affiliation/affiliation.atom";
import { AuthApi } from "../../services/auth";
import "../SignIn/SignIn.scss";

const SignUp: FC = () => {
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const schoolyearList = useRecoilValue(AffiliationAtom.affiliationList);
  const [serverError, setServerError] = useState<string[]>([]);
  console.log(
    "🚀 ~ serverError:",
    serverError.includes("email must be an email")
  );

  const schoolYearOptions = useMemo(() => {
    return schoolyearList?.map((item: Affiliation) => ({
      label: item.name,
      value: item.id,
    }));
  }, [schoolyearList]);

  const form = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      student_id: "",
      school_year: "", // Only keep school_year
      gender: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.email) {
        errors.email = "Required field";
      }

      if (!values.username) {
        errors.username = "Required field";
      }

      if (!values.password) {
        errors.password = "Required field";
      }

      if (!values.first_name) {
        errors.first_name = "Required field";
      }

      if (!values.last_name) {
        errors.last_name = "Required field";
      }

      if (!values.student_id) {
        errors.student_id = "Required field";
      }

      if (!values.gender) {
        errors.gender = "Required field";
      }

      if (!values.school_year) {
        errors.school_year = "Required field";
      }

      return errors;
    },
    onSubmit: async (values) => {
      const res = await AuthApi.signUp({ ...values, gender: "Male" });
      if (res) {
        nav("/");
      } else {
        setServerError(res || "Invalid credentials");
      }
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      nav("/");
    }
  }, [nav]);

  return (
    <div className="sign-in-container">
      <div className="flex items-center h-full">
        <div className="w-1/2 relative h-full">
          <img
            src="/public/login-bg.svg"
            alt="login-bg"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col gap-6 items-center justify-center">
          <Text type="headline-4" color={Colors.PRIMARY} className="!text-3xl">
            Sign up new account
          </Text>

          <Input
            type="email"
            name="email"
            className="w-[300px]"
            required
            bordered
            label="Email address*"
            placeholder="Enter email address"
            value={form.values.email}
            onChange={form.handleChange}
            error={form.errors.email}
          />
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            className="w-[300px]"
            bordered
            required
            label="Password*"
            placeholder="Enter password"
            value={form.values.password}
            onChange={form.handleChange}
            error={form.errors.password}
            suffix={
              <Icon
                name={!showPassword ? "eye" : "eye-closed"}
                size={20}
                className="cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
                color={Colors.GREY_300}
              />
            }
          />
          <Input
            type="text"
            name="username"
            className="w-[300px]"
            bordered
            label="User name*"
            required
            placeholder="Enter user name"
            value={form.values.username}
            onChange={form.handleChange}
            error={form.errors.username}
          />
          <Input
            type="text"
            name="first_name"
            className="w-[300px]"
            bordered
            label="First Name*"
            required
            placeholder="Enter first name"
            value={form.values.first_name}
            onChange={form.handleChange}
            error={form.errors.first_name}
          />
          <Input
            type="text"
            name="last_name"
            className="w-[300px]"
            bordered
            label="Last name*"
            required
            placeholder="Enter last name"
            value={form.values.last_name}
            onChange={form.handleChange}
            error={form.errors.last_name}
          />
          <Input
            type="text"
            name="student_id"
            className="w-[300px]"
            bordered
            label="Student ID*"
            placeholder="Enter student ID"
            required
            value={form.values.student_id}
            onChange={form.handleChange}
            error={form.errors.student_id}
          />
          <Select
            name="gender"
            className="w-[300px]"
            bordered
            label="Gender*"
            value={form.values.gender}
            onChange={(value) => form.setFieldValue("gender", value)}
            error={form.errors.gender}
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Other", value: "Other" },
            ]}
          />
          <Select
            name="school_year"
            className="w-[300px]"
            bordered
            label="School Year*"
            value={form.values.school_year}
            onChange={(value) => form.setFieldValue("school_year", value)}
            error={form.errors.school_year}
            options={schoolYearOptions}
          />

          <Text
            className="cursor-pointer"
            type="title-2"
            color={Colors.PRIMARY}
            onClick={() => nav("/sign-in")}
          >
            Sign in
          </Text>
          {serverError && (
            <>
              {serverError?.includes("Invalid email") && (
                <div className="text-red-500 mt-2" id="user-not-found">
                  {serverError}
                </div>
              )}
              {serverError?.includes("Invalid password") && (
                <div className="text-red-500 mt-2" id="invalid-password">
                  {serverError}
                </div>
              )}
              {/* Generic error message for other cases */}
              {serverError?.includes("Username is taken") && (
                <div className="text-red-500 mt-2" id="username-error">
                  {serverError}
                </div>
              )}{" "}
              {serverError?.includes("Email is taken") && (
                <div className="text-red-500 mt-2" id="email-taken-error">
                  {serverError}
                </div>
              )}
              {serverError?.includes("Student Id is taken") && (
                <div className="text-red-500 mt-2" id="studentid-error">
                  {serverError}
                </div>
              )}
              {serverError?.includes("email must be an email") && (
                <div className="text-red-500 mt-2" id="email-error">
                  {serverError}
                </div>
              )}
            </>
          )}

          <Button
            loading={form.isSubmitting}
            onClick={() => form.handleSubmit()}
            className="justify-center w-[200px] !h-[45px] text-xl"
          >
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
