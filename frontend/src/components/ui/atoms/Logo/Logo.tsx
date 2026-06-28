import { logoMap } from "../../../../constants/logoMap";

import type { LogoProps } from "./Logo.types";

export function Logo({
  variant = "horizontal-color",
  className = "",
}: LogoProps) {
  return (
    <img
      src={logoMap[variant]}
      alt="UCEConnect"
      className={className}
      loading="lazy"
      draggable={false}
    />
  );
}