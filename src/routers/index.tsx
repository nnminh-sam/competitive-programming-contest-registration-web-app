import { FC } from "react";
import { RouterProvider } from "react-router-dom";

import { router } from "./config";

const Routers: FC = () => {
  return <RouterProvider router={router} />;
};

export default Routers;
