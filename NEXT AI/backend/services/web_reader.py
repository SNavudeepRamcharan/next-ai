import requests
from bs4 import BeautifulSoup


def read_webpage(url: str):

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    response = requests.get(
        url,
        headers=headers,
        timeout=10,
    )

    soup = BeautifulSoup(
        response.text,
        "lxml",
    )

    for tag in soup([
        "script",
        "style",
        "noscript",
    ]):
        tag.decompose()

    text = soup.get_text(" ")

    text = " ".join(text.split())

    return text[:12000]