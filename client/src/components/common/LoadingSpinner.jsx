export default function LoadingSpinner({ label = "Loading", size = "md" }) {
  const dims = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-9 w-9" : "h-6 w-6";
  return (
    <div className="flex items-center gap-3 text-ink-400 py-6 justify-center" role="status" aria-live="polite">
      <span
        className={`${dims} rounded-full border-2 border-violet-200 border-t-violet-500 animate-spin`}
      />
      <span className="text-sm">{label}…</span>
    </div>
  );
}
