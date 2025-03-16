import { message } from "antd";
import { setRecoil } from "recoil-nexus";
import Api from "../api";
import ContestantAtom from "../contestant/contestant.atom";
import { SignInPayload, SignUpPayload } from "./auth.type";

const signIn = async (payload: SignInPayload) => {
  try {
    const res = await Api({
      method: "POST",
      url: "v1/auth/sign-in",
      data: payload,
    });

    if (res.status < 300) {
      const token = res.data.data.jwt;
      if (token) {
        localStorage.setItem("token", token);
        const contestant = res.data.data.contestant;
        setRecoil(ContestantAtom.curentContestant, contestant);
        return contestant;
      }
    }
    return false;
  } catch (error: any) {
    message.error(error.message);
    return error.message;
  }
};

const signUp = async (payload: SignUpPayload) => {
  try {
    const res = await Api({
      method: "POST",
      url: "v1/auth/sign-up",
      data: payload,
    });

    if (res.status < 300) {
      const token = res.data.data.jwt;
      if (token) {
        localStorage.setItem("token", token);
        const contestant = res.data.data.contestant;
        setRecoil(ContestantAtom.curentContestant, contestant);
        return contestant;
      }
    }
    return false;
  } catch (error: any) {
    message.error(error.message);
    return {
      isError: true,
      message: error.message,
    };
  }
};

const forgotPassword = async (email: string) => {
  try {
    const res = await Api({
      method: "POST",
      url: "v1/auth/forgot-password",
      data: { email },
    });

    if (res.status < 300) {
      return res.data.data;
    }
    return false;
  } catch (error: any) {
    message.error(error.message);
  }
};

const resetPassword = async (payload: {
  new_password: string;
  token: string;
}) => {
  try {
    const res = await Api({
      method: "POST",
      url: "v1/auth/reset-password",
      data: payload,
    });

    if (res.status < 300) {
      return true;
    }
    return false;
  } catch (error: any) {
    message.error(error.message);
  }
};
const AuthApi = {
  signIn,
  signUp,
  forgotPassword,
  resetPassword,
};
export default AuthApi;
