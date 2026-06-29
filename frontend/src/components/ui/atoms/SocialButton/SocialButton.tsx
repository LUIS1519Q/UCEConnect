import microsoftLogo from "../../../../assets/brands/microsoft.png";

import { Button } from "../Button";

import type { SocialButtonProps } from "./SocialButton.types";

const providerLogos = {
  microsoft: microsoftLogo,
} as const;

export default function SocialButton({
  provider,
  children,
  ...props
}: SocialButtonProps) {
  const logo = providerLogos[provider];

  return (
    <Button
      variant="secondary"
      className="flex w-full items-center justify-center gap-3"
      {...props}
    >
      {logo && (
        <img
          src={logo}
          alt={`${provider} logo`}
          className="h-5 w-5"
        />
      )}

      {children}
    </Button>
  );
}