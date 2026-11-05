# AP Statistics Hub

A single-page study site for AP Statistics students: a video study guide organized by unit and lesson, with exam-prep tools (common exam-wording traps, a multiple choice check, an Explorer, and a Desmos exam-prep module).

The site itself (`AP Stats Study Site.dc.html`) is not in this repo yet. This first commit holds the source material and project notes.

## Layout

```
.
├── README.md
├── docs/
│   ├── project-notes.md                    where the site work stood, decisions, open items
│   ├── five-video-guidance-spot-check.md   guidance patterns found in five sample videos
│   └── transcript-gathering-conversation.md  how the transcripts were collected
└── transcripts/
    ├── 01-... to 58-...                    raw timestamped captions, one file per video
    ├── playlist-index.csv                  titles, video links, filenames, segment counts
    ├── playlist-index.json                 same index, structured
    └── README.md                           notes on the transcript set
```

## Transcripts

58 raw, auto-generated caption files from the AP Statistics Complete Course playlist on YouTube, collected 4 November 2026. They are uncorrected source material, so statistical notation and names may contain caption errors. Filenames start with the playlist position and end with the YouTube video ID. Use `transcripts/playlist-index.csv` to find a video by title.

The captions belong to the video's creator. They are kept here as private working material for building review sheets and timestamped links, not for republishing.

## Next steps

See the open items in `docs/project-notes.md`.
