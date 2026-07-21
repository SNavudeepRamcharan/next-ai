import re

from youtube_transcript_api import YouTubeTranscriptApi


def get_video_id(url: str):

    match = re.search(
        r"(?:v=|youtu\.be/)([A-Za-z0-9_-]{11})",
        url,
    )

    if not match:
        return None

    return match.group(1)


def read_youtube(url: str):

    video_id = get_video_id(url)

    if not video_id:
        return None

    api = YouTubeTranscriptApi()

    transcript = api.fetch(video_id)

    text = ""

    for line in transcript:

        text += line.text + " "

    return text[:15000]