import { education } from "../data/education";
import { profile } from "../data/profile";
import { skills } from "../data/skills";
import { socials } from "../data/socials";

const isWebLink = (href: string) => href.startsWith("http");

/** Structured data that helps search engines identify the site as this person's profile. */
export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: profile.siteUrl,
  jobTitle: profile.role,
  description: profile.tagline,
  sameAs: socials.map((social) => social.href).filter(isWebLink),
  alumniOf: education.map((item) => ({ "@type": "CollegeOrUniversity", name: item.school })),
  knowsAbout: [...skills.data, ...skills.frameworks, ...skills.languages],
};

/** The schema as a script tag. "<" is escaped so the data can't close the tag early. */
export function personSchemaScript(): string {
  const json = JSON.stringify(personSchema).replaceAll("<", "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}
