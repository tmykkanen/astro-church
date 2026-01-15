import * as React from "react";

import { Button } from "@/components/ui/button";

type BaseButtonProps = Parameters<typeof Button>[0];
type ButtonProps = Omit<BaseButtonProps, "asChild">;

interface ButtonLinkProps extends ButtonProps {
  href: string;
}

const ButtonLink: React.FC<ButtonLinkProps & React.ComponentProps<"a">> = ({
  href,
  children,
  ...props
}) => {
  return (
    <Button asChild {...props}>
      <a href={href}>{children}</a>
    </Button>
  );
};

export { ButtonLink };
