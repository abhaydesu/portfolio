import { Container } from "@/components/container";
import { LandingBlogs } from "@/components/landing-blogs";
import { Subheading } from "@/components/subheading";
import { ProjectLanding } from "@/components/project-landing";
import { Links } from "@/components/links";
import TechShowcase from "@/components/tech-showcase";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { LeakyCode } from "@/components/leaky-code";
import Experience from "@/components/experience";

export default function Home() {
  return (
    <div className="min-h-screen flex items-start justify-start">
      <Container className="min-h-screen  px-4 md:pb-10">
        <div className=" max-w-5xl items-center py-0  -mx-12 px-8  ">
          <div
            className="flex justify-between"
          >
            <div className=" border-r border-neutral-100 dark:border-neutral-800/50 bg-white dark:bg-black transition-color duration-500">
              <LeakyCode
                text="px-4 md:text-4xl tracking-tighter"
                className="px-4"
              />

              <LayoutTextFlip
                text="Abhay Singh"
                words={[
                  "Software Developer",
                  "Frontend Developer",
                  "Sweating the details",
                ]}
              />
            </div>
            <div className="border-x border-neutral-100 dark:border-neutral-800/50 p-0 mr-4  bg-white dark:bg-black transition-color duration-500">
              <img
                src="/avatar.jpg"
                height={96}
                width={96}
                className="rounded-full border border-neutral-100 dark:border-neutral-800/50 p-0.5 md:grayscale-30 md:hover:grayscale-0 transition-all duration-300"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between max-w-5xl items-center -mx-4 border-t md:h-8 border-neutral-100 dark:border-neutral-800/50">
          <Subheading>A dev with an eye for design.</Subheading>
          <Links />
        </div>
        {/* <div className="rounded-full text-xs py-1 px-2  w-fit ml-3 text-neutral-400 shadow-[inset_0_0_3px_rgba(0,0,0,0.25)] dark:shadow-[inset_0_0_3px_rgba(255,255,255,0.45)]">
          Open to work
        </div> */}
        <ProjectLanding />
        <Experience />
        <LandingBlogs />
        <TechShowcase />
      </Container>
    </div>
  );
}
