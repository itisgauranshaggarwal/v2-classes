# V2 Classes Official Website

Project: V2 Classes — Official Website

Build a premium, modern, fully responsive website for V2 Classes, an established educational institute located in Sector 13, Hisar, Haryana, India. The institute was established in 2000.

1. Design Direction

Create a sophisticated, editorial-style educational website. It should feel premium, trustworthy, modern and visually distinctive — NOT like a generic coaching institute template.

Visual identity:

Primary colour: Deep red, sampled from the supplied V2 Classes logo.

Background: Warm off-white (#F8F7F4).

Text: Near-black (#171717).

Secondary surfaces: Warm grey.

Typography: Plus Jakarta Sans or Manrope for headings, Inter for body text.

Use oversized typography, asymmetric layouts, generous whitespace, subtle borders, elegant cards and sophisticated animations.

Use red selectively for accents, featured elements and important buttons.

Prioritize visual quality, consistency and accessibility.

2. Navigation

Create a sticky navigation bar with:

V2 Classes logo and institute name on the left.

Home, About Us, Alumni and Contact Us on the right.

Smooth page transitions and active navigation indicators.

Responsive mobile hamburger menu.

3. Homepage

Hero Section

Create an asymmetric two-column editorial layout.

Left:

Large portrait photograph of Varun Sir.

Interesting asymmetric framing with subtle red graphic elements.

Small designation label: Founder & Educator.

Right:

Eyebrow: WELCOME TO V2 CLASSES.

Large heading: "Building Concepts. Shaping Futures."

A prominent quotation area for Varun Sir.

Two-line introduction to the institute.

CTA linking to About Us.

Alumni Achievement Marquee

Create a visually distinctive, continuously moving horizontal alumni achievement showcase.

Requirements:

Infinite right-to-left scrolling.

Asymmetric cards with varying heights and positions.

Normal achievement cards with neutral backgrounds.

Featured achievement cards with subtle red glow effects and stronger visual emphasis.

Smooth animation, seamless looping and pause-on-hover.

Touch-friendly mobile experience.

Respect reduced-motion preferences.

All cards must eventually be populated through the admin system.

About V2 Classes

Introduce the institution with the heading:
"A Legacy of Learning. A Future of Possibilities."

Include a short introduction, founding year, teaching philosophy and location.

Introduce the three faculty members:

Varun Sir: Founder, mathematics teaching and academic guidance.

Sunny Sir: Test papers, evaluation and academic systems.

Vikas Sir: Discipline, invigilation and student assistance.

Use elegant compact faculty cards with photographs and short descriptions.

Interactive Institute Walkthrough

Create a cinematic, immersive walkthrough section titled:
"Step Inside V2 Classes."

Include:

Large video preview/poster.

Prominent play button.

An immersive pinned video section after activation.

Scroll-controlled video scrubbing, synchronizing scroll progress with video currentTime.

Desktop keyboard and on-screen navigation controls.

Touch-based interaction on mobile.

Progress indicator and exit control.

Normal video playback fallback and static image fallback.

Use a clearly labelled placeholder video until actual footage is provided. Do not invent institute footage.

Footer

Include logo, short description, navigation links, contact details, social links, WhatsApp and copyright information.

4. About Us Page

Create a storytelling-focused editorial page containing:

Introduction to V2 Classes.

Varun Sir's personal journey and teaching philosophy.

How V2 Classes began.

Institute history and milestones in a visual timeline.

Growth and development of the institution.

Detailed faculty profiles.

Teaching philosophy and values.

Contact CTA.

Do not invent biographical details or historical milestones. Use clearly labelled editable placeholders where information is unavailable.

5. Alumni Page

Create a dedicated achievement archive with:

Strong editorial hero section.

Achievement statistics (only when actual data is available).

Responsive alumni card grid.

Search by student name.

Filters for IIT/JEE, NEET, Boards and Other Achievements.

Each card should support:

Student name.

Photograph (optional).

Examination.

Rank, score or percentage.

Institution/admission details.

Achievement year.

Featured achievement status.

Design cards elegantly with featured achievements receiving special visual treatment.

Do not fabricate student names, ranks, scores or admission details.

6. Contact Us Page

Include:

Institute address in Sector 13, Hisar.

Phone number, WhatsApp and email.

Google Maps embed with a configurable location.

Contact/enquiry form containing name, phone, email and message.

Form validation, loading states and success/error feedback.

For now, implement the frontend form with a clear placeholder submission handler. Prepare its structure for later Supabase integration and email notifications.

7. Admin Dashboard

Create a separate, secure-looking admin interface at /admin, with a professional, functional dashboard UI.

Include:

Login screen.

Dashboard overview.

Homepage content manager.

Faculty manager.

Alumni manager (add/edit/delete achievements).

About Us editor.

Institute timeline manager.

Walkthrough video manager.

Contact information manager.

Social media links manager.

Media library.

Enquiry management.

Website settings.

Every relevant content element should be editable without code changes.

Support image uploads, text editing, adding/removing records, featured toggles and draft/publish states.

Create reusable forms and consistent management tables.

For this initial generation, use local mock data and a frontend demonstration of the admin experience. Do not pretend authentication, database persistence or email delivery is already implemented.

Keep the architecture ready for future Supabase integration.

8. Technical Requirements

React + TypeScript + Vite.

Tailwind CSS.

Reusable components and consistent design tokens.

Lucide icons.

Responsive desktop, tablet and mobile layouts.

Use semantic HTML and accessible interactions.

Optimize image loading and animation performance.

Keep pages, components and data models organized.

Avoid unnecessary dependencies.

Include realistic loading, empty and error states.

Structure the project so that Supabase can later provide authentication, database records and image storage.

9. Critical Content Rules

Use supplied V2 Classes assets wherever available.

For missing information:

Use clearly labelled placeholders.

Never invent student achievements, faculty biographies, contact information or institutional history.

Use placeholder photographs only for design previews.

Make all content replaceable through the admin dashboard.

Do not use generic stock imagery as if it represents the actual institute or its faculty.

Final Objective

Deliver a visually impressive, cohesive and complete multi-page website UI with a corresponding admin dashboard UI.

Prioritize exceptional visual design, polished responsive layouts, smooth interactions and reusable architecture.

The website should feel like a premium educational institution with a long-standing academic identity, rather than a template-generated coaching website.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c7b24ef2-7159-417c-8d28-cd1056d0a245).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
