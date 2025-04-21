import metascraper from 'metascraper';
import metascraperAuthor from 'metascraper-author';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';
import metascraperTitle from 'metascraper-title';
import metascraperIframe from './metascraper-safe-iframe';
import type { IframeResult, Media } from './types';
import * as cheerio from 'cheerio';

const scraper = metascraper([
  metascraperAuthor(),
  metascraperDescription(),
  metascraperImage(),
  metascraperTitle(),
  metascraperIframe(),
]);

export async function extractMedia({ url, ...rest }: Record<string, any>) {
  let html: string | undefined;

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    html = await response.text();
  } catch {}

  const result = await scraper({
    url,
    html,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    iframe: { ...rest },
    isSupportedDomain: true,
  });

  const { iframe, ...other } = result;
  const iframeResult = (iframe || {}) as IframeResult;

  const key = crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
  const media: Media = { mediaId: key };

  media.title = iframeResult.title ?? other.title;
  media.description = other.description;
  media.authorName = iframeResult.author_name ?? other.author;
  media.href = url;

  try {
    media.domain = new URL(media.href!).hostname;
  } catch {}

  media.iframeWidth = Number(iframeResult.width) || undefined;
  media.iframeHeight = Number(iframeResult.height) || undefined;
  media.thumbnailUrl = iframeResult.thumbnail_url ?? other.image;

  if (media.thumbnailUrl) {
    // Optionally upload the thumbnail to your CDN
    media.thumbnailWidth = Number(iframeResult.thumbnail_width) || undefined;
    media.thumbnailHeight = Number(iframeResult.thumbnail_height) || undefined;
    media.thumbnailImageId = '';
  }

  if (iframeResult.html) {
    const $ = cheerio.load(iframeResult.html);
    const iframe = $('iframe').first();

    if (iframe.length) {
      media.iframeSrc = iframe.attr('src');

      // Keep iframe attributes except width, height, and src
      const attrs = Object.fromEntries(
        Object.entries(iframe.attr() ?? {}).filter(
          ([key]) => !['src', 'width', 'height'].includes(key)
        )
      );

      media.iframeAttr = attrs;
    }
  }

  // Store media ID with original data for security, to restore it when generate published content
  return media;
}
