import { SITE } from "@/lib/site";

// a plain summary of the site for language models and the assistants built
// on them (llmstxt.org): who this is, in a sentence, then the facts and links
// they'd otherwise piece together from the page
export const dynamic = "force-static";

export function GET() {
  const body = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.summary}`,
    "",
    ...SITE.about.map((line) => `- ${line}`),
    `- Works with: ${SITE.stack.join(", ")}.`,
    "",
    "## Projects",
    "",
    ...SITE.projects.map(
      (p) => `- [${p.name}](${p.url}): ${p.description} (source: ${p.source})`,
    ),
    "",
    "## Links",
    "",
    `- [Portfolio](${SITE.url})`,
    ...(SITE.resume ? [`- [Résumé](${SITE.resume})`] : []),
    ...SITE.profiles.map((href) => `- ${href}`),
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
