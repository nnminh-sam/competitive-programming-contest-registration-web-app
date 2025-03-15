import "./Input.scss";

import classNames from "classnames";
import { DetailedHTMLProps, FC, ReactNode, useCallback } from "react";

interface InputProps
  extends Omit<
    DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "prefix"
  > {
  error?: string | false;
  inputClassName?: string;
  label?: string;
  bordered?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

const Input: FC<InputProps> = ({
  autoFocus = false,
  className,
  error,
  inputClassName,
  label,
  required,
  bordered = false,
  prefix,
  suffix,
  ...props
}) => {
  const callbackRef = useCallback(
    (inputElement: any) => {
      if (inputElement && autoFocus) {
        setTimeout(() => inputElement.focus(), 5);
      }
    },
    [autoFocus],
  );

  return (
    <div
      className={classNames("input-container", className, {
        bordered: bordered,
      })}
    >
      {label && (
        <label
          className={classNames("pui-text body-2", {
            required: required,
          })}
        >
          {label}
        </label>
      )}
      <div className={classNames("input flex items-center gap-2")}>
        {prefix && prefix}
        <input
          ref={callbackRef}
          autoFocus={autoFocus}
          {...props}
          className={classNames(inputClassName)}
        />
        {suffix && suffix}
      </div>
      {error && <p className="input-error">{error}</p>}
    </div>
  );
};

export default Input;
