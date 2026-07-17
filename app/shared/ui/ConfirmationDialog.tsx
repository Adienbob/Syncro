"use client";

interface ConfirmDialogProps {
   isOpen: boolean;
   title: string;
   description: string;
   confirmText?: string;
   cancelText?: string;
   onConfirm: () => void;
   onCancel: () => void;
}

export default function ConfirmDialog({
   isOpen,
   title,
   description,
   confirmText = "Delete",
   cancelText = "Cancel",
   onConfirm,
   onCancel,
}: ConfirmDialogProps) {
   if (!isOpen) return null;

   return (
      <div
         className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
         onClick={onCancel}
      >
         <div
         role="dialog"
         aria-modal="true"
         aria-labelledby="confirm-dialog-title"
         aria-describedby="confirm-dialog-description"
         onClick={(e) => e.stopPropagation()}
         className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-modal animate-in fade-in zoom-in-95 duration-200"
         >
         <h2
            id="confirm-dialog-title"
            className="text-xl font-semibold text-text-primary"
         >
            {title}
         </h2>

         <p
            id="confirm-dialog-description"
            className="mt-2 text-sm leading-6 text-text-muted"
         >
            {description}
         </p>

         <div className="mt-6 flex justify-end gap-3">
            <button
               type="button"
               onClick={onCancel}
               className="rounded-lg border border-border bg-surface-high px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-highest"
            >
               {cancelText}
            </button>

            <button
               type="button"
               onClick={onConfirm}
               className="rounded-lg bg-error px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
            >
               {confirmText}
            </button>
         </div>
         </div>
      </div>
   );
}