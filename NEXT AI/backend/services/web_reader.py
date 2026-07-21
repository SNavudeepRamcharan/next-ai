import requests
from bs4 import BeautifulSoup


def read_webpage(url: str) -> str:
    headers = {
        "User-Agent": (
            "Mozilla/5.0 "
            "(Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36"
        )
    }

    response = requests.get(
        url,
        headers=headers,
        timeout=15,
    )

    response.raise_for_status()

    soup = BeautifulSoup(
        response.text,
        "lxml",
    )

    for tag in soup([
        "script",
        "style",
        "noscript",
        "header",
        "footer",
        "nav",
    ]):
        tag.decompose()

    text = soup.get_text(separator=" ")

    text = " ".join(text.split())

    return text[:15000]