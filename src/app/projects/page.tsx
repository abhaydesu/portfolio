import { Container } from "@/components/container";
import { Projects } from "@/components/project/projects";
import { Subheading } from "@/components/subheading";
import { Heading } from "@/components/heading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Showcasing work, experiments, and creations.",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen flex items-start justify-start">
      <Container className="min-h-screen  md:pb-10">
        <div className="flex flex-col md:flex-row justify-start md:items-center border-b border-neutral-100 dark:border-neutral-800/50">
          <Heading className=" py-2 mb-0 w-full">Projects</Heading>
          <Subheading className=" border-t md:border-t-0 md:border-l border-neutral-100 dark:border-neutral-800/50 py-2 md:py-4 ">
            A collection of things I&#39;ve built, broken, and learned from
            along the way. Some are experiments, some are polished, but all of
            them reflect my curiosity and growth as a developer.
          </Subheading>
          {/* </div> */}
        </div>
        <Projects />
      </Container>
    </div>
  );
}
