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
import { Affiliation, AffiliationApi } from "../../services/affiliation";
import AffiliationAtom from "../../services/affiliation/affiliation.atom";
import { AuthApi } from "../../services/auth";
import "../SignIn/SignIn.scss";

const SignUp: FC = () => {
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const affiliationList = useRecoilValue(AffiliationAtom.affiliationList);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAffiliationList = async () => {
      setIsLoading(true);
      try {
        await AffiliationApi.getList({ page: 1, limit: 100 });
      } catch (error) {
        console.error("Failed to fetch affiliation list:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAffiliationList();
  }, []);

  const schoolYearOptions = useMemo(() => {
    if (!affiliationList) return [];
    return affiliationList.map((item: Affiliation) => ({
      label: item.name,
      value: item.id,
    }));
  }, [affiliationList]);

  const form = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      student_id: "",
      school_year: "",
      gender: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.email) {
        errors.email = "Required field";
      }
      // else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      //   errors.email = "Invalid email format";
      // }
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
      if (res?.isError) {
        setError(res.message || "Invalid credentials");
        return;
      }
      form.resetForm();
      nav("/sign-in");
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
            value={form.values.student_id}
            onChange={form.handleChange}
            error={form.errors.student_id}
          />
          <Select
            id="gender"
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
            id="school_year"
            className="w-[300px]"
            bordered
            label="School Year*"
            value={form.values.school_year}
            onChange={(value) => form.setFieldValue("school_year", value)}
            error={form.errors.school_year}
            options={schoolYearOptions}
            loading={isLoading}
          />

          <Text
            className="cursor-pointer"
            type="title-2"
            color={Colors.PRIMARY}
            onClick={() => nav("/sign-in")}
          >
            Sign in
          </Text>
          {error && (
            <>
              {error.toLowerCase().includes("username is taken") && (
                <div className="text-red-500 mt-2" id="username-error">
                  {error}
                </div>
              )}
              {error.toLowerCase().includes("invalid email") && (
                <div className="text-red-500 mt-2" id="email-error">
                  {error}
                </div>
              )}
              {error.toLowerCase().includes("email is taken") && (
                <div className="text-red-500 mt-2" id="email-taken-error">
                  {error}
                </div>
              )}
              {error.toLowerCase().includes("student id is taken") && (
                <div className="text-red-500 mt-2" id="student-id-error">
                  {error}
                </div>
              )}
              {error.toLowerCase().includes("email must be an email") && (
                <div className="text-red-500 mt-2" id="email-error">
                  {error}
                </div>
              )}
            </>
          )}

          <Button
            loading={form.isSubmitting}
            onClick={() => form.handleSubmit()}
            name="submit"
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
