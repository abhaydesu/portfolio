import { Container } from "@/components/container";
import { LandingBlogs } from "@/components/landing-blogs";
import { Heading } from "@/components/heading"; 
import { Subheading } from "@/components/subheading";
import { Scales } from "@/components/scales";
import { ProjectLanding } from "@/components/project-landing";
import { Links } from "@/components/links";
import TechShowcase from "@/components/tech-showcase";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";

export default function Home() {
  return (
   <div className="min-h-screen flex items-start justify-start">
    <Container className="min-h-screen pt-16 px-8 md:pt-20 md:pb-10">
      <Scales />
      <LayoutTextFlip 
        text="Abhay Singh"
        words={["Full stack Developer", "Frontend Developer", "Software Engineer"]}
      />
      {/* <Heading > */}
        {/* Abhay Singh
      </Heading> */}
      <Subheading>
        i&#39;m a software engineer with a passion for building scalable and efficient systems. Currently a student, always a student of tech.
      </Subheading>
      <Links />
      <ProjectLanding/>
      <LandingBlogs />
      <TechShowcase />
    </Container>
   </div>
  );
}
