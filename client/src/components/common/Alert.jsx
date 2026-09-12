import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function Alert({ type = "error", children }) {
  const ok = type === "success";

  return (
    <div
      className={`flex gap-3 rounded-xl border p-3 text-sm ${
        ok
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {ok ? (
        <CheckCircle2 className="h-5 w-5 shrink-0" />
      ) : (
        <AlertCircle className="h-5 w-5 shrink-0" />
      )}

      <span>{children}</span>
    </div>
  );
}