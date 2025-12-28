import { Container } from "@/components/container";
import { LandingBlogs } from "@/components/landing-blogs";
import { Subheading } from "@/components/subheading";
import { ProjectLanding } from "@/components/project/project-landing";
import { Links } from "@/components/links";
import TechShowcase from "@/components/tech-showcase";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { LeakyCode } from "@/components/leaky-code";
import Experience from "@/components/experience/experience";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-start justify-start">
      <Container className="min-h-screen  px-4 md:pb-10">
        <div className=" max-w-5xl items-center py-0  -mx-12 px-8  ">
          <div className="flex justify-between">
            <div className=" border-r border-neutral-100 dark:border-neutral-800/50 bg-white dark:bg-black transition-color duration-500">
              <LeakyCode
                text="px-4 md:text-4xl tracking-tighter"
                className="px-4"
              />

              <LayoutTextFlip
                text="Abhay Singh"
                words={[
                  "Full Stack Web Developer",
                  "Sweating the details"
                ]}
              />
            </div>
            <div className="relative border-x border-neutral-100 dark:border-neutral-800/50 p-0 mr-4  bg-white dark:bg-black transition-color duration-500">
              <Image
                height={96}
                width={96}
                alt="Avatar"
                src={"/avatar.jpg"}
                className="rounded-full border border-neutral-100 dark:border-neutral-800/50 p-0.5 md:grayscale-30 md:hover:grayscale-0 transition-all duration-300"
              />
              {/* <div className="absolute right-0 top-0">
                <Image
                  height={20}
                  width={28}
                  alt="Flag of the Republic of India"
                  src={"/flag.png"}
                />
              </div> */}
            </div>
          </div>
        </div>
        <div className="flex justify-between max-w-5xl items-center -mx-4 border-t md:h-8 border-neutral-100 dark:border-neutral-800/50">
          <Subheading>A dev with an eye for design.</Subheading>
          <Links />
        </div>
        <ProjectLanding />
        <Experience />
        <LandingBlogs />
        <TechShowcase />
      </Container>
    </div>
  );
}
