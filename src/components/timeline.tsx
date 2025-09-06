"use client";

import React, { useRef} from "react";
import {useInView, motion} from 'motion/react';
import { IconPointFilled } from "./icons";
import { cn } from "@/lib/utils";


type Data = {
    title: string,
    content : {
        title: string,
        description? : string
    }[];
};

export const Timeline = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.6});

    const data: Data[] = [
        {
        title: '2023-2027',
        content: [{
                title: 'Dayananda Sagar College of Engineering',
                description: 'B.E. - Information Science and Engineering [9.5]'
            }]
    },
        {
        title: '2022',
        content: [{
                title: 'Narayana E-Techno School',
                description: 'XII [PCM - 82%]'
            }]
    },
        {
        title: '2020',
        content: [{
                title: 'Narayana E-Techno School',
                description: 'X [94%]'
            }]
    }
]

    return (
    <div ref={ref} className="py-10">
        {data.map((year, index) => (
            <div 
                key={year.title} 
                className="mb-4"
            >
                <motion.h2 
                animate={{
                    filter: isInView ? 'blur(0px)' : 'blur(10px)',
                    opacity: isInView ? 1 : 0,
                }}
                transition={{
                    duration: 0.3,
                    ease: 'easeInOut',
                    delay: 0.1 * index
                }}
                className="font-bold text-black px-2 mb-2 py-0.5 rounded-md shadow-aceternity w-fit px-4 py-1">
                    {year.title}
                </motion.h2>
                <div className="flex flex-col gap-4 ">
                {year.content.map((item, idx) => (
                    <div key={item.title} className="pl-4 ">
                        <Step isInView={isInView} idx={idx}>
                        <motion.h3
                            animate={{
                                opacity: isInView ? 1 : 0,
                                y : isInView ? 0 : -10,
                            }}
                            transition={{
                                duration: 0.3,
                                ease: 'easeInOut',
                                delay: 0.2 * idx
                            }}
                            className="text-neutral-600"
                            >
                            {item.title}
                        </motion.h3>
                        </Step>
                        {item.description && (
                            <motion.p 
                            animate={{
                                opacity: isInView ? 1 : 0,
                                y : isInView ? 0 : -10,
                            }}
                            transition={{
                                duration: 0.3,
                                ease: 'easeInOut',
                                delay: 0.3 * idx
                            }}                          
                            className="pt-1 pl-6 text-neutral-400 text-sm">
                                {item.description
                            }</motion.p>
                        )}
                    </div>
                ))}
                </div>
            </div>
        ))}
        </div>
    );    
};

const Step = ({
    className,
    children,
    isInView,
    idx
}: {
    className?: string;
    children: React.ReactNode;
    isInView: boolean;
    idx: number;
}) => {
    return (
    <motion.div 
    animate={{
        opacity: isInView ? 1 : 0,
        y : isInView ? 0 : -10,
    }}
    transition={{
        duration: 0.3,
        ease: 'easeInOut',
        delay: 0.2 * idx
    }}
    className={cn("flex items-start gap-2", className)}>
        <IconPointFilled className="h-4 w-4 mt-1 text-neutral-500" />
            {children}
    </motion.div>
    )
}