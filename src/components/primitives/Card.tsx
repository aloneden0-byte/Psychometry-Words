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
    <div className={`rounded-3xl ${className}`} style={{ background: T.card, border: `1px solid ${T.line}`, ...style }} {...rest}>
      {children}
    </div>
  );
}
