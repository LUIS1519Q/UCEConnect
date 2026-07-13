import { Search } from "../../icons";
import { TextInput } from "../../atoms/TextInput";

import type { SearchBarProps } from "./SearchBar.types";

export default function SearchBar({
  placeholder = "Search...",
  className = "",
  ...props
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary"
      />

      <TextInput
        placeholder={placeholder}
        className={`pl-11 ${className}`}
        {...props}
      />
    </div>
  );
}