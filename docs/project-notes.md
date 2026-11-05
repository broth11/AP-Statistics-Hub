# AP Statistics Learning Hub (project notes)

Moved to Claude on 2026-11-05 from a previous project. The old copy is read-only. This file captures where the work stood so it can continue here.

## What it is

A single-page study site for AP Statistics students: a video study guide organized by unit and lesson, with exam-prep tools built in. The working file is `AP Stats Study Site.dc.html`, styled with the "Modernist" design system. Students use the Casio fx-CG50 in class, but the Desmos section targets exam-style calculator skills.

## Site structure

- Site title: "AP Statistics / Video Study Guide" (18px).
- Top menu: Unit 1 to Unit 5, plus Reviews. There is no "All units" tab.
- Each lesson links back to the moment in the video that explains it.
- Sections include common exam-wording traps, a multiple choice check, an Explorer, and a Desmos exam-prep module.

## Decisions made so far

### Landing page
- Must fit on one screen with no page scroll. The only scrolling allowed is inside the unit listing box after a unit is selected.
- Title and a short description sit on the left. The right pane shows "Choose a unit, then a lesson" (same 18px font as the site title) until a unit is picked, then shows that unit's lesson list.
- Clicking the site title returns to the unselected state.
- Description and pilot-note text were shortened to fit. Full-length text can be restored on request.

### Desmos section
- Purpose is exam prep: students must learn to do it themselves. Do not hand them a button that loads a finished sketch (the Explorer already covers that).
- The calculator starts empty, does not sync with the Explorer, and has a "Clear calculator" button.
- It shows the top bar with the + button and the settings gear.
- Height fills the screen below the sticky bars, with a minimum height, so the whole section is visible without scrolling. The steps pane matches that height. The module should be more rectangular than square.
- Seven steps, each phrased "Suppose we want... To do that... Observe...", with the exact menu path:
  1. Read one probability.
  2. At most.
  3. At least.
  4. At least one.
  5. Between two values.
  6. Mean and standard deviation.
  7. Report the result: write the event and context, not a bare decimal.
- Each step has a "Show expected result" link (reveal on click) and a video-moment link. Expected values use n = 20, p = 0.13: P(X=6) ≈ 0.0266, μ = 2.6, σ ≈ 1.504, with the others computed on the page. The "between" step includes both endpoints.
- "Mark done" toggles and the "Load this step" buttons were removed.
- **To verify:** menu names came from the video and memory. Check them against the real Desmos calculator, especially the Cumulative Probability options and whether "between" includes the endpoints. The endpoint question is posed to students as something to observe.

### Common traps (exam wording)
- Wrong statements use style A: quoted italic text with a "✕ Weak" label, over a "✓ Better" version. The strikethrough, red/green box, and side-stripe options were tried and dropped.
- The video link sits in its own right-aligned row under each trap to save vertical space.

### Multiple choice
- A wrong guess shows a red ✕. The correct answer shows a green ✓.

## Current task (in progress)

- The Explorer must be fully visible with no scrolling, same as the Desmos section. Sizing needs to flex to the viewport to make that work.
- For all explorers, rethink the arrangement of sliders and buttons. Default layout rule: align objects in columns, centered, with equal widths, stretched across the width.

## Open items

- Confirm the latest Explorer and Desmos edits visually. Several recent changes were only checked by an automatic check, not by eye.
- Verify the Desmos menu names and endpoint behavior as noted above.
- Apply the slider and button layout rule across every explorer, not just the AP Stats one.
