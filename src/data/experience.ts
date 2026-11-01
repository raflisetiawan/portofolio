import type { Experience } from "../types.ts";

// Newest first. INA Digital Edu is government-related work: keep it at process
// and architecture level, with no internal data or details.
export const experience: Experience[] = [
  {
    role: "Analytics Engineer (Tribe Specialist)",
    company: "INA Digital Edu",
    period: "Jul 2026 – Present",
    current: true,
    highlights: [
      "Review and validate PRDs against Figma mockups for an executive dashboard covering civil-servant (ASN) performance and talent mapping.",
      "Define data specifications that combine performance and HRIS data into quarterly snapshot models.",
      "Manage KPI dashboards for the Data Squad.",
      "Prepare periodic achievement reports and join stand-ups with program stakeholders.",
    ],
    tags: ["BigQuery", "dbt", "Airflow", "Looker Studio", "ClickUp"],
    note: "Government-related work, described at process level only.",
  },
  {
    role: "Frontend Developer",
    company: "PT AZ Logistic",
    period: "Nov – Dec 2025",
    highlights: [
      "Built logistics web interfaces in Next.js, integrated with backend REST APIs.",
      "Delivered the User Management, My Voucher, and My Subscription modules.",
      "Kept the UI responsive across devices.",
    ],
    tags: ["Next.js", "REST API"],
  },
  {
    role: "Full Stack Developer Intern",
    company: "PT Semen Indonesia Tbk",
    period: "Oct 2024 – Jan 2025",
    highlights: [
      "Built an internal knowledge management and innovation system in Laravel.",
      "Implemented authentication, role-based access, proposal submission, and automated ranking.",
    ],
    tags: ["Laravel"],
  },
];
