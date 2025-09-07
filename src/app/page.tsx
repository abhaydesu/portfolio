import { Container } from "@/components/container";
import { Projects } from "@/components/projects";
import { LandingBlogs } from "@/components/landing-blogs";
import { Heading } from "@/components/heading"; 
import { Subheading } from "@/components/subheading";
import { projects } from "@/constants/projects";
import { More } from "@/components/more-link";
import { Scales } from "@/components/scales";
import { ProjectLanding } from "@/components/project-landing";
import { Links } from "@/components/links";
import TechShowcase from "@/components/tech-showcase";

export default function Home() {
  return (
   <div className="min-h-screen flex items-start justify-start">
    <Container className="min-h-screen pt-16 px-8 md:pt-20 md:pb-10">
      <Scales />
      <Heading >
        Abhay Singh
      </Heading>
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
