import portrait from "@/assets/varun_portrait.jpg.asset.json";
import hall from "@/assets/classroom_hall.jpg.asset.json";
import board from "@/assets/classroom_board.jpg.asset.json";
import type { ContentState } from "./types";

// Text wrapped in [square brackets] is an editable placeholder awaiting real information.
export const PLACEHOLDER = (s: string) => `[${s}]`;
export const isPlaceholderText = (s: string) => s.trim().startsWith("[") && s.trim().endsWith("]");

export const defaultContent: ContentState = {
  site: {
    home: {
      eyebrow: "Welcome to V2 Classes",
      heading: "Building Concepts. Shaping Futures.",
      quote: PLACEHOLDER("Varun Sir's quote — add it from the admin dashboard"),
      quoteAuthor: "Varun Sir, Founder",
      intro:
        "Since 2000, V2 Classes in Sector 13, Hisar has helped students build strong concepts in mathematics and science. Focused guidance, regular testing and a disciplined classroom.",
      heroPhoto: portrait.url,
      heroLabel: "Founder & Educator",
    },
    about: {
      heading: "A Legacy of Learning. A Future of Possibilities.",
      intro:
        "V2 Classes is an educational institute in Sector 13, Hisar, Haryana, guiding students since 2000.",
      founded: "2000",
      philosophy: PLACEHOLDER("Teaching philosophy — to be written by V2 Classes"),
      location: "Sector 13, Hisar, Haryana",
      founderJourney: PLACEHOLDER("Varun Sir's personal journey — to be provided"),
      beginnings: PLACEHOLDER("How V2 Classes began — to be provided"),
      growth: PLACEHOLDER("Growth and development of the institute — to be provided"),
      values: [
        { title: "Concepts first", body: PLACEHOLDER("Describe this value") },
        { title: "Regular evaluation", body: PLACEHOLDER("Describe this value") },
        { title: "Discipline", body: PLACEHOLDER("Describe this value") },
      ],
    },
    walkthrough: {
      title: "Step Inside V2 Classes.",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      poster: hall.url,
      isPlaceholder: true,
      caption: "Placeholder video — the real institute walkthrough will replace this.",
    },
    contact: {
      address: "50, Shopping Complex, MDR108, Sector 13, Hisar, Haryana 125005",
      phone: "+91 98962 68600",
      whatsapp: "919896268600",
      email: PLACEHOLDER("email@v2classes.in"),
      mapQuery: "V2 Classes, Sector 13, Hisar, Haryana",
      hours: PLACEHOLDER("Office hours"),
    },
    social: { instagram: "", facebook: "", youtube: "" },
    settings: {
      siteName: "V2 Classes",
      tagline: "Building Concepts. Shaping Futures.",
      footerText: "An educational institute in Sector 13, Hisar, guiding students since 2000.",
      marqueeSpeed: 60,
    },
  },
  faculty: [
    {
      id: "f1",
      name: "Varun Sir",
      role: "Founder",
      focus: "Mathematics & academic guidance",
      shortBio: "Founder of V2 Classes. Teaches mathematics and guides students academically.",
      longBio: PLACEHOLDER("Detailed profile — to be provided"),
      photo: portrait.url,
      order: 1,
      status: "published",
    },
    {
      id: "f2",
      name: "Sunny Sir",
      role: "Academic Systems",
      focus: "Test papers & evaluation",
      shortBio: "Prepares test papers and runs evaluation and the institute's academic systems.",
      longBio: PLACEHOLDER("Detailed profile — to be provided"),
      photo: "",
      order: 2,
      status: "published",
    },
    {
      id: "f3",
      name: "Vikas Sir",
      role: "Student Affairs",
      focus: "Discipline & student assistance",
      shortBio: "Looks after discipline, invigilation and day-to-day student assistance.",
      longBio: PLACEHOLDER("Detailed profile — to be provided"),
      photo: "",
      order: 3,
      status: "published",
    },
  ],
  achievements: [
    {
      id: "s1",
      featured: true,
      name: "Student Name",
      photo: "",
      exam: "JEE Main",
      achievement: "AIR 100",
      extraField: "",
      status: "published",
    },
    {
      id: "s2",
      featured: false,
      name: "Student Name",
      photo: "",
      exam: "NEET",
      achievement: "Selected",
      extraField: "",
      status: "published",
    },
    {
      id: "s3",
      featured: false,
      name: "Student Name",
      photo: "",
      exam: "Class XII Boards",
      achievement: "95%",
      extraField: "",
      status: "published",
    },
  ],
  timeline: [
    {
      id: "t1",
      year: "2000",
      title: "V2 Classes is founded",
      description: "The institute opens in Hisar.",
      isPlaceholder: false,
      status: "published",
    },
    {
      id: "t2",
      year: PLACEHOLDER("Year"),
      title: PLACEHOLDER("Milestone"),
      description: PLACEHOLDER("Add milestone details from the admin dashboard"),
      isPlaceholder: true,
      status: "published",
    },
    {
      id: "t3",
      year: PLACEHOLDER("Year"),
      title: PLACEHOLDER("Milestone"),
      description: PLACEHOLDER("Add milestone details from the admin dashboard"),
      isPlaceholder: true,
      status: "published",
    },
  ],
  enquiries: [],
  media: [
    { id: "m1", name: "Varun Sir portrait", url: portrait.url, addedAt: "2026-11-25" },
    { id: "m2", name: "Classroom hall", url: hall.url, addedAt: "2026-11-25" },
    { id: "m3", name: "Classroom with board", url: board.url, addedAt: "2026-11-25" },
  ],
};
