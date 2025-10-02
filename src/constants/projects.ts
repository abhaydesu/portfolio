export type Project = {
    id:number,
    title: string
    src: string;
    href: string;
    github: string;
    description: string;
    tech: string[]
}

export const projects: Project[] = [
        {
            id: 1,
            title: "Git Pilot",
            src: "/git-pilot-demo.png",
            href: "https://gitpilot.abhaydesu.dev/",
            github: "https://github.com/abhaydesu/git-pilot-cli",
            description: "A cli tool that makes git simpler, leveraging AI.",
            tech: ['Node.js', 'JavaScript', 'Express', 'Gemini API']
        },
        {
            id: 2,
            title: "Dip-Dash",
            src: "/dipdash.png",
            href:"https://dipdash.abhaydesu.dev/",
            github: "https://github.com/abhaydesu/dip-dash",
            description: "An endless, crossy-road type game.",
            tech: ['Three.js','HTML', 'CSS', 'JavaScript' ]
        },
        {
            id: 3,
            title: "Virtual Gallery",
            src: "/art-gallery.png",
            href:"https://3d-virtualgallery.netlify.app/",
            github: "https://github.com/abhaydesu/virtual-gallery",
            description: "A showcase of paintings in a 3D manner.",
            tech: ['Three.js', 'HTML', 'CSS', 'JavaScript']
        },
        {
            id:4,
            title: "Portfolio Website",
            src: "/portfolio.png",
            href:"#",
            github: "https://github.com/abhaydesu/portfolio",
            description: "This website you're on :)",
            tech: ['TypeScript', 'Next.js', 'TailwindCSS', 'Motion']
        },
        {
            id:5,
            title: "Coming soon",
            src: "/coming-soon.png",
            href:"#",
            github: "#",
            description: "...",
            tech: ['><'],
        },
    ]
