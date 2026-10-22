import { SITE, abs } from "@/lib/site";

/*
 * What the page is about, for search engines and the AI answer engines that
 * read it: a profile page about one person, who he is and does, where, what
 * he knows, where he studies and has worked, his profiles elsewhere, and the
 * projects on the page (all of them, including the ones only shown once the
 * work wall is opened).
 */
export function JsonLd() {
  const person = `${SITE.url}/#person`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${SITE.url}/#profile`,
        url: SITE.url,
        name: `${SITE.name} — ${SITE.role}`,
        description: SITE.summary,
        inLanguage: "en",
        mainEntity: { "@id": person },
        isPartOf: { "@id": `${SITE.url}/#website` },
        hasPart: { "@id": `${SITE.url}/#projects` },
      },
      {
        "@type": "Person",
        "@id": person,
        name: SITE.name,
        alternateName: SITE.handle,
        url: SITE.url,
        image: abs(SITE.image),
        jobTitle: SITE.role,
        description: [SITE.summary, ...SITE.about].join(" "),
        homeLocation: {
          "@type": "Place",
          name: `${SITE.city}, ${SITE.country}`,
          address: {
            "@type": "PostalAddress",
            addressLocality: SITE.city,
            addressRegion: SITE.region,
            addressCountry: "IN",
          },
        },
        knowsAbout: [
          ...SITE.stack,
          "Full stack web development",
          "Frontend engineering",
          "UI/UX design",
        ],
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: SITE.college.name,
          alternateName: SITE.college.alt,
          url: SITE.college.url,
        },
        hasOccupation: {
          "@type": "Occupation",
          name: SITE.role,
          skills: SITE.stack.join(", "),
        },
        workExample: SITE.projects.map((p) => ({ "@id": p.url })),
        sameAs: SITE.profiles,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: `${SITE.name} — Portfolio`,
        description: `Portfolio of ${SITE.name}: projects, experience, and a little about him.`,
        inLanguage: "en",
        publisher: { "@id": person },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE.url}/#projects`,
        name: `Projects by ${SITE.name}`,
        numberOfItems: SITE.projects.length,
        itemListElement: SITE.projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "SoftwareSourceCode",
            "@id": p.url,
            name: p.name,
            description: p.description,
            url: p.url,
            codeRepository: p.source,
            author: { "@id": person },
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
