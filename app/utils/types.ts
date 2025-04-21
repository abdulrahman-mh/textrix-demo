export interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  bio: string;
  avatar_url: string;
  followers_count: number;
  join_date: string;
  premium_user: boolean;
}

export type UserPublic = Omit<User, "email" | "join_date">;

export interface IframeResult {
  title?: string;
  author_name?: string;
  author_url?: string;
  type?: string;
  height?: string;
  width?: string;
  version?: string;
  provider_name?: string;
  provider_url?: string;
  thumbnail_height?: string;
  thumbnail_width?: string;
  thumbnail_url?: string;
  html?: string;
}

export interface Media {
  mediaId: string;
  title?: string;
  description?: string;
  authorName?: string;
  href?: string;
  domain?: string;
  iframeWidth?: number;
  iframeHeight?: number;
  thumbnailUrl?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  thumbnailImageId?: string;
  iframeSrc?: string;
  iframeAttr?: Record<string, string>;
}
