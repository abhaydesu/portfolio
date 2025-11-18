import { Container } from "@/components/container";
import { Collage } from "@/components/collage";
import { Timeline } from "@/components/timeline";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Scales } from "@/components/scales";
import { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
    title: "About Me",
    description: "Exploring technology, creativity, and continuous growth."
};

export default function AboutPage() {
  return (
   <div className="min-h-screen flex items-start justify-start">
    <Container className="min-h-screen  px-8 md:pb-10">
      <Scales />
      <div className="grid grid-cols-8 border-b border-neutral-100 dark:border-neutral-800/50">
      <div className="col-span-2 pt-4">
      <Heading >
        About Me
      </Heading>
      </div>
       <div className="col-span-6 border-l border-neutral-100 dark:border-neutral-800/50 bg-[image:repeating-linear-gradient(60deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%),repeating-linear-gradient(-60deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:20px_34px]">
        
      </div>
      </div>
      <Subheading className="py-2">
        Hi, I like keeping things simple; coding, reading, writing and sketching.
        <br />
        Staying curious and learning along the way.
      </Subheading >
      <div className="border-t border-neutral-100 dark:border-neutral-800/50 h-4 bg-[image:repeating-linear-gradient(-315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed" />
      <Collage />
            <div className="border-b border-neutral-100 dark:border-neutral-800/50 h-4 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed" />
      <SectionHeading className="mx-4 max-w-lg mt-4 text-sm md:text-sm">
        Education
      </SectionHeading>
      <Timeline />
    </Container>
   </div>
  );
}
