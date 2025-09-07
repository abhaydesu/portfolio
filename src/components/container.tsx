import React from 'react'
import { cn } from '@/lib/utils';

export const Container = ({children, className}: {
    children: React.ReactNode,
    className?: string;
}) => {
  return (
    <div className={cn("relative max-w-4xl w-full  bg-white dark:bg-black mx-auto", className)}>
        { children }
    </div>
  )
}
