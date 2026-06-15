import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="pt-32 pb-16 border-b hairline">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="text-[11px] tracking-display text-gold mb-4">{eyebrow}</p>
        <h1 className="text-4xl md:text-6xl font-display font-light text-foreground">{title}</h1>
        {children && <div className="mt-6 max-w-2xl text-muted-foreground">{children}</div>}
      </div>
    </div>
  );
}
