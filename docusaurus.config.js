// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Storeflow",
  tagline: "Your finest online store",
  favicon: "img/favicon.ico",

  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://storeflow-docs.vercel.app",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "aymanbazyan", // Usually your GitHub org/user name.
  projectName: "storeflow", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: "https://github.com/aymanbazyan/storeflow-docs",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: "https://github.com/aymanbazyan/storeflow-docs",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/storeflowIcon.jpg",
      navbar: {
        title: "Storeflow",
        logo: {
          alt: "Storeflow Logo",
          src: "img/storeflowIcon.jpg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Tutorial",
          },
          { to: "#", label: "Blog", position: "left" },
          {
            href: "https://github.com/aymanbazyan/storeflow-docs",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "About",
                to: "/docs/category/about-the-app",
              },
              {
                label: "Tutorial",
                to: "/docs/Setup-Store/intro",
              },
              {
                label: "Guides",
                to: "/docs/Guides/Store-Management/How-to-open-the-Admin-Panel",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Stack Overflow",
                href: "https://stackoverflow.com/users/",
              },
              {
                label: "Discord",
                href: "https://discordapp.com/users/",
              },
              {
                label: "Twitter",
                href: "https://x.com/",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "#",
              },
              {
                label: "GitHub",
                href: "https://github.com/aymanbazyan/storeflow-docs",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Storeflow.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      mermaid: {
        theme: { light: "neutral", dark: "dark" },
      },
    }),
};

export default config;
