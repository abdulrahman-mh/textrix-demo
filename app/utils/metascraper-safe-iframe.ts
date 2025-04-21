// @ts-nocheck

/**
 * From metascraper/iframe
 * https://github.com/microlinkhq/metascraper/tree/master/packages/metascraper-iframe
 *
 */

import { memoizeOne, normalizeUrl } from '@metascraper/helpers';
import pReflect from 'p-reflect';
import got from 'got';
import oEmbed from 'oembed-spec';

// from-html
const getOembedUrl = memoizeOne(
  (url, $, iframe) => {
    const oembedUrl =
      $('link[type="application/json+oembed"]').attr('href') ||
      $('link[type="text/xml+oembed"]').attr('href');

    if (!oembedUrl) return;

    const oembedUrlObj = new URL(normalizeUrl(url, oembedUrl));

    // Replace lodash's `forEach` with a native for...in loop
    for (const key in iframe) {
      if (Object.prototype.hasOwnProperty.call(iframe, key)) {
        oembedUrlObj.searchParams.append(key.toLowerCase(), iframe[key]);
      }
    }

    return oembedUrlObj.toString();
  },
  (newArgs, oldArgs) =>
    JSON.stringify(oldArgs[2]) === JSON.stringify(newArgs[2]) &&
    memoizeOne.EqualityUrlAndHtmlDom(newArgs, oldArgs)
);

const fromHTML =
  ({ gotOpts }) =>
  async ({ htmlDom, url, iframe, isSupportedDomain }) => {
    if (!isSupportedDomain) return;
    const oembedUrl = getOembedUrl(url, htmlDom, iframe);
    if (!oembedUrl) return;
    const { value } = await pReflect(got(oembedUrl, gotOpts).json());
    return value;
  };

// from-provider (oEmbed)
const findProvider = memoizeOne(url => oEmbed.findProvider(url));
const { fetchProvider } = oEmbed;

const fromProvider =
  ({ gotOpts }) =>
  async ({ url, iframe }) => {
    const provider = findProvider(url);
    const { value } = await pReflect(fetchProvider(provider, url, iframe, gotOpts));
    return value;
  };

// from-twitter
const getPlayerUrl = memoizeOne(
  (_, $) => $('meta[name="twitter:player"]').attr('content'),
  memoizeOne.EqualityUrlAndHtmlDom
);

const playerWidth = $ => $('meta[name="twitter:player:width"]').attr('content');
const playerHeight = $ => $('meta[name="twitter:player:height"]').attr('content');

const fromTwitter =
  () =>
  async ({ htmlDom, url, isSupportedDomain }) => {
    if (!isSupportedDomain) return;
    const playerUrl = getPlayerUrl(url, htmlDom);
    if (!playerUrl) return;

    // Replace lodash's `map` with a native approach
    const props = Object.entries({
      width: playerWidth(htmlDom),
      height: playerHeight(htmlDom),
    })
      .map(([key, value]) => (value === undefined ? undefined : `${key}="${value}"`))
      .filter(Boolean)
      .join(' ');

    return {
      html: `<iframe src="${playerUrl}" frameborder="0" scrolling="no" ${props}></iframe>`,
    };
  };

// iframe rule
const iframe = ({ gotOpts } = {}) => {
  const rules = {
    iframe: [fromHTML({ gotOpts }), fromProvider({ gotOpts }), fromTwitter({ gotOpts })],
  };

  rules.pkgName = 'modified-metascraper-iframe';

  return rules;
};

export default iframe as any;
