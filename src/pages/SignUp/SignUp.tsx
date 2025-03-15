import { useFormik } from "formik";
import { FC, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Icon from "../../components/Icon/Icon";
import Input from "../../components/Input";
import Text from "../../components/Text";
import Colors from "../../constants/color";
import { AuthApi } from "../../services/auth";
import Select from "../../components/Select";
import "../SignIn/SignIn.scss";
import { Affiliation, AffiliationApi } from "../../services/affiliation";
import { useRecoilValue } from "recoil";
import AffiliationAtom from "../../services/affiliation/affiliation.atom";

const SignUp: FC = () => {
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const schoolyearList = useRecoilValue(AffiliationAtom.affiliationList);
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
      school_year_id: "",
      gender: "",
      school_year: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.email) {
        errors.email = "Required field";
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

      // if (!values.school_year_id) {
      //   errors.school_year_id = "Required field";
      // }

      return errors;
    },
    onSubmit: async (values) => {
      const res = await AuthApi.signUp({ ...values, schoolYear: "abc" });
      if (res) {
        nav("/");
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
          <div className="flex flex-col gap-1 ">
            <Text
              type="headline-4"
              color={Colors.PRIMARY}
              className="!text-3xl"
            >
              Sign up new account
            </Text>
          </div>
          <Input
            type="email"
            className="w-[300px]"
            required
            bordered
            label="Email address*"
            placeholder="Enter email address"
            value={form.values.email}
            onChange={form.handleChange("email")}
            error={form.errors.email}
          />
          <Input
            type={showPassword ? "text" : "password"}
            className="w-[300px]"
            bordered
            required
            label="Password*"
            placeholder="Enter password"
            value={form.values.password}
            onChange={form.handleChange("password")}
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
            className="w-[300px]"
            bordered
            label="User name*"
            required
            placeholder="Enter user name"
            value={form.values.username}
            onChange={form.handleChange("username")}
            error={form.errors.username}
          />
          <Input
            type="text"
            className="w-[300px]"
            bordered
            label="First Name*"
            required
            placeholder="Enter first name"
            value={form.values.first_name}
            onChange={form.handleChange("first_name")}
            error={form.errors.first_name}
          />
          <Input
            type="text"
            className="w-[300px]"
            bordered
            label="Last name*"
            placeholder="Enter last name"
            value={form.values.last_name}
            onChange={form.handleChange("last_name")}
            error={form.errors.last_name}
          />
          <Input
            type="text"
            className="w-[300px]"
            bordered
            label="Student ID*"
            placeholder="Enter student ID"
            required
            value={form.values.student_id}
            onChange={form.handleChange("student_id")}
            error={form.errors.student_id}
          />
          <Select
            className="w-[300px]"
            bordered
            label="Gender*"
            defaultValue={"Male"}
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
            className="w-[300px]"
            bordered
            label="School Year"
            value={form.values.school_year}
            onChange={(value) => form.setFieldValue("school_year", value)}
            error={form.errors.school_year}
            options={schoolYearOptions}
          />
          <div className="w-[300px] flex items-center justify-between -mt-4">
            <Text
              className="cursor-pointer"
              type="title-2"
              color={Colors.PRIMARY}
              onClick={() => nav("/sign-in")}
            >
              Sign in
            </Text>
          </div>
          <Button
            loading={form.isSubmitting}
            onClick={() => form.handleSubmit()}
            className="justify-center w-[200px] !h-[45px] text-xl"
          >
            Sign up
          </Button>
          <div className="flex justify-between items-center"></div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
