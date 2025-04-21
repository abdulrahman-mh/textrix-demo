import json
from aiohttp import ClientSession, ClientTimeout
from bs4 import BeautifulSoup
import asyncio
from tqdm.asyncio import tqdm

HTTP_TIMEOUT = 15
BASE_URL = "https://embed.ly"
PROVIDER_PAGE_URL = BASE_URL + "/provider/{}"
PROVIDERS = {}


# Load Existing Providers
try:
    with open("providers.json", "r", encoding="utf-8") as f:
        PROVIDERS = json.load(f)
except FileNotFoundError:
    PROVIDERS = {}  # Initialize empty if the file doesn't exist
except json.JSONDecodeError:
    PROVIDERS = {}


async def fetch(url: str, session: ClientSession, sem: asyncio.Semaphore, retries=3):
    """Fetch the HTML content of a URL with retries."""
    async with sem:
        for attempt in range(retries):
            try:
                async with session.get(url) as response:
                    response.raise_for_status()
                    return await response.text()
            except Exception as e:
                if attempt < retries - 1:
                    await asyncio.sleep(2)
                else:
                    print(f"Failed to fetch {url} after {retries} attempts: {e}")
                    return None


async def scrape_providers():
    """Main function to scrape Embed.ly providers."""
    sem = asyncio.Semaphore(10)  # Control concurrency
    async with ClientSession(timeout=ClientTimeout(total=HTTP_TIMEOUT)) as session:
        # Fetch main provider page
        try:
            main_page = await fetch(BASE_URL + "/providers", session, sem)
            if not main_page:
                print("Error: Unable to fetch providers page.")
                return
        except Exception as e:
            print(f"Error fetching main providers page: {e}")
            return

        # Parse provider IDs
        soup = BeautifulSoup(main_page, "html.parser")
        services_list = soup.select_one(".services > ul")
        if not services_list:
            print("Error: No services list found on the page.")
            return

        provider_ids = [
            li.get("id") for li in services_list.find_all("li") if li.get("id")
        ]

        # Remove providers from the existing list that no longer exist
        for existing_provider in list(PROVIDERS.keys()):
            if existing_provider not in provider_ids:
                del PROVIDERS[existing_provider]

        print(f"Found {len(provider_ids)} providers.")

        # Fetch provider details
        tasks = [
            fetch(PROVIDER_PAGE_URL.format(pid), session, sem) for pid in provider_ids
        ]
        provider_pages = await tqdm.gather(
            *tasks, desc="Fetching Providers", unit="provider"
        )

        # Parse each provider's details
        for pid, page in zip(provider_ids, provider_pages):
            if page:
                provider_soup = BeautifulSoup(page, "html.parser")
                url_schemes = provider_soup.select(".provider-url-schemes ul li")
                schemas = [li.get_text(strip=True) for li in url_schemes]
                PROVIDERS[pid] = schemas

        # Save to JSON
        try:
            with open("providers.json", "w", encoding="utf-8") as json_file:
                json.dump(PROVIDERS, json_file, indent=4, ensure_ascii=False)
                print("Providers data written to providers.json.")
        except Exception as e:
            print(f"Error writing to JSON file: {e}")


if __name__ == "__main__":
    asyncio.run(scrape_providers())
