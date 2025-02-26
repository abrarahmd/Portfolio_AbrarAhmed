import { defineNuxtConfig } from "nuxt/config"

// Base config
import head from "./config/head"

// Hooks
import { generateOgImages } from "./hooks/generateOgImages"
import { getBlogPosts } from "./hooks/scripts/getBlogPosts"

export default defineNuxtConfig({
  nitro: {
    preset: "netlify",
  },

  app: {
    head,
    pageTransition: { name: "fade", mode: "out-in" },
  },

  css: ["~/assets/css/main.scss"],

  modules: [
    "@vite-pwa/nuxt",
    "@nuxtjs/color-mode",
    "@nuxt/icon",
    "@nuxt/content",
    "@nuxtjs/sitemap",
    [
      "@nuxtjs/robots",
      {
        disableNuxtContentIntegration: true,
      },
    ],
    [
      "@nuxtjs/google-fonts",
      {
        display: "swap",
        families: {
          Inter: [400, 500, 600, 700],
        },
      },
    ],
    [
      "@nuxtjs/tailwindcss",
      {
        viewer: false,
        config: "~/tailwind.config.ts",
      },
    ],
    [
      "nuxt-disqus",
      {
        shortname: "abrarahmd.dev",
      },
    ],
    [
      "nuxt-gtag",
      {
        enabled: process.env.NODE_ENV === "production",
        id: process.env.GOOGLE_ANALYTICS_ID,
      },
    ],
  ],

  content: {
    build: {
      markdown: {
        highlight: {
          themes: ["vitesse-dark", "vitesse-light"],
          theme: {
            default: "vitesse-dark",
            light: "vitesse-light",
            dark: "vitesse-dark",
          },
        },
        toc: {
          depth: 5,
        },
        rehypePlugins: {
          "rehype-external-links": {
            target: "_blank",
            rel: "noreferrer noopener",
          },
          "rehype-autolink-headings": {
            behavior: "append",
          },
        },
      },
    },
  },

  sitemap: {
    exclude: ["/api/content/posts/database.sql"],
    urls: getBlogPosts().map((post) => `https://abrarahmd/blog/${post.slug}`),
  },

  site: {
    url: "https://abrarahmd.dev",
    name: "abrarahmd.dev",
  },

  pwa: {
    manifest: {
      name: "abrarahmed.dev",
      short_name: "abrarahmed.dev",
      theme_color: "#f56565",
      description:
        "I am a Computer Science and Engineering graduate with a strong foundation in a diverse range of programming languages and technologies, including Python, MySQL, Node.js, JavaScript, HTML, and CSS.",
      lang: "en",
      icons: [
        {
          src: "/",
          sizes: "1024x1024",
          type: "image/png",
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      social: {
        twitter: "https://x.com/__abrarahmed__",
        github: "https://github.com/abrarahmd/",
        linkedIn: "https://www.linkedin.com/in/abrarahmd/",
        email: "abrargroad2000@gmail.com",
      },
      sponsor: {
        github: "https://github.com/abrarahmd/",
      },
      isDev: process.env.NODE_ENV === "development",
    },
  },

  hooks: {
    "nitro:build:before": async () => {
      if (process.env.NODE_ENV === "production") await generateOgImages()
    },
  },
  compatibilityDate: "2026-02-16",
})