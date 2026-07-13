import type { TimelineProps } from "./Timeline.types";

export default function Timeline({
  items,
}: TimelineProps) {
  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="flex gap-4"
        >
          <div className="flex flex-col items-center">
            <div
              className="
                h-3
                w-3
                rounded-full
                bg-primary
              "
            />

            {index < items.length - 1 && (
              <div
                className="
                  mt-1
                  h-full
                  w-0.5
                  bg-border
                "
              />
            )}
          </div>

          <div className="pb-6">
            <h4 className="font-semibold text-textPrimary">
              {item.title}
            </h4>

            {item.description && (
              <p className="mt-1 text-sm text-textSecondary">
                {item.description}
              </p>
            )}

            <span className="mt-2 block text-xs text-textSecondary">
              {item.timestamp}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}