export interface Heading {
  id: string;
  title: string;
  depth: number;
}
export interface Entry {
  source: string;
  url: string;
  title: string;
  description: string;
  language: string;
  category: string;
  tags: string[];
  modified?: string;
  dateSource?: string;
  conceptId?: string;
  status?: string;
  translationStatus?: string;
}
export interface Document extends Entry {
  html: string;
  text: string;
  toc: Heading[];
  translations: Record<string, string>;
  sources: { title: string; url?: string }[];
  mermaid: boolean;
  verified: { by: string; at: string }[];
  freshness?: string;
}
export interface NavItem {
  title: string;
  url: string;
  section: string;
}
export interface PageData {
  language: string;
  base: string;
  origin: string;
  repository: string;
  branch: string;
  document?: Document;
  entries: Entry[];
  navigation: Record<string, NavItem[]>;
  languages: string[];
  notFound?: boolean;
}
export interface SearchEntry extends Entry {
  text: string;
}
