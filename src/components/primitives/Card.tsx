import type { HTMLAttributes, ReactNode } from "react";
import type { Theme } from "../../theme/themes";

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  children: ReactNode;
  T: Theme;
  style?: React.CSSProperties;
  className?: string;
}

export function Card({ children, T, style, className = "", ...rest }: CardProps) {
  return (
    <div
      className={`rounded-[28px] ${className}`}
      style={{
        background: T.card,
        border: `1px solid ${T.line}`,
        boxShadow: `0 10px 28px -12px ${T.ink}26, 0 2px 8px -2px ${T.ink}14`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
