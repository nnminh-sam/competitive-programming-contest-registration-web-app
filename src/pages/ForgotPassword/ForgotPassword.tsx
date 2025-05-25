import { useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Text from "../../components/Text";
import Colors from "../../constants/color";
import { AuthApi } from "../../services/auth";
import "../SignIn/SignIn.scss";

const ForgotPassword: FC = () => {
  const nav = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string>("");

  const form = useFormik({
    initialValues: {
      email: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      // if (!values.email) {
      //   errors.email = "Required field";
      // } else if (
      //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      // ) {
      //   errors.email = "Invalid email format";
      // }

      // return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSuccessMessage("");
      try {
        const res = await AuthApi.forgotPassword(values.email);
        
        if (!res?.isError) {
          setSuccessMessage("Password reset email sent successfully!");
          setTimeout(() => {
            nav(`/reset-password?token=${res.token}`);
          }, 2000);
        } else {
          form.setErrors({ email: res.message || "Failed to send reset email" });
        }
      } catch (error: any) {
        form.setErrors({ email: error.message || "An unexpected error occurred" });
      } finally {
        setSubmitting(false);
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
              Forgot Password
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
            id="email-input"
          />

          {successMessage ? (
            <div id="success-message" className="text-green-500">
              {successMessage}
            </div>
          ) : (
            <div id="error-message" className="text-red-500">
              {form.errors.email}
            </div>
          )}

          <div className="w-[300px] flex items-center justify-between -mt-4">
            <Text
              className="cursor-pointer"
              type="body-2"
              color={Colors.PRIMARY}
              onClick={() => nav("/sign-in")}
            >
              Sign In
            </Text>
          </div>
          <Button
            loading={form.isSubmitting}
            onClick={() => form.handleSubmit()}
            className="justify-center w-[200px] !h-[45px] text-xl"
          >
            Send Email
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
