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
    <Container className="min-h-screen pt-8 px-8 md:pt-20 md:pb-10">
      <Scales />
      <Heading >
        Projects
      </Heading>
      <Subheading>
       A collection of things I&#39;ve built, broken, and learned from along the way.  
        Some are experiments, some are polished, but all of them reflect my curiosity and growth as a developer.  
        Feel free to explore, fork, or draw inspiration for your own ideas.
      </Subheading>
      <Projects />
    </Container>
   </div>
  );
}
