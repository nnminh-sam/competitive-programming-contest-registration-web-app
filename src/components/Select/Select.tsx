import "./Select.scss";

import { Select as AntSelect, SelectProps } from "antd";
import classNames from "classnames";
import { FC, ReactNode } from "react";

import Icon from "../Icon/Icon";
import Colors from "../../constants/color";

interface Props extends Omit<SelectProps, "bordered"> {
  label?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  inputClassName?: string;
  error?: string;
  hint?: string;
  bordered?: boolean;
  isInFormItem?: boolean;
}

const Select: FC<Props> = ({
  label,
  className,
  prefix,
  inputClassName,
  suffix,
  error,
  hint,
  suffixIcon,
  bordered = false,
  isInFormItem,
  ...rest
}) => {
  return (
    <div
      className={classNames("input-container", className, {
        disabled: rest.disabled,
        bordered,
        "in-form-item": isInFormItem,
      })}
    >
      {label && <label className="input-label">{label}</label>}
      <div className={classNames("input-field")}>
        {prefix && <div className={"prefix"}>{prefix}</div>}
        <AntSelect
          size="large"
          className={classNames("input", inputClassName)}
          {...rest}
          suffixIcon={
            !rest.disabled &&
            (suffixIcon || (
              <Icon name="chevron-down" color={Colors.GREY_700} size={20} />
            ))
          }
        />
        {suffix && <div className={"suffix"}>{suffix}</div>}
      </div>

      {hint && <span className="hint">{hint}</span>}
      {error && <span className="error">{error}</span>}
    </div>
  );
};

export default Select;
