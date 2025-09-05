import { Container } from "@/components/container";
import { Projects } from "@/components/projects";
import { LandingBlogs } from "@/components/landing-blogs";
import { Heading } from "@/components/heading"; 
import { Subheading } from "@/components/subheading";

export default function Home() {
  return (
   <div className="min-h-screen flex items-start justify-start">
    <Container className="min-h-[200vh] px-10 md:pt-20 md:pb-10">
      <Heading >
        Abhay Singh
      </Heading>
      <Subheading >
        I&#39;m a software engineer with a passion for building scalable and efficient systems. Currently a student, always a student of tech.
      </Subheading>
      <Projects />
      <LandingBlogs />
    </Container>
   </div>
  );
}
