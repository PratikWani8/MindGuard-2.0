export default function SectionHeading({ eyebrow, title, description, align = "left" }) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : ""}>
      {eyebrow && (
        <span className="inline-block text-xs font-semibold tracking-wide uppercase text-violet-600 bg-violet-50 px-3 py-1 rounded-full mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink-900 leading-tight">{title}</h2>
      {description && <p className="text-ink-400 mt-3 text-base md:text-lg">{description}</p>}
    </div>
  );
}
