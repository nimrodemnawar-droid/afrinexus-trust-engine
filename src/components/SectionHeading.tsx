interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
}

export function SectionHeading({ label, title, description, centered = true, light = false }: SectionHeadingProps) {
  return (
    <div className={`max-w-2xl ${centered ? "mx-auto text-center" : ""} mb-12`}>
      {label && (
        <span className="inline-block mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
          {label}
        </span>
      )}
      <h2 className={`font-serif text-3xl md:text-4xl ${light ? "text-primary-foreground" : "text-foreground"}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-lg ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
