# CED Units 4–5 completion, 18 November 2026

Added all twelve missing indexed videos: seven mean-inference pages (4.1 through 4.10, including separate one-mean and paired-test videos) and five regression pages (5.1–5.5). Together with the earlier additions, all 50 indexed CED Unit 1–5 videos now have study pages. Eight Reviews/FRQ strategy videos remain listed without pages.

Each new page has key moments, a decision check, worked questions, four original MCQs with explanations for every option, four wording traps, and a three-part FRQ with a model response and five scoring criteria. Nine calculator walkthroughs accompany topics that call for them. No new explorers were built, and existing explorers were preserved.

Sources: the private video-caption submodule and Ben's local Fall 2026 CED topic PDFs. Units 4–5 do not yet have the reviewed question-archetype coverage of Units 1–3, so practice is aligned directly to the CED. No AP Classroom questions or private transcript files were added to the published site. Worked video examples use narrated values; supplementary examples and additional assumptions are explicitly identified.

Accuracy notes: the paired-test video switches between seconds and milliseconds and gives an inconsistent t statistic. Using its narrated summary values gives t=2.662399 and one-sided p=0.012972. The page uses milliseconds consistently and flags the discrepancy. The small paired-sample shape condition is assumed explicitly because the narration does not provide a usable plot. Before/after data alone do not isolate a coffee effect from practice or time effects. Independent two-sample calculations use Welch degrees of freedom rather than a pooled shortcut. The salary model uses dollar-scale coefficients and predictions consistently despite the narration's mention of a thousands-of-dollars axis.

The shared lesson-text style disables font ligatures, preventing Manrope from rendering the literal question label (c) as a copyright glyph. A standalone fix branch is based directly on main so it can be reviewed independently of lesson additions.

Validation: every one of the 50 lesson JSON files passes the repository validator. All twelve new pages pass desktop and mobile page checks. Correct/wrong MCQ feedback, FRQ symbol insertion, sample reveals, and scoring controls were exercised on all twelve additions. Nine calculator walkthroughs parse successfully in the embedded Desmos calculator; normal/t probabilities, interval endpoints, and correlation outputs agree with the recomputed targets. Independent numerical integration verifies representative t-tail probabilities, and an independent regression implementation agrees on coefficients and correlation. The typography fix was reproduced and inspected visually before and after the change.

Review limits: timestamps are anchored to caption excerpts rather than independently checked video frames. The CED profiles and raw source material were not updated. New pages are marked live on review branches; merging publishes through the existing Pages workflow.

Merge lesson branches in order after the earlier Unit 1 branches: lessons/ced-4-1-to-4-5, lessons/ced-4-6-to-5-1, lessons/ced-5-2-to-5-5. The standalone fix/literal-question-labels branch can be merged independently; the same styling fix is included with the lesson additions.

## Shared-style regression check

All 50 pages were loaded with the label fix. The twelve additions passed. Four older lessons (videos 36, 39, 40, and 58) report worked questions taller than the preferred 791px limit. Baseline checks without the font fix reproduce exactly the same heights, so these are pre-existing layout warnings. Existing lessons were not rewritten.
