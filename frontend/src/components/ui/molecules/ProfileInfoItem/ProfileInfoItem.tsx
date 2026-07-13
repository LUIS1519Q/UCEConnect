import type { ProfileInfoItemProps } from "./ProfileInfoItem.types";

export default function ProfileInfoItem({
  label,
  value,
}: ProfileInfoItemProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      <p className="text-sm font-medium text-textSecondary">
        {label}
      </p>

      <p className="mt-1 text-base text-textPrimary">
        {value}
      </p>
    </div>
  );
}