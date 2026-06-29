import { User } from "../../icons";

import { cn } from "../../../../utils/cn";

import type { AvatarProps } from "./Avatar.types";

const sizes = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

export default function Avatar({
  src,
  alt,
  size = "md",
  className = "",
}: AvatarProps) {
  const avatarSize = sizes[size];

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          avatarSize,
          "rounded-full border border-border object-cover",
          className
        )}
      />
    );
  }

  return (
    <div
      data-testid="avatar-fallback"
      className={cn(
        avatarSize,
        "flex items-center justify-center rounded-full border border-border bg-gray-100",
        className
      )}
    >
      <User className="text-textSecondary" size={24} />
    </div>
  );
}