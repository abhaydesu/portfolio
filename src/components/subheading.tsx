import React from 'react'

export const Subheading = ({
    as: Tag = 'h2',
    children,
}: {
    as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    children: React.ReactNode;
}) => {
  return (
        <Tag className="text-secondary text-sm md:text-sm pt-4 max-w-lg">
            { children }
      </Tag>
  )
}
