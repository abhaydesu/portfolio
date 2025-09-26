export type Project = {
    id:number,
    title: string
    src: string;
    href: string;
    description: string;
    tech: string[]
}

export const projects: Project[] = [
        {
            id: 1,
            title: "Git Pilot CLI",
            src: "/git-pilot-demo.png",
            href: "https://gitpilot.abhaydesu.dev/",
            description: "A cli tool that makes git simpler, leveraging AI.",
            tech: ['Node.js', 'Express.js', 'Google Gemini API', 'Commander.js', 'Vercel']
        },
        {
            id: 2,
            title: "Dip-Dash",
            src: "/dipdash.png",
            href:"https://dipdash.abhaydesu.dev/",
            description: "An endless, crossy-road type game.",
            tech: ['Three.js','HTML', 'CSS', 'JavaScript' ]
        },
        {
            id: 3,
            title: "3D Art Gallery",
            src: "/art-gallery.png",
            href:"https://3d-virtualgallery.netlify.app/",
            description: "A basic showcase of paintings in a 3D manner.",
            tech: ['Three.js', 'HTML', 'CSS', 'JavaScript']
        },
        {
            id:4,
            title: "Portfolio Website",
            src: "/portfolio-light.png",
            href:"#",
            description: "This website you're on :)",
            tech: ['TypeScript', 'Next.js', 'TailwindCSS']
        },
        {
            id:5,
            title: "Coming soon",
            src: "/coming-soon.png",
            href:"#",
            description: "...",
            tech: ['Node.js', 'TailwindCSS'],
        },
    ]
