import { Container } from "@/components/container";
import { LandingBlogs } from "@/components/landing-blogs";
import { Subheading } from "@/components/subheading";
import { Scales } from "@/components/scales";
import { ProjectLanding } from "@/components/project-landing";
import { Links } from "@/components/links";
import TechShowcase from "@/components/tech-showcase";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { LeakyCode } from "@/components/leaky-code";

export default function Home() {
  return (
   <div className="min-h-screen flex items-start justify-start">
    <Container className="min-h-screen pt-16 px-8 md:pt-20 md:pb-10">
      <Scales />
      <LeakyCode text="px-4 md:text-4xl tracking-tighter" className="px-4"/>
        <LayoutTextFlip text="Abhay Singh" words={['Software Engineer', 'Full Stack Developer', 'Frontend Developer']} />
      <Subheading>
       I approach code as a craft, building elegant solutions to complex problems and delivering experiences that are both thoughtful and functional.
      </Subheading>
      <Links />
      <ProjectLanding/>
      <LandingBlogs />
      <TechShowcase />
    </Container>
   </div>
  );
}
