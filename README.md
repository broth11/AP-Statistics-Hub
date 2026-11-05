# AP Statistics Hub

A study site for AP Statistics students: a video study guide organized by unit and lesson. Each lesson page pairs the video with key moments and the sections the topic needs: a decision check, a procedure, an interactive explorer, a Desmos walkthrough, exam wording and traps, multiple choice, and a free-response practice box.

Live site (after enabling GitHub Pages, see below): https://broth11.github.io/AP-Statistics-Hub/

## Publish with GitHub Pages

1. On GitHub, open the repo, then **Settings > Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**. Do not use "Deploy from a branch": the private transcripts submodule makes branch builds fail.
3. Every push to `main` that changes `docs/` runs `.github/workflows/pages.yml` and publishes the site. To publish by hand, open **Actions > Deploy site to GitHub Pages > Run workflow**.
4. After a minute the site is live at the URL above.

Only the `docs/` folder is published. Transcripts, notes, and the archive stay out of the site.

## Run it on your computer

The site loads its data with `fetch`, so open it through a local server, not by double-clicking the file.

```
cd docs
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Layout

```
.
├── docs/                      the site (this is what GitHub Pages serves)
│   ├── index.html             home: choose a unit, then a lesson
│   ├── lesson.html            one template for every lesson (lesson.html?v=23)
│   ├── css/
│   │   ├── modernist.css      design tokens and base components
│   │   └── site.css           layout for this site
│   ├── js/
│   │   ├── home.js, lesson.js page entry points
│   │   ├── shell.js           top bar
│   │   ├── video.js           YouTube seek control
│   │   ├── tex-text.js        <tex-text> element (KaTeX)
│   │   ├── sections/          one module per lesson section
│   │   └── explorers/         the explorer library (binomial, random-assignment, one-proportion-test)
│   └── data/
│       ├── site.json          course config: titles, units, calculator, FRQ symbols
│       ├── lessons.json       all 58 videos: unit, topic, title, status
│       └── lessons/<n>.json   one study page per video (n = playlist position)
├── .claude/skills/video-study-site/   the skill that builds lesson pages
├── transcripts/               private submodule: raw captions and the playlist index
├── notes/                     project notes, design decisions, transcript log
└── archive/                   the original single-file build
```

## Build lesson pages with the skill

The `video-study-site` skill in `.claude/skills/` builds pages. Open this repo in Claude Code (or a Claude session with the repo attached) and ask, for example:

- "Build the study page for 2.11 Part 1."
- "Build all of Unit 4."
- "Here is a new playlist: <link>. Fetch the transcripts and build the site."

For each lesson it reads the transcript, writes `docs/data/lessons/<n>.json`, reuses or adds an explorer, checks the page, and opens a pull request with a review report. Every timestamp in the report sits next to the transcript text found at that time, and every wording change or suspected caption error is flagged.

**Merging the pull request publishes the lessons.** Review the report, then merge. Timestamps keep a small "unverified" label until you check them against the video and ask Claude to mark them verified.

Fetching a new playlist needs YouTube access, so that step runs on your own computer (`pip install yt-dlp` first). The skill gives the exact command if it cannot run it.

## Transcripts

`transcripts/` is a git submodule pointing at the private repo `broth11/AP-Statistics-Hub-transcripts`. The captions belong to the video's creator, so only the site's authors can read them. Public visitors see only the pointer.

Authors with access fetch it with:

```
git clone --recurse-submodules https://github.com/broth11/AP-Statistics-Hub.git
# or, in an existing clone:
git submodule update --init
```

It holds 58 raw, auto-generated caption files from Michael Porinchak's AP Statistics Complete Course playlist, collected 4 November 2026, plus `playlist-index.csv` and `playlist-index.json`. They are uncorrected, so notation and names may contain caption errors.

## Open items

See `notes/project-notes.md`.
