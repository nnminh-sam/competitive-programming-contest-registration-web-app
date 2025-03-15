import "./Text.scss";

import classNames from "classnames";
import { FC } from "react";
import { TextProps } from "./Text.type";

const Text: FC<TextProps> = ({
  type = "body-2",
  className,
  children,
  color,
  style,
  ...rest
}) => {
  return (
    <div
      className={classNames("text", type, className)}
      {...rest}
      style={{ ...style, color: !color ? "" : color }}
    >
      {children}
    </div>
  );
};

export default Text;
