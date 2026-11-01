import type { Project } from "../types.ts";

export const projects: Project[] = [
  {
    title: "BeSpoke Decision Support Tool",
    context: "Freelance",
    description:
      "A decision support web app for patients, with a multi-step questionnaire, personalized outcome predictions, interactive visualizations, and PDF export.",
    tags: ["React", "TypeScript", "Firebase", "D3.js"],
  },
  {
    title: "Smart Data Analysis and Statistics",
    context: "Freelance",
    description:
      "A data visualization dashboard for statistical reporting, along with a revamp of the web application around it.",
    tags: ["Laravel", "MySQL"],
  },
  {
    // Placeholder: replace the text, add a url, and remove `placeholder` once the demo is live.
    title: "Data pipeline demo",
    context: "In progress",
    description:
      "A public end-to-end demo: orchestration in Airflow, transformations in dbt, storage in BigQuery, and a dashboard on top. Details coming soon.",
    tags: ["Airflow", "dbt", "BigQuery", "Dashboard"],
    placeholder: true,
  },
];
