import CSS from "@/components/technologies/css";
import JavaScript from "@/components/technologies/javascript";
import ReactIcon from "@/components/technologies/react-icon";
import TailwindCss from "@/components/technologies/tailwind-css";


export interface Technology {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export interface Experience {
  company: string;
  position: string;
  location: string;
  image: string;
  description: string[];
  startDate: string;
  endDate: string;
  website: string;
  x?: string;
  linkedin?: string;
  github?: string;
  technologies: Technology[];
  isCurrent: boolean;
  isBlur?: boolean;
}

export const experiences: Experience[] = [
  {
    isCurrent: false,
    company: "Seeqlo",
    position: "Frontend Developer Intern",
    location: "Canada (Remote)",
    image: "/seeqlo-logo.png",
    description: [
      "Led *end-to-end UI/UX redesign* of the platform, implementing a modern, responsive interface with dynamic theming and consistent slide styling.",
      "Engineered *core product improvements* including presentation history with caching, credit-based usage system with dynamic messaging, and PPT export with SVG-based icon rendering.",
      "Resolved *critical state management* and persistence issues (data loss on refresh, routing inconsistencies, scaling/render mismatches), significantly improving reliability and user experience.",
    ],
    startDate: "Dec 2025",
    endDate: "March 2026",
    technologies: [
      {
        name: "React",
        href: "https://react.dev/",
        icon: <ReactIcon />,
      },
      {
        name: "JavaScript",
        href: "https://javascript.com/",
        icon: <JavaScript />,
      },
      {
        name: "Tailwind CSS",
        href: "https://tailwindcss.com/",
        icon: <TailwindCss />,
      },
      {
        name: "CSS",
        href: "https://www.w3.org/Style/CSS/Overview.en.html",
        icon: <CSS />,
      },
    ],
    website: "https://seeqlo.com",
    linkedin: "https://www.linkedin.com/company/seeqlo/",
  },
];
