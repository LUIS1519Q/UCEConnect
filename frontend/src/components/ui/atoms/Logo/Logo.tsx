import { logoMap } from "../../../../constants/logoMap";

import type { LogoProps } from "./Logo.types";

export function Logo({
  variant = "horizontal-color",
  className = "",
  alt = "UCEConnect",
}: LogoProps) {
  return (
    <img
      src={logoMap[variant]}
      alt={alt}
      className={className}
      loading="lazy"
      draggable={false}
    />
  );
}