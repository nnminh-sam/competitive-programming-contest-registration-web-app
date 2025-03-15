import classNames from "classnames";
import Lottie from "lottie-light-react";
import { FC } from "react";

import animationData from "../../../public/animations/button-loading.json";

interface ButtonLoadingProps {
  className?: string;
}

const ButtonLoading: FC<ButtonLoadingProps> = ({ className }) => {
  return (
    <Lottie
      animationData={animationData}
      width={120}
      height={120}
      className={classNames("static flex", className)}
    />
  );
};
export default ButtonLoading;
