import type { FormRowProps } from "./FormRow.types";

export default function FormRow({
  children,
  className = "",
}: FormRowProps) {
  return (
    <div
      className={`
        flex
        flex-col
        gap-4

        md:flex-row
        md:items-start

        ${className}
      `}
    >
      {children}
    </div>
  );
}