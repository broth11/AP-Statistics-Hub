# AP Statistics Learning Hub

A study site for Ben's AP Statistics students, built from the transcripts of Michael Porinchak's AP Statistics Complete Course playlist (58 videos).

## Source material
- Local folder: `AP Statistics Video Transcripts/transcripts/`
  - `playlist-index.csv`: number, title, videoId, url, status, transcriptFile
  - `NN-<videoId>.txt`: timestamped captions, lines like `[12:34] text`. Auto-generated, so check wording against the video.
  - `README.md`, `five-video-guidance-spot-check.md`: the guidance-entry format (video, timestamp, topic, takeaway, when to use, steps or conditions, exam wording, common trap, verification status).
- Current build: `AP Stats Study Site.dc.html` (one Design Component, Modernist design system in `_ds/`).

## Decisions
**Audience and use**
- Ben's own students. Main use: studying a topic after class (concept, traps, exam wording, jump to key moments).
- Static site (HTML and JSON), self-hosted (LMS, Google Sites embed, or GitHub Pages). No accounts. No saved progress required.

**Structure**
- One page per video, in the order the video teaches it. Home lists all 58 videos by unit.
- Home fits one screen with no page scroll. Title and short text on the left. The right pane shows "Choose a unit, then a lesson" until a unit tab is picked, then a scrollable lesson list. Only the list scrolls.
- Top menu: Unit 1 to Unit 5 and Reviews. No "All units" tab. The site title returns home.

**Lesson page sections, in order**
1. Video (embedded YouTube, about 60% of width, sticky) with key moments in a scroll box. Clicking a moment seeks the player in place and scrolls the page so the "Key moments" heading is at the top.
2. Decision check (for 2.10: BITS table).
3. Procedure / formula.
4. Explorer (interactive, fits one screen).
5. Desmos walkthrough (fits one screen).
6. Exam wording and traps.
7. Multiple choice.
8. Free response.
- Sticky top bar: site title, unit tabs. Second sticky bar on lesson pages: section tabs plus Expand/Collapse all.
- Every section collapses. Clicking a section tab jumps to it and opens it. Left-column section titles are sticky. Clicking a title jumps to the section, or collapses it if it is already at the top.
- Each section's content fits the viewport where interactive (Explorer, Desmos).

**Content rules**
- Pilot videos: 2.10 Binomial (built), 1.13 Experimental Design, 3.6 and 3.7 P-values and proportion test. Finalize the design on these before scaling to all 58.
- Each guidance entry carries a timestamp and a verification status. Unverified entries are labelled.
- Flag places where the transcript wording is weaker than AP wording, with a note. Examples: "violates independence" for sampling without replacement (use the 10% condition); "random assignment balances groups" and "a large p-value proves H0" must be checked against AP wording.
- Practice questions are newly written, not taken from the video.
- All math renders in KaTeX, including simple expressions such as `$P(X=2)$` and `$p=0.12$`. Formulas read as `$\text{Mean}=np$`.
- Exam wording block: label "Weak" with quoted italics, "Better" below, video link in its own row under the text.
- Wording and tone: plain and matter-of-fact. No filler sections.

**Interactive elements**
- Explorers are built for the pilot topics: Binomial (n, p, k sliders, event buttons, bar chart, probability, mean, SD), P-value null-distribution simulator, random-assignment shuffle.
- Explorer layout rules: one screen with no scroll, chart takes the leftover space. Controls are centered, in equal-width columns, stretched to full width. Preset buttons show a name on row 1 and the values on row 2, with no values split across rows.
- Every explorer gets a short story under its title in the left pane (who, how many, what X counts).
- Desmos walkthrough is exam practice, so the calculator starts empty. No button loads a solution. Each step is "Suppose we want... To do that... Observe...", with the menu path (Inference, Probability Distributions, Binomial, Cumulative Probability). Each step has a "Show expected result" toggle with computed values, and a video link. A "Clear calculator" button resets it. Show the full Desmos toolbar (+ and settings). The API key is in the page.
- MCQ: 3 to 5 per video, instant feedback, red cross on a wrong pick, green check on the correct option, explanation with a video link to the moment that teaches it.
- FRQ: prompt, plain-text response box with a Symbols bar (18 symbols, 2 rows of 9, equal columns), sample response, scoring checklist.
- The response box is a plain-text box with a symbols menu, modeled on Bluebook. It is not a LaTeX editor. Check the College Board "AP Statistics Digital Response Guidelines" for accepted typing conventions and match them.

**Visual system**
- Modernist design system (`_ds/modernist-.../styles.css`): Archivo, red accent `#ec3013`, no rounded corners, 2px rules, flush-left labels (centered only in explorer controls).
- Page frame: centered column, max width 1280px, grey ground outside it.
- Inline styles only. One DC file unless an element repeats 4 or more times with real props.

## Open items
- Build 1.13 and 3.6-3.7 pages; extract their key moments from the transcripts.
- Obtain the College Board digital response guidelines PDF and align the symbols and typing shortcuts.
- Verify every 2.10 timestamp against the video.
- Confirm Desmos menu names and whether the "between" option includes endpoints.
- Decide how to template the 58 pages: a data file per video (JSON) feeding one lesson template.
- Confirm the Desmos API key can be public.
- Load the Modernist component bundle (a lint warning says it is not loaded).

## Working rules
- Keep user-provided text verbatim; do not rewrite it.
- Small requests change only what was asked.
- Do not add sections, stats or content the user did not ask for. Ask first.
- Keep transcript quotes short; write explanations in original words.
