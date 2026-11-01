export type IconName =
  | "arrow-up-right"
  | "chat"
  | "close"
  | "send"
  | "download"
  | "github"
  | "linkedin"
  | "mail"
  | "moon"
  | "sun";

export interface NavItem {
  id: string;
  label: string;
}

export interface SocialLink {
  label: string;
  /** Text shown in the Contact section, e.g. the address without its protocol. */
  display: string;
  href: string;
  icon: IconName;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  current?: boolean;
  highlights: string[];
  tags: string[];
  note?: string;
}

export interface Project {
  title: string;
  context: string;
  description: string;
  tags: string[];
  /** Optional: the title becomes a link when this is set. */
  url?: string;
  /** Marks a slot that has no finished project behind it yet. */
  placeholder?: boolean;
}

export interface Education {
  degree: string;
  school: string;
  year: string;
}
