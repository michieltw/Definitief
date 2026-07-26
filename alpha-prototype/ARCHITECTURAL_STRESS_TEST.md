# 🧪 Architectural Stress Test: Alpha Prototype

## 1. Schema Ambiguities
* **Collection queries vs Document Keys:** The original document specifies `$O(1)$` reads using keys like `stand:[SEIZOEN]:[DIVISIE_ID]`. While this is extremely fast for targeted documents, things like the "Social Feed" or "Marketplace" imply a stream of individual documents that need to be queried and sorted (e.g., `ORDER BY timestamp DESC`). The `O(1)` concatenated ID approach doesn't work well for feeds unless the *entire* feed is stored as an append-only array inside a single document (like `match:events`), which could hit the 1MB Firestore document limit for heavily active feeds.
* **Roster structure:** The schema specifies `match:[WEDSTRIJD_ID]:roster` as `{ "rosterThuis": ["PLR_001"], "rosterUit": ["PLR_010"] }`. But displaying the roster requires player details (name, number, position). If we only have IDs, we need to join this with `player:PLR_...` documents. This breaks the $O(1)$ read rule for the screen unless the roster document *also* caches the player names and numbers.
* **Events Append-Only:** The `match:[WEDSTRIJD_ID]:events` document is an array of actions. If an event is deleted (e.g. correcting a mistake), we have to rewrite the entire array.

## 2. UX & State Bottlenecks
* **Live Scorekeeper Clock:** Managing a live ticking clock synchronized across devices (scorekeeper and spectators) purely via Firestore updates is expensive and prone to latency. The prototype currently just uses a static string (`20:00`), but a real app needs a local tick that syncs periodically, rather than writing every second to Firestore.
* **RSVP State:** The UI needs to know the logged-in user to highlight their specific RSVP status. Passing this identity deeply or determining it securely while keeping the UI snappy requires careful context management.

## 3. Data & Props Gaps
* **Standings Table:** The document specifies `stand:SZN:DIV` containing `{ teams: [ { teamId, punten... } ] }`. However, the table also needs the Team Name and Team Logo. If these are not pre-calculated and stored inside the `stand` document array, we must perform an $N$ read query to fetch the team details for every row in the standings, violating the $O(1)$ rule. *Assumption made:* The batch aggregator caches the `name` inside the standings array.
* **Team Stats:** Similar to above, `team:SZN:TEAM_ID:stats` contains wins/losses, but the UI needs the Team Name at the top of the roster page. I had to assume the name is cached there.

## 4. Hacks & Shortcuts Used
* **Mock Firestore Hook:** Implemented a custom `useFirestoreDocument` hook that leverages an in-memory `Map`. This simulates network latency and perfectly replicates the "Data Missing Indicator" behavior expected when a document isn't found.
* **Manual Seeding:** Added `[Dev] Seed Data` buttons to the UI to inject data into the in-memory mock database, bypassing the need for a real Firebase backend or cloud functions for this frontend prototype.
* **Missing Marketplace:** Skipped the marketplace component to focus entirely on the core flows (Standings, Roster, Scorekeeper, RSVP, Social).
