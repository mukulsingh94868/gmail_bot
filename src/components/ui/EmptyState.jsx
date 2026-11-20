const EmptyState = ({ icon: Icon, title, description, action, className = "" }) => (
  <div className={`rl-card flex flex-col items-center px-6 py-14 text-center ${className}`}>
    {Icon && (
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-8 ring-brand-50/50">
        <Icon size={24} />
      </div>
    )}
    <h3 className="font-display text-base font-semibold text-slate-900">{title}</h3>
    {description && (
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">{description}</p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
