import Button from "./Button";

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-14 px-6">
      {Icon && (
        <div className="h-14 w-14 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
          <Icon size={26} strokeWidth={1.75} />
        </div>
      )}
      <h3 className="font-display font-semibold text-lg text-ink-800">{title}</h3>
      {description && <p className="text-ink-400 text-sm max-w-sm">{description}</p>}
      {actionLabel && (
        <Button variant="primary" size="sm" className="mt-2" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
