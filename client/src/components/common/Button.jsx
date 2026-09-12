import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-gradient-to-br from-violet-500 to-aqua-500 text-white shadow-soft hover:brightness-105",
  secondary:
    "glass text-ink-800 hover:bg-white/80",
  ghost:
    "text-ink-700 hover:bg-violet-50",
  danger:
    "bg-calm-red text-white hover:brightness-105",
  outline:
    "border border-violet-200 text-violet-700 hover:bg-violet-50",
};

const sizes = {
  sm: "text-sm px-3.5 py-2 rounded-xl",
  md: "text-sm px-5 py-2.5 rounded-2xl",
  lg: "text-base px-7 py-3.5 rounded-2xl",
};

export default function Button({
  as: Comp = "button",
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      whileHover={{ y: disabled ? 0 : -1 }}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-ring disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
