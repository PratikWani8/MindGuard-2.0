import { AlertTriangle } from "lucide-react";
import Button from "./Button";

export default function ErrorState({ message = "Something didn't load correctly.", onRetry }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-10 px-6">
      <div className="h-12 w-12 rounded-2xl bg-red-50 text-calm-red flex items-center justify-center">
        <AlertTriangle size={22} strokeWidth={1.75} />
      </div>
      <p className="text-ink-500 text-sm max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
