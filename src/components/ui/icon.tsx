"use client";

import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

export const Icon: React.FC<IconProps> = ({ className, ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v12m6-6H6"
      />
    </svg>
  );
};
