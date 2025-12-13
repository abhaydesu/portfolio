import CSS from '@/components/technologies/css';
import ExpressJs from '@/components/technologies/expressjs';
import JavaScript from '@/components/technologies/javascript';
import NodeJs from '@/components/technologies/nodejs';
import ReactIcon from '@/components/technologies/react-icon';
import TailwindCss from '@/components/technologies/tailwind-css';
import Vercel from '@/components/technologies/vercel';

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
    isCurrent: true,
    company: 'Seeqlo',
    position: 'Frontend Developer Intern',
    location: 'Canada (Remote)',
    image: '/seeqlo-logo.png',
    description: [
      '*UI/UX Redesign*: Spearheaded the redesign of the Presentation Editor and Dashboard, implementing a collapsible sidebar and improving visual hierarchy to enhance user workflow.',
      '*Rendering Optimization*: Debugged and resolved critical rendering issues, specifically fixing z-index overlaps and component scaling inconsistencies to ensure a flawless responsive experience.',
      '*State Management*: Engineered a robust state persistence layer to ensure data integrity during page refreshes, preventing data loss during editing sessions.',
    ],
    startDate: 'Nov 2025',
    endDate: 'Present',
    technologies: [
        
      {
        name: 'React',
        href: 'https://react.dev/',
        icon: <ReactIcon />,
      },
      {
        name: 'JavaScript',
        href: 'https://javascript.com/',
        icon: <JavaScript />,
      },
      {
        name: 'Tailwind CSS',
        href: 'https://tailwindcss.com/',
        icon: <TailwindCss />,
      },
      {
        name: 'CSS',
        href: 'https://www.w3.org/Style/CSS/Overview.en.html',
        icon: <CSS />
      },
      {
        name: 'Vercel',
        href: 'https://vercel.com/',
        icon: <Vercel />,
      },
      {
        name: 'Express',
        href: 'https://expressjs.com/',
        icon: <ExpressJs />,
      },
      {
        name: 'Node.js',
        href: 'https://nodejs.org/',
        icon: <NodeJs />,
      }
    ],
    website: 'https://seeqlo.com',
    linkedin: 'https://www.linkedin.com/company/seeqlo/'
  }
];