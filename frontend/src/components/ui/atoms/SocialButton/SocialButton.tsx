import microsoftLogo from "../../../../assets/brands/microsoft.png";

import { Button } from "../Button";

import type { SocialButtonProps } from "./SocialButton.types";

export default function SocialButton({
  provider,
  children,
  ...props
}: SocialButtonProps) {
  const logo =
    provider === "microsoft"
      ? microsoftLogo
      : "";

  return (
    <Button
      variant="secondary"
      className="flex w-full items-center justify-center gap-3"
      {...props}
    >
      <img
        src={logo}
        alt={provider}
        className="h-5 w-5"
      />

      {children}
    </Button>
  );
}