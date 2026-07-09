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
            title: "Lexiq",
            src: "/lexiq.png",
            href: "https://lexiq-seven.vercel.app",
            github: "https://github.com/abhaydesu/lexiq",
            description: "An epub reader, built for providing a seamless and cozy reading experience",
            tech: ["TypeScript", "React.js", "TailwindCSS"]
        },
        {
            id: 2,
            title: "Git Pilot",
            src: "/git-pilot.png",
            href: "https://gitpilot.abhaydesu.dev/",
            github: "https://github.com/abhaydesu/git-pilot-cli",
            description: "A cli tool that makes git simpler, leveraging AI. With 600+ all-time downloads",
            tech: ['Node.js', 'JavaScript', 'Express', 'Gemini API']
        },
        {
            id: 3,
            title: "Dip-Dash",
            src: "/dipdash.png",
            href:"https://dipdash.abhaydesu.dev/",
            github: "https://github.com/abhaydesu/dip-dash",
            description: "An endless, crossy-road type game.",
            tech: ['Three.js','HTML', 'CSS', 'JavaScript' ]
        },
        {
            id: 4,
            title: "Pathly",
            src: "/pathly.png",
            href:"https://pathly-delta.vercel.app/",
            github: "https://github.com/abhaydesu/pathly",
            description: "A URL shortener with simple analytics",
            tech: ['React', 'Express', 'MongoDB', 'Tailwind']
        },
        {
            id: 5,
            title: "Throtl",
            src: "/throtl.png",
            href:"https://throtl.vercel.app/",
            github: "https://github.com/abhaydesu/throtl",
            description: "Made frontend for Throtl: Automated bandwidth throttler.",
            tech: ['Frontend','Tailwind', 'Motion', 'React' ]
        },
        {
            id: 6,
            title: "Aakar ",
            src: "/aakar.png",
            href:"https://aakar0.vercel.app/",
            github: "https://github.com/abhaydesu/Aakar",
            description: "Made frontend for Aakar: A credentials aggregator platform",
            tech: ['Next.js', 'Tailwind', 'Motion']
        },
        {
            id: 7,
            title: "Aetos ",
            src: "/aetos.png",
            href:"https://aetos0.vercel.app/",
            github: "https://github.com/abhaydesu/Aetos",
            description: "Made frontend for Aetos: An analytics Dashboard",
            tech: ['React', 'Tailwind', 'Motion']
        },
        {
            id: 8,
            title: "Virtual Gallery",
            src: "/art-gallery.png",
            href:"https://3d-virtualgallery.netlify.app/",
            github: "https://github.com/abhaydesu/virtual-gallery",
            description: "A showcase of paintings in a 3D manner.",
            tech: ['Three.js', 'HTML', 'CSS', 'JavaScript']
        },
        {
            id: 9,
            title: "Portfolio Website",
            src: "/portfolio.png",
            href:"#",
            github: "https://github.com/abhaydesu/portfolio",
            description: "This website you're on :)",
            tech: ['TypeScript', 'Next.js', 'TailwindCSS', 'Motion']
        },
        {
            id: 10,
            title: "Coming soon",
            src: "/coming-soon.png",
            href:"",
            github: "",
            description: "...",
            tech: ['><'],
        },
    ]
