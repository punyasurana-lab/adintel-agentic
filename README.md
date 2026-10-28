# Lumen: agentic marketing platform (front-end prototype)

A front-end-only prototype of an agentic layer for marketing, built to sit on top of AdIntel. AdIntel stays the execution engine (drafts, pre-flight, publish, sync). Lumen adds research, planning, creative, scheduling and a prompt layer. There is no backend: everything runs in the browser.

## Run it

```bash
python3 -m http.server 8765 --bind 127.0.0.1
# open http://127.0.0.1:8765/index.html
```

`index.html` also opens directly from disk. Use **Demo controls > Start tour** for a guided walk through the whole product.

## What it shows

- **Onboarding:** individual or agency, real form controls (budgets, cities, competitors, clients), connection flow, then a live analysis that streams the real crawl.
- **Workspace shell:** workspace switcher, all clients in the sidebar with approval counts, Ctrl+K search, a "Needs you" inbox across clients.
- **Agentic and manual layers together:**
  - Ask Lumen bar (top): plain-language instructions ("shorten the headlines", "use the proof stat template", "set budget to 80k", "start on 5 nov"). Lumen shows the exact change and applies it only on approval.
  - Every instruction maps to the same state change a manual control makes. A change log records who made each one, You or Lumen.
- **Workplan:** timeline of what agents do next, each step marked automatic or a human decision. Dates recalculate when the start date changes.
- **Autopilot:** proposals built from real findings. Campaigns needing tracking stay blocked until the setup task is done. Approvals respect spend caps.
- **Plan, Creative, Launch, Monitor:** evidence-based plans with live budget maths, creative built from templates with a claim checker, launch through AdIntel to Meta review.
- **GEO audit:** score from six measured dimensions, radar profile, citation-gap matrix, ranked fixes.
- **Templates:** editable creative templates and campaign playbooks that change the output.
- **Analytics, Profitability, Reports:** analytics computed from the crawl and search data; an editable profitability model; CSV exports.

## Real data

The demo brand is **srvmedia.com**. Captured 26 Oct 2026:

| File | Contents |
|---|---|
| `crawl-data.js` | 36 live pages: status, size, time, title, meta, H1, words, images, schema |
| `data.js` | SRV Media identity, tech stack, social profile counts, 7 web searches, competitor profiles with sources, two client homepages |
| `assets/srv-logo.svg` | Real logo |

Nothing in these files is generated. Where a value could not be read (login walls, API keys, Meta Ad Library API access), the product shows a connect state instead.

## Limits

- No backend. Analysis replays a captured crawl; adding a client needs a server job.
- Search visibility uses web search results, not Google's live ranking. AI-engine answers need API keys.
- Lighthouse was not available (API quota). Fetch times are from the capture.
- No ad delivery data exists, so no results are shown. Launch ends at "In review".
- Profitability uses placeholder assumptions the user edits. It is a model, not a result.
- The Ask Lumen bar is a rule-based parser, not a language model.

## Files

| File | Role |
|---|---|
| `index.html`, `app.css` | Page and styles |
| `app.js` | State, helpers, nav, onboarding, analysis engine |
| `views.js` | Overview, Autopilot, Brand, Audit, Visibility, Competitors, Social, Plan, Creative, Launch, Monitor, Reports, Connections, tour |
| `views2.js` | Portfolio, Campaigns, Creative library, Templates, Analytics, Profitability |
| `views3.js` | Workplan, GEO audit, prompt layer, change log |

## Next

- Server side: crawl, search research and AI-engine sampling as jobs; Meta Ad Library access.
- Replace the rule-based prompt parser with a model behind the same preview-and-apply flow.
- Connect real delivery data from AdIntel so Monitor, Reports and Profitability show measured results.
