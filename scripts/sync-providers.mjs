import fs from 'node:fs';
import * as cheerio from 'cheerio';
import pLimit from 'p-limit';
import cliProgress from 'cli-progress';

const HTTP_TIMEOUT = 15000;
const BASE_URL = 'https://embed.ly';
const PROVIDER_PAGE_URL = id => `${BASE_URL}/provider/${id}`;
const SUPPORTED_DOMAINS_FILE = 'supported-domains.json';

let DOMAINS = [];

try {
  if (fs.existsSync(SUPPORTED_DOMAINS_FILE)) {
    const data = fs.readFileSync(SUPPORTED_DOMAINS_FILE, 'utf-8');
    DOMAINS = JSON.parse(data);
  } else {
    DOMAINS = [];
  }
} catch {
  DOMAINS = [];
}

// Fetch HTML with retries
const fetchWithRetries = async (url, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), HTTP_TIMEOUT);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) {
        return null;
      }

      return await response.text();
    } catch (error) {
      if (attempt === retries) {
        console.error(`Failed to fetch ${url}`);
        return null;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  return null;
};

// Scrape Embed.ly providers
const scrapeProvidersDomains = async () => {
  try {
    const mainPage = await fetchWithRetries(`${BASE_URL}/providers`);
    if (!mainPage) {
      console.error('Error: Unable to fetch providers page.');
      process.exit(1);
    }

    const $ = cheerio.load(mainPage);
    const servicesList = $('.services > ul');
    if (!servicesList.length) {
      console.error('Error: No services list found on the page.');
      process.exit(1);
    }

    const providerIds = servicesList
      .find('li')
      .map((_, li) => $(li).attr('id'))
      .get();
    console.log(`Found ${providerIds.length} providers.`);

    const limit = pLimit(100);

    const progress = new cliProgress.SingleBar({}, cliProgress.Presets.legacy);
    progress.start(providerIds.length, 0);

    // Fetch provider details
    const tasks = providerIds.map(id =>
      limit(async () => {
        const providerPage = await fetchWithRetries(PROVIDER_PAGE_URL(id));
        if (providerPage) {
          const provider$ = cheerio.load(providerPage);

          const placeholder = provider$('.provider-try input').attr('placeholder');
          if (placeholder) {
            const domain = placeholder.replace('https://', '').replace('http://', '');

            if (domain.endsWith('..')) {
              domain.slice(0, -2);
            }

            if (domain && !DOMAINS.includes(domain)) {
              DOMAINS.push(domain);
            }
          }
        }
        progress.increment();
      })
    );

    await Promise.all(tasks);
    progress.stop();

    fs.writeFileSync(
      SUPPORTED_DOMAINS_FILE,
      JSON.stringify(Array.from(new Set(DOMAINS)).sort(), null, 2),
      'utf-8'
    );
    console.log(`Domains data written to providers.json. Total: ${DOMAINS.length} domain`);
    process.exit(0);
  } catch (error) {
    console.error('Error during scraping:', error);
    process.exit(1);
  }
};

// Run the scraper
scrapeProvidersDomains();
