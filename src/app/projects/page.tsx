import { Container } from "@/components/container";
import { Collage } from "@/components/collage";
import { Timeline } from "@/components/timeline";
import { Projects } from "@/components/projects";
import { Subheading } from "@/components/subheading";

export default function ProjectsPage() {
  return (
   <div className="min-h-screen flex items-start justify-start">
    <Container className="min-h-[200vh] px-10 md:pt-20 md:pb-10">
      <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-primary">
        Projects
      </h1>
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
