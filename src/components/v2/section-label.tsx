export const SectionLabel = ({
  children,
  sketch,
}: {
  children: React.ReactNode;
  // opts the heading into the intro
  sketch?: boolean;
}) => (
  <h2 data-intro={sketch ? "head" : undefined} className="text-[15px] text-current">
    {children}
  </h2>
);
