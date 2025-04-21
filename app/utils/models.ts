import z from 'zod';

// Define a Zod schema for the query parameters accepted by the API endpoint
export const EmbedRequestQuery = z.object({
  // `url` (required): The URL to retrieve embedding information for.
  url: z.string(),

  // `maxwidth` (optional): The maximum width of the embedded resource.
  maxwidth: z.string().optional(),

  // `maxheight` (optional): The maximum height of the embedded resource.
  maxheight: z.string().optional(),
}).passthrough()

export type EmbedRequestQueryType = z.infer<typeof EmbedRequestQuery>;

// Define a Zod schema for the response data structure from the API
export const Embed = z.object({
  // `type` (required): The resource type (e.g., video, photo, link, and rich.).
  type: z.string(),

  // `version` (required): The oEmbed version number.
  version: z.string(),

  // `title` (optional): A text title describing the resource.
  title: z.string().optional(),

  // `author_name` (optional): The name of the resource's author/owner.
  author_name: z.string().optional(),

  // `author_url` (optional): A URL for the author/owner of the resource.
  author_url: z.string().optional(),

  // `provider_name` (optional): The name of the resource provider (e.g., YouTube, Twitter, etc.).
  provider_name: z.string().optional(),

  // `provider_url` (optional): The URL of the resource provider.
  provider_url: z.string().optional(),

  // `cache_age` (optional): The suggested cache lifetime for this resource, in seconds.
  cache_age: z.string().optional(),

  // `thumbnail_url` (optional): A URL to a thumbnail image representing the resource.
  thumbnail_url: z.string().optional(),

  // `thumbnail_width` (optional): The width of the thumbnail image.
  thumbnail_width: z.string().optional(),

  // `thumbnail_height` (optional): The height of the thumbnail image.
  thumbnail_height: z.string().optional(),
});
