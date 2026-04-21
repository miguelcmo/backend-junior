export const siteConfig = {
  name: "Next LMS",
  description: "Plataforma de aprendizaje en línea multi-tenant",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og.png",
  links: {
    twitter: "https://twitter.com/nextlms",
    github: "https://github.com/tu-usuario/next-lms",
  },
}

export type SiteConfig = typeof siteConfig