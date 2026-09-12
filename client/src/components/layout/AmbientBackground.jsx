export default function AmbientBackground({ variant = "default" }) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] h-[38rem] w-[38rem] rounded-full bg-gradient-to-br from-violet-200 via-violet-100 to-transparent opacity-60 blur-3xl animate-drift" />
      <div className="absolute bottom-[-15%] right-[-10%] h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-aqua-400/40 to-transparent opacity-50 blur-3xl animate-drift" style={{ animationDelay: "4s" }} />
      {variant === "focus" && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl animate-breathe" />
      )}
    </div>
  );
}
