import React from "react";

type LeakyCodeProps = {
  tag: string;
  children: React.ReactNode;
};

export const LeakyCode = ({ tag, children }: LeakyCodeProps) => {
  return (
    <div className="relative inline-block">
      <div
        aria-hidden
        className="absolute -top-4 left-0 text-[10px] font-mono text-neutral-400 dark:text-neutral-600 opacity-30 select-none pointer-events-none"
      >
        {`<${tag}>`}
      </div>

      <div>{children}</div>

      <div
        aria-hidden
        className="absolute -bottom-4 left-0 text-[10px] font-mono text-neutral-400 dark:text-neutral-600 opacity-30 select-none pointer-events-none"
      >
        {`</${tag}>`}
      </div>
    </div>
  );
};
