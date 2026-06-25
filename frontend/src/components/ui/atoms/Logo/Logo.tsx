import type { LogoProps, LogoVariant } from "./Logo.types";

import horizontalColor from "../../../../assets/logos/horizontal-color.png";
import horizontalWhite from "../../../../assets/logos/horizontal-white.png";
import horizontalDark from "../../../../assets/logos/horizontal-dark.png";

import verticalColor from "../../../../assets/logos/vertical-color.png";
import verticalWhite from "../../../../assets/logos/vertical-white.png";
import verticalDark from "../../../../assets/logos/vertical-dark.png";

import isotypeColor from "../../../../assets/logos/isotype-color.png";
import isotypeWhite from "../../../../assets/logos/isotype-white.png";
import isotypeDark from "../../../../assets/logos/isotype-dark.png";

import horizontalSloganColor from "../../../../assets/logos/horizontal-slogan-color.png";
import horizontalSloganWhite from "../../../../assets/logos/horizontal-slogan-white.png";

const logoMap: Record<LogoVariant, string> = {
  "horizontal-color": horizontalColor,
  "horizontal-white": horizontalWhite,
  "horizontal-dark": horizontalDark,

  "vertical-color": verticalColor,
  "vertical-white": verticalWhite,
  "vertical-dark": verticalDark,

  "isotype-color": isotypeColor,
  "isotype-white": isotypeWhite,
  "isotype-dark": isotypeDark,

  "horizontal-slogan-color": horizontalSloganColor,
  "horizontal-slogan-white": horizontalSloganWhite,
};

export function Logo({
  variant = "horizontal-color",
  className = "",
}: LogoProps) {
  return (
    <img
      src={logoMap[variant]}
      alt="UCEConnect"
      className={className}
    />
  );
}