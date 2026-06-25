import type { FormRowProps } from "./FormRow.types";

export default function FormRow({
  children,
  className = "",
}: FormRowProps) {
  return (
    <div
      className={`
        flex
        items-center
        justify-between
        gap-4
        ${className}
      `}
    >
      {children}
    </div>
  );
}