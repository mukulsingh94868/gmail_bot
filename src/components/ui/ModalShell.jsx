import { X } from "lucide-react";

/**
 * Shared modal frame. Renders as a bottom sheet on phones and a centered
 * dialog from `sm` up. `overlay` is rendered over the panel (e.g. a busy state).
 */
const ModalShell = ({
  title,
  description,
  icon: Icon,
  onClose,
  children,
  overlay,
  maxWidth = "sm:max-w-lg",
}) => (
  <div
    className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
    role="dialog"
    aria-modal="true"
    aria-label={title}
  >
    <div
      className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    />

    <div
      className={`relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-200 sm:rounded-2xl ${maxWidth}`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-brand-100 px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Icon size={18} />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold text-slate-900">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
          </div>
        </div>
        <button type="button" onClick={onClose} className="rl-icon-btn -mr-1 shrink-0" aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>

      {overlay}
    </div>
  </div>
);

export default ModalShell;
