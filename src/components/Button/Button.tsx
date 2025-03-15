import "./Button.scss";

import classNames from "classnames";
import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

import { IconNames } from "../Icon/Icon.type";
import Icon from "../Icon/Icon";
import { ButtonLoading } from "../ButtonLoading";

interface ButtonProps
  extends Omit<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    "type"
  > {
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  type?: "solid" | "outline" | "borderless" | "icon";
  htmlType?: "submit" | "reset" | "button";
  icon?: IconNames;
}

const Button: FC<ButtonProps> = ({
  children,
  className,
  disabled,
  loading,
  variant = "primary",
  type = "solid",
  icon,
  ...rest
}) => {
  return (
    <button
      className={classNames(
        "pixel-button",
        variant,
        type,
        { disabled, loading },
        className
      )}
      disabled={disabled}
      {...rest}
    >
      {loading && <ButtonLoading className="h-full w-14 -mx-4" />}
      {icon && <Icon name={icon} size={20} />}
      {children}
    </button>
  );
};

export default Button;
