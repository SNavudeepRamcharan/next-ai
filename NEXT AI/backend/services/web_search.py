from duckduckgo_search import DDGS


def search_web(query: str, max_results: int = 5):
    """
    Search the web using DuckDuckGo and return
    title, snippet and URL.
    """

    results = []

    try:

        with DDGS() as ddgs:

            search_results = ddgs.text(
                query,
                max_results=max_results,
            )

            for item in search_results:

                results.append(
                    {
                        "title": item.get("title", ""),

                        "body": item.get("body", ""),

                        "url": item.get("href")
                        or item.get("url", ""),
                    }
                )

    except Exception as e:

        print("Web Search Error:", e)

    return results