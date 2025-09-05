import { Container } from "@/components/container";
import { Projects } from "@/components/projects";
import { LandingBlogs } from "@/components/landing-blogs";

export default function Home() {
  return (
   <div className="min-h-screen flex items-start justify-start">
    <Container className="min-h-[200vh] px-10 md:pt-20 md:pb-10">
      <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-primary">
        Abhay Singh
      </h1>
      <p className="text-secondary text-sm md:text-sm pt-4 max-w-lg">
        Im a software engineer with a passion for building scalable and efficient systems. Currently a student, always a student of tech.
      </p>
      <Projects />
      <LandingBlogs />
    </Container>
   </div>
  );
}
