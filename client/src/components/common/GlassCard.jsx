import { cn } from "../../utils/cn";

export default function GlassCard({ className, children, strong = false, ...props }) {
  return (
    <div
      className={cn(
        strong ? "glass-strong" : "glass",
        "rounded-3xl shadow-soft p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
