import React from 'react'
import Link from 'next/link'
import { IconBrandGithub, IconBrandLinkedin, IconBrandX } from '../icons'
import { Container } from '../container'

export const Footer = () => {
  return (
    <Container className='flex justify-between p-3 border-t border-neutral-100'>
        <p className='text-sm text-neutral-500'>built with love by Abhay Singh</p>
        <div className='flex items-center justify-center gap-4'>
            <Link href="https://github.com/abhaydesu">
                <IconBrandGithub className='size-4 text-neutral-500 hover:text-neutral-700' />
            </Link>
            <Link href="https://www.linkedin.com/in/abhaydesu/">
                <IconBrandLinkedin  className='size-4 text-neutral-500 hover:text-neutral-700'/>
            </Link>
            <Link href="https://x.com/abhaydesu">
                <IconBrandX  className='size-4 text-neutral-500 hover:text-neutral-700'/>
            </Link>
        </div>
    </Container>
  )
}
