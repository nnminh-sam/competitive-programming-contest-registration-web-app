import classNames from "classnames";
import { FC, MouseEvent } from "react";
import { IconNames } from "./Icon.type";

interface IconProps {
  name?: IconNames;
  size?: number;
  color?: string;
  className?: string;
  onClick?: (e: MouseEvent<HTMLSpanElement>) => void;
}

const Icon: FC<IconProps> = ({
  name,
  size = 24,
  color,
  className,
  onClick,
}) => {
  return (
    <span
      className={classNames(`icon-${name}`, className)}
      style={{ fontSize: size, color }}
      onClick={onClick}
    />
  );
};

export default Icon;
