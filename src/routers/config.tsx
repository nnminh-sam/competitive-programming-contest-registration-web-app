import { createBrowserRouter } from "react-router-dom";
// import ProtectedRoute from "../components/ProtectedRoute";
import SignIn from "../pages/SignIn/SignIn";
import SignUp from "../pages/SignUp/SignUp";
import Homepage from "../pages/Homepage/Homepage";
import Account from "../pages/Account/Account";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";

const PUBLIC_ROUTES = [
  {
    path: "sign-in",
    element: <SignIn />,
  },
  {
    path: "sign-up",
    element: <SignUp />,
  },
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/account",
    element: <Account />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
];

export const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <ProtectedRoute />,
  // },
  ...PUBLIC_ROUTES,
]);
