import { useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Icon from "../../components/Icon/Icon";
import Input from "../../components/Input";
import Text from "../../components/Text";
import Colors from "../../constants/color";
import { AuthApi } from "../../services/auth";
import "./SignIn.scss";

const SignIn: FC = () => {
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const form = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.email) {
        errors.email = "Required field";
      }

      if (!values.password) {
        errors.password = "Required field";
      }

      return errors;
    },
    onSubmit: async (values) => {
      const res = await AuthApi.signIn(values);
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
              Sign in to your Account
            </Text>
          </div>
          <Input
            type="email"
            className="w-[300px]"
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
          <div className="w-[300px] flex items-center justify-between -mt-4">
            <Text
              className="cursor-pointer"
              type="body-2"
              color={Colors.PRIMARY}
            >
              Forgot password
            </Text>
            <Text
              className="cursor-pointer"
              type="title-2"
              color={Colors.PRIMARY}
              onClick={() => nav("/sign-up")}
            >
              Sign up
            </Text>
          </div>
          <Button
            loading={form.isSubmitting}
            onClick={() => form.handleSubmit()}
            className="justify-center w-[200px] !h-[45px] text-xl"
          >
            Sign In
          </Button>
          <div className="flex justify-between items-center"></div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
