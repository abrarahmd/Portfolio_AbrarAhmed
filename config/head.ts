/* Define constants */
const image = "/icon.png"
const description =
  "Professional JavaScript developer from Turkey specializing in React.js, Vue.js, TypeScript, Node.js, and Flutter. Passionate about crafting innovative software solutions and continuously improving programming skills."

const head = {
  title: "abrarahmd.dev",
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    {
      hid: "description",
      name: "description",
      content: description,
    },
    /* Twitter */
    {
      hid: "twitter:card",
      name: "twitter:card",
      content: "summary",
    },
    {
      hid: "twitter:site",
      name: "twitter:site",
      content: "@abrarahmed",
    },
    {
      hid: "twitter:creator",
      name: "twitter:creator",
      content: "@abrarahmed",
    },
    {
      hid: "twitter:title",
      name: "twitter:title",
      content: "abrarahmd.dev",
    },
    {
      hid: "twitter:description",
      name: "twitter:description",
      content: description,
    },
    {
      hid: "twitter:image",
      name: "twitter:image",
      content: image,
    },
    /* Open-Graph */
    {
      hid: "og:type",
      name: "og:type",
      content: "website",
    },
    {
      hid: "og:site_name",
      name: "og:site_name",
      content: "abrarahmd.dev",
    },
    {
      hid: "og:description",
      name: "og:description",
      content: description,
    },
    {
      hid: "og:image",
      name: "og:image",
      content: image,
    },
    /* Others */
    {
      hid: "theme-color",
      name: "theme-color",
      content: "#171717",
    },
  ].map((i) => {
    // @ts-ignore-next-line
    if (i.name && !i.property) i.property = i.name
    return i
  }),
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/icon.png",
    },
  ],
}

export default head
