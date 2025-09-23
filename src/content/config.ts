import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    technologies: z.array(z.string()),
    links: z.object({
      demo: z.string().optional(),
      github: z.string().optional(),
      live: z.string().optional(),
    }).optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    lang: z.enum(['es', 'en']),
  }),
});

const experience = defineCollection({
  type: 'content',
  schema: z.object({
    company: z.string(),
    position: z.string(),
    location: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(),
    current: z.boolean().default(false),
    description: z.string(),
    technologies: z.array(z.string()).optional(),
    achievements: z.array(z.string()).optional(),
    logo: z.string().optional(),
    lang: z.enum(['es', 'en']),
  }),
});

const education = defineCollection({
  type: 'content',
  schema: z.object({
    institution: z.string(),
    degree: z.string(),
    field: z.string(),
    location: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(),
    current: z.boolean().default(false),
    gpa: z.string().optional(),
    honors: z.array(z.string()).optional(),
    logo: z.string().optional(),
    lang: z.enum(['es', 'en']),
  }),
});

export const collections = {
  projects,
  experience,
  education,
};