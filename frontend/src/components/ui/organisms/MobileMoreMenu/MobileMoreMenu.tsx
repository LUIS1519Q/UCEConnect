import type { MobileMoreMenuProps } from "./MobileMoreMenu.types";

const DANGER_LABELS = ["Logout", "Log out"];

export default function MobileMoreMenu({
  items,
  onClose,
}: MobileMoreMenuProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      <div
        className="
          absolute
          right-4
          top-14
          z-50
          w-56
          rounded-xl
          border
          border-border
          bg-surface
          py-2
          shadow-lg
        "
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isDanger = DANGER_LABELS.includes(item.label);

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                item.onClick?.();
                onClose();
              }}
              className={`
                flex
                w-full
                items-center
                gap-3
                px-4
                py-3
                text-left
                text-sm
                transition-colors
                hover:bg-background
                ${isDanger ? "text-danger" : "text-textPrimary"}
              `}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}