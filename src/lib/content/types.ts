// Content models. Shaped to map 1:1 onto future database tables (one type = one table).
export type PublishState = "draft" | "published";
export type ExamCategory = "iit-jee" | "neet" | "boards" | "other";

export interface Achievement {
  id: string;
  studentName: string;
  photo: string; // URL or empty string
  exam: string;
  category: ExamCategory;
  result: string; // rank, score or percentage
  institution: string;
  year: string;
  featured: boolean;
  status: PublishState;
  isSample: boolean; // true = placeholder entry for design preview only
}

export interface FacultyMember {
  id: string;
  name: string;
  role: string;
  focus: string;
  shortBio: string;
  longBio: string;
  photo: string;
  order: number;
  status: PublishState;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  isPlaceholder: boolean;
  status: PublishState;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
  status: "new" | "contacted" | "closed";
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  addedAt: string;
}

export interface SiteContent {
  home: {
    eyebrow: string;
    heading: string;
    quote: string;
    quoteAuthor: string;
    intro: string;
    heroPhoto: string;
    heroLabel: string;
  };
  about: {
    heading: string;
    intro: string;
    founded: string;
    philosophy: string;
    location: string;
    founderJourney: string;
    beginnings: string;
    growth: string;
    values: { title: string; body: string }[];
  };
  walkthrough: {
    title: string;
    videoUrl: string;
    poster: string;
    isPlaceholder: boolean;
    caption: string;
  };
  contact: {
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
    mapQuery: string;
    hours: string;
  };
  social: { instagram: string; facebook: string; youtube: string };
  settings: { siteName: string; tagline: string; footerText: string; marqueeSpeed: number };
}

export interface ContentState {
  site: SiteContent;
  faculty: FacultyMember[];
  achievements: Achievement[];
  timeline: TimelineItem[];
  enquiries: Enquiry[];
  media: MediaItem[];
}
