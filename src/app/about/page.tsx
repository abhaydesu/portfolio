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
    <Container className="min-h-screen pt-8 px-8 md:pt-20 md:pb-10">
      <Scales />
      <Heading>
        About Me
      </Heading>
      <Subheading>
        Hi, I like keeping things simple; coding, reading, writing and sketching.
        <br />
        staying curious and learning along the way.
      </Subheading>
      <Collage />
      <SectionHeading className="mx-4 max-w-lg mt-4 text-sm md:text-sm">
        Education
      </SectionHeading>
      <Timeline />
    </Container>
   </div>
  );
}
