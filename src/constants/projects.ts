export type Project = {
    id:number,
    title: string
    src: string;
    darkSrc?: string;
    href: string;
    github: string;
    description: string;
    tech: string[]
}

export const projects: Project[] = [
        {
            id: 1,
            title: "Hash-it",
            src: "/projects/hash-it-light.png",
            darkSrc: "/projects/hash-it-dark.png",
            href: "https://hash-it.abhaydesu.me",
            github: "https://github.com/abhaydesu/hash-it",
            description: "A platform to log your leetcode solves, and revise them.",
            tech: ["TypeScript", "Next.js", "Postgres", "NeonDB", "TailwindCSS"]
        },
        {
            id: 2,
            title: "Baithak",
            src: "/projects/baithak-light.png",
            darkSrc: "/projects/baithak-dark.png",
            href: "https://baithak.abhaydesu.me",
            github: "https://github.com/abhaydesu/baithak",
            description: "A collection of one-phone party games for friends and family.",
            tech: ['Next.js', 'TypeScript', 'TailwindCSS', 'Zustand']
        },
        {
            id: 3,
            title: "Order Book",
            src: "/projects/order-book-light.png",
            darkSrc: "/projects/order-book-dark.png",
            href: "https://order-book.abhaydesu.me",
            github: "https://github.com/abhaydesu/order-book",
            description: "A limit order and matching engine in C++",
            tech: ["C++"]
        },
        {
            id: 4,
            title: "Lexiq",
            src: "/projects/lexiq.png",
            darkSrc: "/projects/lexiq-dark.png",
            href: "https://lexiq-seven.vercel.app",
            github: "https://github.com/abhaydesu/lexiq",
            description: "An epub reader, built for providing a seamless and cozy reading experience",
            tech: ["TypeScript", "React.js", "TailwindCSS"]
        },
        {
            id: 5,
            title: "Git Pilot",
            src: "/projects/git-pilot-light.png",
            darkSrc: "/projects/git-pilot-dark.png",
            href: "https://gitpilot.abhaydesu.me/",
            github: "https://github.com/abhaydesu/git-pilot-cli",
            description: "A cli tool that makes git simpler, leveraging AI. With 900+ all-time downloads",
            tech: ['Node.js', 'JavaScript', 'Express', 'Gemini API']
        },
        {
            id: 6,
            title: "Dip-Dash",
            src: "/projects/dipdash.png",
            href:"https://dipdash.abhaydesu.me/",
            github: "https://github.com/abhaydesu/dip-dash",
            description: "An endless, crossy-road type game.",
            tech: ['Three.js','HTML', 'CSS', 'JavaScript' ]
        },
        {
            id: 7,
            title: "Pathly",
            src: "/projects/pathly-light.png",
            darkSrc: "/projects/pathly-dark.png",
            href:"https://pathly-delta.vercel.app/",
            github: "https://github.com/abhaydesu/pathly",
            description: "A URL shortener with simple analytics",
            tech: ['React', 'Express', 'MongoDB', 'Tailwind']
        },
        {
            id: 8,
            title: "Virtual Gallery",
            src: "/projects/art-gallery.png",
            href:"https://3d-virtualgallery.netlify.app/",
            github: "https://github.com/abhaydesu/virtual-gallery",
            description: "A showcase of paintings in a 3D manner.",
            tech: ['Three.js', 'HTML', 'CSS', 'JavaScript']
        },
        {
            id: 9,
            title: "Throtl",
            src: "/projects/throtl.png",
            href:"https://throtl.vercel.app/",
            github: "https://github.com/abhaydesu/throtl",
            description: "Made frontend for Throtl: Automated bandwidth throttler.",
            tech: ['Frontend','Tailwind', 'Motion', 'React' ]
        },
        {
            id: 10,
            title: "Aakar ",
            src: "/projects/aakar.png",
            href:"https://aakar0.vercel.app/",
            github: "https://github.com/abhaydesu/Aakar",
            description: "Made frontend for Aakar: A credentials aggregator platform",
            tech: ['Next.js', 'Tailwind', 'Motion']
        },
        {
            id: 11,
            title: "Aetos ",
            src: "/projects/aetos.png",
            href:"https://aetos0.vercel.app/",
            github: "https://github.com/abhaydesu/Aetos",
            description: "Made frontend for Aetos: An analytics Dashboard",
            tech: ['React', 'Tailwind', 'Motion']
        },
        {
            id: 12,
            title: "Portfolio Website",
            src: "/projects/portfolio-light.png",
            darkSrc: "/projects/portfolio-dark.png",
            href:"#",
            github: "https://github.com/abhaydesu/portfolio",
            description: "This website you're on :)",
            tech: ['TypeScript', 'Next.js', 'TailwindCSS', 'Motion']
        },
        {
            id: 13,
            title: "Coming soon",
            src: "/projects/coming-soon.png",
            href:"",
            github: "",
            description: "...",
            tech: ['><'],
        },
    ]
