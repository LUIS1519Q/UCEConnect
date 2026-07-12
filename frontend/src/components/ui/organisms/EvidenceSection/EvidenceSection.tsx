import { useState } from "react";

import { Button } from "../../atoms/Button";
import { EvidenceItem } from "../../molecules/EvidenceItem";

import type { EvidenceSectionProps } from "./EvidenceSection.types";

export default function EvidenceSection({
  title = "Evidence",
  files,
  emptyMessage = "Drag & drop files here",
  onAddFile,
  onDrop,
  onDragOver,
}: EvidenceSectionProps) {

  const [isDragging, setIsDragging] =
    useState(false);

  return (
    <section className="space-y-3">

      <h3 className="text-base font-medium text-textPrimary">
        {title}{" "}
        <span className="font-normal text-textSecondary">
          (Optional)
        </span>
      </h3>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
          onDragOver?.(event);
        }}
        onDragLeave={() => {
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          onDrop?.(event);
        }}
        className={`
          rounded-xl
          border-2
          border-dashed
          p-3
          sm:p-4
          transition-colors
          ${
            isDragging
              ? "border-primary bg-blue-50"
              : "border-border bg-background"
          }
        `}
      >

        {files.length === 0 ? (

          <div className="flex flex-col items-center justify-center py-8 text-center">

            <p className="text-sm font-medium text-textPrimary">
              {emptyMessage}
            </p>

            <p className="mt-1 text-xs text-textSecondary">
              or click below to upload
            </p>

            <p className="mt-2 text-xs text-textSecondary">
              Maximum 20 files · 100 MB each
            </p>

            {onAddFile && (
              <Button
                className="mt-4"
                variant="secondary"
                size="sm"
                onClick={onAddFile}
              >
                + Add evidence
              </Button>
            )}

          </div>

        ) : (

          <>

            <div className="flex flex-wrap gap-3">

              {files.map((file, index) => (
                <EvidenceItem
                  key={`${file.fileName}-${index}`}
                  {...file}
                />
              ))}

            </div>

            <div className="mt-5 border-t border-border pt-4">

              <p className="mb-3 text-xs text-textSecondary">
                Drag more files here or use the button below.
              </p>

              {onAddFile && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onAddFile}
                >
                  + Add evidence
                </Button>
              )}

            </div>

          </>

        )}

      </div>

    </section>
  );
}