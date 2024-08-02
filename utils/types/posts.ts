import { z } from 'zod';

export const postSchema = z.object({
  id: z.number(),
  authorId: z.number(),
  type: z.string(),
  tiktokId: z.string(),
  postDescription: z.string().nullable(),
  originalURL: z.string().nullable().optional(),
  video: z
    .object({
      id: z.number(),
      mp4URL: z.string(),
      hlsURL: z.string().nullable(),
      thumbnail: z.string().nullable(),
      postId: z.number(),
    })
    .nullable(),
  carousel: z
    .object({
      id: z.number(),
      images: z.string(),
      audio: z.string(),
      postId: z.number(),
    })
    .nullable(),
  author: z.object({
    id: z.number(),
    tiktokId: z.string(),
    name: z.string(),
    image: z.string(),
    handle: z.string(),
  }),
});
