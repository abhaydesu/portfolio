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
      <Container className="min-h-screen  px-8 md:pb-10">
        <Scales />
        <div className=" max-w-5xl items-center py-0  -mx-8 px-8  ">
          <div className="flex justify-between bg-[image:radial-gradient(_var(--pattern-fg)_1px,transparent_1px)] bg-[size:10px_10px]
 bg-fixed">
          <div className=" border-r border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-color duration-500">
            <LeakyCode
              text="px-4 md:text-4xl tracking-tighter"
              className="px-4"
            />

            <LayoutTextFlip
              text="Abhay Singh"
              words={[
                "Software Developer",
                "Full Stack Developer",
                "Frontend Developer",
              ]}
            />
          </div>
          <div className="border-x border-neutral-100 dark:border-neutral-800 p-0 mr-4  bg-white dark:bg-neutral-900 transition-color duration-500">
            <img
              src="/avatar.jpg"
              height={96}
              width={96}
              className="rounded-full border border-neutral-100 dark:border-neutral-800 p-0.5 md:grayscale-30 md:hover:grayscale-0 transition-all duration-300"
            />
          </div>
          </div>
        </div>
        <div className="flex justify-between max-w-5xl items-center border-t md:h-8 border-neutral-100 dark:border-neutral-800">
          <Subheading>A dev with an eye for design.</Subheading>
          <Links />
        </div>
        {/* <div className="rounded-full text-xs py-1 px-2  w-fit ml-3 text-neutral-400 shadow-[inset_0_0_3px_rgba(0,0,0,0.25)] dark:shadow-[inset_0_0_3px_rgba(255,255,255,0.45)]">
          Open to work
        </div> */}
        <ProjectLanding />
        <LandingBlogs />
        <TechShowcase />
      </Container>
    </div>
  );
}
