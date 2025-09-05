import React from 'react'

export const Heading = ({
    as: Tag = "h1",
    children,
}: {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" ;
    children: React.ReactNode;
}) => {
  return (
    <Tag className='text-primary text-2xl font-bold tracking-tighter drop-shadow-md md:text-4xl'>
        {children}
    </Tag>
  )
}
