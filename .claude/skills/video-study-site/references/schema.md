# Lesson file schema (`docs/data/lessons/<n>.json`)

`validate.py` enforces this. Working examples: `23.json` (binomial), `13.json` (experimental design), `36.json` (one-proportion test).

Any string may contain `$...$` math. Times (`t`, `seek`) are whole seconds into the video.

## Top level

```json
{
  "n": 13,                       // playlist position; must match docs/data/lessons.json
  "unit": 1,                     // unit id from site.json; must match lessons.json
  "topic": "1.13",
  "title": "Experimental Design",
  "videoId": "2Yn1235uFzE",      // must match lessons.json
  "videoTitle": "AP Statistics Topic 1.13 Experimental Design",   // iframe title, for screen readers
  "intro": "After this lesson you can ...",
  "moments": [ ... ],
  "sections": [ ... ],           // rendered in this order
  "footer": "Status: draft from auto-generated captions, ...",    // optional
  "review": { "status": "approved", "flags": [ { "kind": "wording", "text": "..." } ] }
}
```

`review.status` is `approved` (normal; set in every PR) or `draft` (shows a banner, for a page the teacher wants held back). Flag `kind` is free text; use `wording`, `caption`, `calculator`, `values`, `timestamps`, `explorer`, `placement`. Flags are not shown on the page but are public in the JSON, so keep them factual and short.

## Moments

```json
{ "t": 1265, "type": "Procedure", "title": "How to describe random assignment", "text": "Number the subjects, ..." }
```

`type` is a short label: Concept, Definition, Key idea, Principle, Procedure, Formula, Worked example, Calculator, Exam wording, Exam question, Design, Visual, Reference, Overview. Moments must be in time order.

## Every section

```json
{ "id": "mcq", "type": "mcq", "tab": "Multiple choice", "kicker": "Check your understanding", "title": "Multiple choice",
  "notes": [ { "label": "Wording check.", "text": "..." } ] }
```

`id` is unique in the file and used for `#s-<id>`. `tab` is the label in the section bar. `notes` is optional on any section and renders as callouts at the end of the section. Use it for wording checks students should see.

## `decision`

```json
{ "type": "decision",
  "cards": [ { "letter": "B", "name": "Binary", "text": "Each trial is a success or a failure." } ],
  "columns": ["Scenario", "B", "I", "T", "S", "Binomial?"],
  "verdictColumn": 5,
  "rows": [ { "cells": ["McKenzie makes 78% ...", "Yes", "Yes", "Yes", "Yes", "Binomial"], "seek": 336 } ] }
```

Cards and rows are both optional, but one is required. A "Video" column is added automatically; leave it out of `columns`. `verdictColumn` is the zero-based index shown bold. Each row has exactly one cell per column.

## `procedure`

A procedure section is a set of **worked questions** (layout "compact split", chosen Nov 2026). The side column shows the section title and the questions as `Q1)`, `Q2)`, ... each with its objective. Clicking one shows it on the right: a header row `Q1) objective`, then the question text and the key formula side by side, then the numbered steps, then the answer in context, then the video buttons.

Each step is one row: the working on the left, and the step instruction (bold) with its note on the right, separated by a thin vertical rule. The working column is as wide as the widest working in that question, capped at 55% of the content width. Below about 560px the row stacks: instruction and note first, working underneath.

```json
{ "type": "procedure", "id": "method", "tab": "Method", "kicker": "Procedure",
  "title": "Calculate probabilities with dice and marbles",
  "intro": "Optional. One sentence above the questions.",
  "questions": [
    { "obj": "Find the probability that two dice sum to 7",
      "q": "Two fair six-sided dice are rolled. Find the probability that the sum is 7.",
      "formula": ["$P(E)=\\dfrac{\\text{outcomes in }E}{\\text{outcomes in the sample space}}$"],
      "steps": [
        { "t": "Decide what the equally likely outcomes are and how many there are.",
          "work": { "tex": ["$6\\times6=36$"],
                    "text": "36 is the total number of ordered pairs from the two dice (Die 1, Die 2)." } },
        { "t": "Divide, then answer in context.",
          "work": { "tex": ["$P(\\text{sum is }7)=\\dfrac{6}{36}$", "$\\approx0.167$"] } }
      ],
      "answer": "The probability that the two dice sum to 7 is about 0.167.",
      "seek": 658 } ],
  "buttons": [ { "label": "Watch the complement rule (6:46)", "seek": 406 } ] }
```

Required: `title`, `questions` (at least one). Each question needs `obj`, `q`, `steps` (at least one), and `answer`. Each step needs `t`; `work` is optional and holds `tex`, `text`, or both. A step with no `tex` (naming a test, defining a parameter, describing an assignment method) puts its text across the whole row.

- `obj` is plain text (no math): the objective as an imperative, starting with a verb, about 60 characters at most. It appears in the side list and the header row.
- `q` is the full question a student would be handed, with every number needed. Worked questions may reuse the video's scenarios.
- `formula` is optional: up to two lines in general form, shown above step 1 as "Key formula". Leave it out when no formula drives the working.
- `work.tex` is an array, one calculation per line, rendered as one aligned block split at the first `=`, `\\approx`, or `\\neq`. Write `$lhs = rhs$` and start continuation lines with `=` or `\\approx`. The math renders at 16px, one step above the 15px body.
- `work.text` is one or two complete sentences saying what the numbers mean.
- `seek` is optional and adds a "Watch this example" link to that question.
- `parts`, string `steps`, and `line` are the retired box layout. Do not write them.

Only `intro` is required.

## `explorer`

```json
{ "type": "explorer", "explorer": "binomial", "intro": "...", ...explorer-specific config }
```

`explorer` names `docs/js/explorers/<name>.js`. The remaining fields are that explorer's config; see `explorers.md`.

## `desmos` (calculator walkthrough)

```json
{ "type": "desmos", "intro": "The calculator starts empty. ...", "note": "optional; defaults to site.json calculator.examNote",
  "steps": [ { "title": "At most", "suppose": "we want $P(X\\le4)$.",
               "do": ["On the binomial item open [[Cumulative Probability]].", "Under REGION choose [[Left]].", "Enter 4 in the box."],
               "observe": "The dots for 0 through 4 ...", "expected": "$P(X\\le4)\\approx 0.8917$", "seek": 2162 } ] }
```

Each step renders as "Suppose ..." then a numbered list `1)`, `2)` with one action per row, then "Observe.", with a "Show expected result" toggle and a video link. Write `suppose` to continue the lead word (lowercase start). `how` (one sentence) still works but is the old form; use `do`.

In `do` text (and anywhere a string goes through `tex()`): `{plus}`, `{gear}`, `{undo}`, `{inference}` show the real Desmos icons (`docs/img/desmos/`, captured from the embedded calculator); `[[Label]]` shows a button label such as `[[Create Distribution]]`; `` `typed text` `` shows text to type. Use only labels that exist in the embedded calculator. Verified labels (Nov 2026): the + menu is expression, note, table, inference, folder, image; inference opens Probability Distribution (distributions: Normal, t, chi-squared, Uniform, Binomial, Poisson, Geometric; no Discrete), z-test, t-test, z-test for proportions, chi-squared tests; a distribution has Create Distribution, then Cumulative Probability with REGION (Inner, Outer, Left, Right) and, for Normal, COMPUTE (Area, Bounds); z-test for proportions has successes and sample size, Create Test, then Confidence Interval and Significance Test tabs (Tails: Left, Both, Right). The calculator is a fixed height (`--calc-h`).

## `wording`

```json
{ "type": "wording",
  "traps": [ { "kind": "Common trap", "title": "Reporting a bare decimal", "weak": "0.0266",
               "better": "$P(H=6)=0.0266$. The probability that ...", "seek": 2270 } ] }
```

`kind` is "Common trap" or "Exam wording". `weak` is shown in quotes, so do not add quote marks.

## `mcq`

```json
{ "type": "mcq",
  "questions": [ { "stem": "...", "opts": ["A", "B", "C", "D"], "ok": 1, "why": ["...", "...", "...", "..."], "seek": 236 } ] }
```

`ok` is the zero-based index of the correct option. `why` has one entry per option. On a wrong pick the page shows that option's `why` and then the correct one.

## `frq`

```json
{ "type": "frq", "prompt": "...", "parts": ["(a) ...", "(b) ..."], "sample": ["(a) ...", "(b) ..."],
  "checklist": ["(a) ...", "(b) ..."], "symbols": [["mu", "μ"]], "note": "..." }
```

`symbols` and `note` are optional and default to `site.json` `frqSymbols` and `frqNote`.

## `docs/data/lessons.json` entries

```json
{ "n": 13, "unit": 1, "topic": "1.13", "title": "Experimental Design", "videoId": "2Yn1235uFzE",
  "transcript": "13-2Yn1235uFzE.txt", "status": "live" }
```

`status`: `transcript` (listed only), `next` (planned), `draft` (page exists, held back, not linked), `live` (linked from the home page). A PR sets its lessons to `live`, so they publish when it is merged.
