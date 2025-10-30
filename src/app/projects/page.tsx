import { Container } from "@/components/container";
import { Projects } from "@/components/projects";
import { Subheading } from "@/components/subheading";
import { Heading } from "@/components/heading";
import { Metadata } from "next";
import { Scales } from "@/components/scales";

export const metadata: Metadata = {
    title: "Projects",
    description: "Showcasing work, experiments, and creations."
};

export default function ProjectsPage() {
  return (
   <div className="min-h-screen flex items-start justify-start">
    <Container className="min-h-screen pt-8 px-8 md:pb-10">
      <Scales />
      <div className="flex flex-row justify-start items-center border-y border-neutral-100 dark:border-neutral-800">
      <Heading className=" py-2 mb-0 w-full" >
        Projects
      </Heading>
      {/* <div className="w-full border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors duratino-300"> */}
      <Subheading className="border-l border-neutral-100 dark:border-neutral-800 py-4 " >
       A collection of things I&#39;ve built, broken, and learned from along the way.  
        Some are experiments, some are polished, but all of them reflect my curiosity and growth as a developer.  
    </Subheading>
    {/* </div> */}
    </div>
      <Projects />
    </Container>
   </div>
  );
}
