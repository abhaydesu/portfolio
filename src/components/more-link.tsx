import React from 'react'
import Link from 'next/link';
import { IconArrowWaveRightUp } from './icons';

export const More = () => {
  return (
        <Link 
        href='/projects' 
        className='flex gap-2 text-neutral-300 hover:text-neutral-700 text-sm md:text-sm mt-8 max-w-lg'>
        <IconArrowWaveRightUp />
        more
        </Link>
  )
}
