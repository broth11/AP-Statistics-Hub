# Menu-guided Desmos walkthroughs, 18 November 2026

Reworked all ten calculator walkthroughs created during today's lesson additions: video 7 (1.7), 44–50 (4.1–4.10, including paired inference), 52 (5.2), and 55 (5.5).

Probability tasks now use Add Item → inference → Probability Distribution, then Cumulative Probability with Area/Bounds and the appropriate region. Mean-inference tasks use inference → t-test → Stats, Create Test, and the Confidence Interval or Significance Test controls. Two-sample tasks add SAMPLE 2 rather than requiring students to enter precomputed Welch degrees of freedom. Paired tests enter the summary of differences as one sample. Summary statistics use the table and funcs/STATISTICS menus; regression tasks use the table's Add Regression button and its Linear Regression, EQUATION, and STATISTICS outputs.

Existing plus and inference icons and labeled button chips appear in the numbered actions. Each input has its own action row. The calculator starts empty, expected results remain hidden until requested, and video links are retained. The worked questions and other lesson sections are unchanged.

Verified the actual embedded calculator controls: t-test Data/Stats and SAMPLE 2 fields; Confidence Interval with a 90% one-mean interval; Significance Test null and Left/Both/Right choices; t-distribution degrees of freedom, shift and scale; Cumulative Probability Area/Bounds and region controls; normal right-tail probability and a right-tail percentile; table Add Regression with its fitted equation, r and R-squared outputs; and funcs/STATISTICS including stats. The five-value stats output gives quartiles 2.5 and 5.5. The normal example accepts the exact stdev 8/3. The difference example instructs use of the square-root keypad key for the full variance sum.

All ten revised JSON files pass the repository validator. All ten rendered walkthroughs were checked at desktop and 390px phone width: icons present, no raw math or KaTeX errors, and no horizontal page overflow. The existing calculator-opening controls work. There are no renderer or styling changes in this revision.

The review branches are stacked: lessons/menu-guided-desmos followed by lessons/menu-guided-desmos-two-sample, based on ui/home-unit-buttons. Merging publishes through the existing Pages workflow.
