import { glob } from "astro/loaders";
import { defineCollection, reference, z } from "astro:content";
import osisToEn from "bible-reference-formatter";

const getSlugFromFilename = (val: string): string => {
  const regexRes = val?.match(/([^/?#]+)$/g);
  let slug = regexRes ? regexRes[0] : val;
  slug = slug.replace(".md", "");
  return slug;
};

// const isSunday = (input: Date) => {
//   const date = new Date(
//     input.valueOf() + input.getTimezoneOffset() * 60 * 1000,
//   );
//   return date.getDay() === 0;
// };

const siteConfig = defineCollection({
  loader: glob({
    pattern: "site.config.json",
    base: "./src/content-collections/",
  }),
  schema: z.object({
    general: z.object({
      name: z.string(),
      description: z.string(),
      logo: z.string().optional(),
      youtube: z.string().optional(),
    }),
    header: z
      .object({
        displayTitle: z.boolean(),
        displayLogo: z.boolean(),
      })
      .optional(),
    body: z
      .object({
        hero: z
          .object({
            text: z.string(),
            bgImage: z.string().optional(),
          })
          .optional(),
        cta: z
          .object({
            text: z.string().optional(),
            link: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
    footer: z
      .object({
        left: z
          .object({
            sections: z
              .array(
                z.object({
                  heading: z.string().optional(),
                  description: z.string().optional(),
                }),
              )
              .optional(),
            social: z
              .array(
                z.object({
                  name: z.string(),
                  icon: z.string(),
                  link: z.string(),
                  hint: z.string().optional(),
                }),
              )
              .optional(),
          })
          .optional(),
        form: z
          .object({
            isActive: z.boolean(),
            heading: z.string().optional(),
            description: z.string().optional(),
          })
          .optional(),
        give: z
          .object({
            isActive: z.boolean(),
            heading: z.string().optional(),
            description: z.string().optional(),
            link: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
    theme: z
      .object({
        colorScheme: z.string(),
        customCSS: z.string().optional(),
      })
      .optional(),
  }),
});

const sermonsCollection = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.md",
    base: "./src/content-collections/sermons",
  }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    // Replace regular date validator with this to limit valid dates to Sundays.
    // date: z.date().superRefine((val, ctx) => {
    //   if (!isSunday(val)) {
    //     const weekday = val.toLocaleDateString("en-US", {
    //       weekday: "long",
    //       timeZone: "UTC",
    //     });

    //     ctx.addIssue({
    //       code: z.ZodIssueCode.custom,
    //       message: `Sermon date must be a Sunday, received ${weekday}`,
    //     });
    //   }
    // }),
    series: z.preprocess((val) => {
      return getSlugFromFilename(val as string);
    }, reference("series")),
    scripture: z
      .array(z.string().refine((val) => osisToEn("esv-long", val)))
      .optional(),
    preacher: z.preprocess((val) => {
      return getSlugFromFilename(val as string);
    }, reference("preachers")),
    spotifyURL: z.string().optional(),
    bulletinURL: z.string().optional(),
  }),
});

const seriesCollection = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.md",
    base: "./src/content-collections/series",
  }),
  schema: z.object({
    title: z.string(),
    image: z.string().optional(),
    startDate: z.date(),
    book: z
      .array(
        z.enum([
          "Genesis",
          "Exodus",
          "Leviticus",
          "Numbers",
          "Deuteronomy",
          "Joshua",
          "Judges",
          "Ruth",
          "1 Samuel",
          "2 Samuel",
          "1 Kings",
          "2 Kings",
          "1 Chronicles",
          "2 Chronicles",
          "Ezra",
          "Nehemiah",
          "Esther",
          "Job",
          "Psalms",
          "Proverbs",
          "Ecclesiastes",
          "Song of Solomon",
          "Isaiah",
          "Jeremiah",
          "Lamentations",
          "Ezekiel",
          "Daniel",
          "Hosea",
          "Joel",
          "Amos",
          "Obadiah",
          "Jonah",
          "Micah",
          "Nahum",
          "Habakkuk",
          "Zephaniah",
          "Haggai",
          "Zechariah",
          "Malachi",
          "Matthew",
          "Mark",
          "Luke",
          "John",
          "Acts",
          "Romans",
          "1 Corinthians",
          "2 Corinthians",
          "Galatians",
          "Ephesians",
          "Philippians",
          "Colossians",
          "1 Thessalonians",
          "2 Thessalonians",
          "1 Timothy",
          "2 Timothy",
          "Titus",
          "Philemon",
          "Hebrews",
          "James",
          "1 Peter",
          "2 Peter",
          "1 John",
          "2 John",
          "3 John",
          "Jude",
          "Revelation",
        ]),
      )
      .optional(),
  }),
});

const preachersCollection = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.md",
    base: "./src/content-collections/preachers",
  }),
  schema: z.object({
    name: z.string(),
    isGuest: z.boolean(),
    priority: z.number(),
    image: z.string().optional(),
  }),
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content-collections/pages" }),
  schema: z.object({
    title: z.string(),
    order: z.number().optional(),
    type: z.enum(["Blog", "Events", "Sermons"]).optional(),
  }),
});

const blogCollection = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.md",
    base: "./src/content-collections/blog",
  }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
  }),
});

export const collections = {
  config: siteConfig,
  sermons: sermonsCollection,
  series: seriesCollection,
  preachers: preachersCollection,
  pages: pagesCollection,
  blog: blogCollection,
};
