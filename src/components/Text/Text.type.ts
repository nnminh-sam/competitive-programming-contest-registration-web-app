import { CSSProperties, ReactNode } from "react";
export interface TextProps {
  children?: ReactNode;
  className?: string;
  type?: TextTypes;
  decoration?: TextDecorations;
  color?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

export declare const Types: readonly [
  "headline-4",
  "headline-5",
  "title-1",
  "title-2",
  "title-3",
  "title-4",
  "body-1",
  "body-2",
  "body-3",
];
export type TextTypes = (typeof Types)[number];
export declare const Decorations: readonly [
  "none",
  "underline",
  "line-through",
];
export type TextDecorations = (typeof Decorations)[number];
