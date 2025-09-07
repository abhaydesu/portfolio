import React from 'react'
import Marquee from 'react-fast-marquee';
import { SectionHeading } from './section-heading';

export const Testimonials = () => {
const data = [
  {
    quote:
      "Abhay is so great with his work, our production was shut down within the first day itself. Highly recommended",
    name: "Elon Musk",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "Working with Abhay was an experience of a lifetime. I still don’t understand half the code, but it looks beautiful!",
    name: "Mark Zuckerberg",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
  {
    quote:
      "Abhay promised to make our app scalable. Now it scales so much, even our bills are scalable. Truly visionary.",
    name: "Sundar Pichai",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
  {
    quote:
      "I asked Abhay for a simple website. He delivered a spaceship control system. Can’t complain, though.",
    name: "Jeff Bezos",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
  {
    quote:
      "Abhay’s work ethic is unmatched. He finished the project before I even finished explaining it.",
    name: "Satya Nadella",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
];



  return (
    <div className='py-4 my-4 px-4 shadow-section-inset border-y border-neutral-100'>
        <SectionHeading className='mb-4' delay={0.88}>
            People love my work
        </SectionHeading>
    <div className="flex
    [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)] 
    [-webkit-mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
    <Marquee speed={20} pauseOnHover className='py-4'>
        <div className="flex py-4">
        {data.map((item, idx) => (
            <TestimonialCard key={`testimonial-${idx}`} {...item} />
        ))}
    </div>
  </Marquee>
</div>


    </div>
  )
}


const TestimonialCard = ({quote, name, avatar}: {quote: string, name: string, avatar: string}) => {
    return (
        <div className='flex flex-col mx-4 justify-between max-w-60 h-50 w-full gap-4 shadow-aceternity p-4 rounded-xl hover:shadow-md transition duration-300'>
            <p className='text-sm text-neutral-700'>{quote}</p>
            <div className="flex item-center gap-4">
                <img src={avatar} alt={name} className='size-4 rounded-full' />
                <p className='text-sm text-neutral-500'>{name}</p>
            </div>
        </div>
    )
}