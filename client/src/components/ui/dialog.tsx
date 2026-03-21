import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "./button";

type DialogProps = {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
};

export const ConfirmDialog = ({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Delete"
}: DialogProps) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const DialogBody = ({ children }: { children: ReactNode }) => children;
