# PREIshare dashboard — responsive QA checklist

**Tester:** Alexis Terry
**Date:** 2026-10-04
**App URL tested:** http://localhost:3000/dashboard
**Build / branch:** local `main`, dev server (`npm run dev`)

## Breakpoints used

| Name    | Width  | How to set                          |
|---------|--------|-------------------------------------|
| Mobile  | 375px  | Devtools device toolbar             |
| Tablet  | 768px  | Devtools device toolbar             |
| Desktop | 1280px | Devtools device toolbar             |

## How to use this sheet

1. Load the dashboard route with the dev server running.
2. For each row, set the width, perform the check, mark **Pass** or **Fail**.
3. On Fail, write a short **Symptom** and which **file** you will ask the agent to touch.
4. After a targeted fix, re-test and update **Status** and **Fix notes**.
5. Critical rows must Pass (or be listed under Known limitations with stakeholder-safe wording).

---

## Mobile (~375px)

| ID | Check | Status (Pass/Fail) | Symptom / notes | Fix notes (prompt + files) |
|----|--------|--------------------|-----------------|----------------------------|
| M1 | No horizontal page scroll | Pass | Document scroll width equals the 375px viewport. |  |
| M2 | Header remains visible and usable | Pass | PREIshare mark, Overview label, and account initials stay inside the bar. |  |
| M3 | Desktop sidebar is hidden or off-canvas (not permanently covering content) | Pass | Sidebar `display` is `none`. It does not take width. |  |
| M4 | MobileNav or menu control is visible | Pass | “Open menu” button is visible and 44px tall. |  |
| M5 | Menu opens and closes navigation links | Pass | Button switches to “Close menu”. Overview, Portfolio, and Activity appear. Choosing a link closes the menu. |  |
| M6 | Main content readable without pinched text | Pass | Intro, metrics, and empty-state sentences wrap inside the main column. |  |
| M7 | Metric cards stack in a single column (or intentional narrow grid) | Pass | The three cards sit on separate rows. |  |
| M8 | PortfolioSummary does not overflow or clip | Pass | The summary box is narrower than the viewport. Empty-state sentence is fully visible. |  |
| M9 | RecentActivity list wraps; no cut-off timestamps/labels | Pass | Empty-state sentence is fully visible. No clipped label. |  |
| M10 | Empty-state messaging (if shown) is fully visible | Pass | Both empty-state paragraphs are on screen and readable. |  |

## Tablet (~768px)

| ID | Check | Status (Pass/Fail) | Symptom / notes | Fix notes (prompt + files) |
|----|--------|--------------------|-----------------|----------------------------|
| T1 | No horizontal page scroll | Pass | Scroll width matches the viewport. |  |
| T2 | Navigation pattern matches plan (sidebar, rail, or menu—not both fighting) | Pass | Sidebar is visible (240px). The mobile menu wrapper is `display: none`. |  |
| T3 | Header + content spacing not cramped | Pass | Header fits the width. Main content starts beside the sidebar with padding. |  |
| T4 | Metric cards use a sensible 2-column (or planned) layout | Pass | Two cards share the first row. The third wraps to the next row. |  |
| T5 | PortfolioSummary and RecentActivity share space without overlap | Pass | They stack, one under the other, and do not overlap. Side-by-side starts at the desktop width. |  |
| T6 | Touch targets / click targets large enough to use | Pass | Sidebar links are 44px tall. |  |

## Desktop (~1280px)

| ID | Check | Status (Pass/Fail) | Symptom / notes | Fix notes (prompt + files) |
|----|--------|--------------------|-----------------|----------------------------|
| D1 | Sidebar visible and usable per architecture | Pass | Sidebar is visible. Overview, Portfolio, and Activity are links. |  |
| D2 | MobileNav hidden or not duplicating full sidebar awkwardly | Pass | Mobile menu wrapper is `display: none`. |  |
| D3 | Main region has comfortable padding/margins | Pass | Main region is padded. Cards sit inset from the sidebar. |  |
| D4 | Metric cards align in a multi-column row as planned | Pass | All three cards share one row. |  |
| D5 | PortfolioSummary + RecentActivity sit in intended regions | Pass | Summary is on the left and activity is on the right, on the same row. |  |
| D6 | Long labels/numbers do not break the header or sidebar width | Pass | Header text “PREIshare / Overview / Investor” fits. Header scroll width equals its box. |  |

## Cross-cutting issues

| ID | Check | Status | Notes |
|----|--------|--------|-------|
| X1 | Focus order / keyboard: menu and links reachable | Pass | Menu control is a `<button>`. Destinations are `<a>` links in Overview, Portfolio, Activity order. |
| X2 | No layout jump when opening/closing mobile menu | Pass | First check failed: opening the menu pushed the main column down by about 174px. After the overlay fix, the main column stays at the same top when the menu opens and closes. |
| X3 | Stacking order: important metrics appear before low-priority lists on small screens | Pass | At 375px the order is intro, three metric cards, portfolio summary, then recent activity. |

## Targeted fix log (one row per prompt cycle)

| Cycle | Breakpoint | File(s) touched | Prompt summary (one sentence) | Result after re-test |
|-------|------------|-----------------|-------------------------------|----------------------|
| 1 | 375px | `src/components/dashboard/MobileNav.tsx` | Keep the same links and toggle; position the open menu as an overlay so the main column does not jump. | Pass at 375px. Rechecked at 1280px: sidebar still visible, mobile menu still hidden, three cards in one row, summary and activity side by side. |
| 2 |  |  |  |  |
| 3 |  |  |  |  |

## Known limitations (optional)

List anything still imperfect that you are **not** fixing in this sprint, with a reason (e.g. “Chart library deferred to next topic”).

- The dashboard header title stays “Overview” on Portfolio and Activity because the layout route passes one title. Page content still changes. A per-route title is later polish, not a width bug.
- Deals and Profile routes still exist from an earlier sprint and are not in this nav. This pass did not add them.

## Sign-off

- [x] Critical mobile checks M1–M7 pass
- [x] Critical tablet checks T1–T5 pass
- [x] Critical desktop checks D1–D5 pass
- [x] Fix log filled for every change made during QA
- [x] Touched components still match the architecture (no accidental full rewrite)

**Ready for stakeholder handoff draft:** Yes
