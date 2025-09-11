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
            title: "Dip-Dash",
            src: "/dipdash.png",
            href:"https://dipdash.netlify.app",
            description: "An endless, crossy-road type game, built using three.js",
            tech: ['Three.js','HTML', 'CSS', 'JavaScript' ]
        },
                {
            id: 2,
            title: "3D Art Gallery",
            src: "/art-gallery.png",
            href:"https://3d-virtualgallery.netlify.app/",
            description: "A basic showcase of paintings in a 3D manner, built using Three.js",
            tech: ['Three.js', 'HTML', 'CSS', 'JavaScript']
        },
                {
                    id:3,
            title: "Portfolio Website",
            src: "/portfolio-light.png",
            href:"#",
            description: "This website you're on :)",
            tech: ['TypeScript', 'Next.js', 'TailwindCSS']
        },
        {
            id:4,
            title: "Coming soon",
            src: "/coming-soon.png",
            href:"#",
            description: "...",
            tech: ['Node.js', 'TailwindCSS'],
        },


    ]
