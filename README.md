# AP Statistics Hub

A study site for AP Statistics students: a video study guide organized by unit and lesson. Each lesson page pairs the video with key moments, a decision check, a procedure, an interactive explorer, a Desmos walkthrough, exam wording and traps, multiple choice, and a free-response practice box.

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
│   │   ├── config.js          Desmos key and script URL
│   │   └── sections/          one module per lesson section
│   └── data/
│       ├── lessons.json       all 58 videos: unit, topic, title, status
│       └── lessons/23.json    content for one lesson (2.10 so far)
├── transcripts/               private submodule: raw captions and the playlist index
├── notes/                     project notes, design decisions, transcript log
└── archive/                   the original single-file build
```

## Add a lesson

1. Copy `docs/data/lessons/23.json` to `docs/data/lessons/<n>.json`, where `<n>` is the playlist number in `lessons.json`.
2. Fill in the video ID, key moments, and the sections you want. Sections appear in the order listed, and any section can be left out.
3. In `docs/data/lessons.json`, change that lesson's `status` from `transcript` to `live`. Its row on the home page becomes a link.

Section types: `decision`, `procedure`, `explorer`, `desmos`, `wording`, `mcq`, `frq`. The `explorer` and `desmos` modules are built around the binomial distribution for now. A new topic that needs a different explorer gets its own module in `docs/js/sections/`.

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
