"use client";

import React from "react";

interface AdminConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary" | "warning";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export function AdminConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  isLoading = false,
  onConfirm,
  onCancel,
  children,
}: AdminConfirmModalProps) {
  if (!isOpen) return null;

  const confirmBtnClass =
    variant === "danger"
      ? "bg-rose text-white hover:bg-rose-dark disabled:opacity-50"
      : variant === "warning"
        ? "bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-50"
        : "btn-luxury-primary text-white disabled:opacity-50";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md rounded-xs border border-brand-border bg-white p-6 shadow-2xl">
        <h3 className="serif text-xl font-medium text-brand-text">{title}</h3>
        <p className="mt-2 text-xs text-brand-muted leading-relaxed whitespace-pre-line">
          {message}
        </p>

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="rounded-xs border border-brand-border px-4 py-2 text-xs font-medium uppercase tracking-wider text-brand-muted hover:bg-ivory-2 disabled:opacity-50 transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`rounded-xs px-4 py-2 text-xs font-medium uppercase tracking-wider transition ${confirmBtnClass}`}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
