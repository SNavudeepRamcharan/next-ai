import re


def extract_memory(message: str):

    patterns = [

        r"my name is (.*)",

        r"i am (.*)",

        r"remember that (.*)",

        r"my favorite (.*)",

        r"i live in (.*)",

        r"i work as (.*)",

    ]

    message = message.lower()

    for pattern in patterns:

        match = re.search(pattern, message)

        if match:

            return match.group(0)

    return None