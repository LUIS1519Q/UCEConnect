import { cn } from "../../../../utils/cn";

import type { TabsProps } from "./Tabs.types";

export default function Tabs({
  tabs,
  value,
  onChange,
}: TabsProps) {
  return (
    <div className="flex gap-2 border-b border-border">
      {tabs.map((tab) => {
        const active = value === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              "border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              active
                ? "border-primary text-primary"
                : "border-transparent text-textSecondary hover:text-textPrimary"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}