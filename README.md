# frontend
01 — Animated Kanban Board 
Drag & Drop API, live column counters, drop zone highlight, card add/delete, CSS drop animation.

02 — Custom Range Slider + Live Canvas Chart 
Two overlapping range thumbs that fill a track between them, driving a canvas bar chart with a grow-on-load animation and hover tooltips — no chart libraries.

03 — CSS-Only Accordion + Dark Mode Toggle 
The accordion open/close uses zero JavaScript — just hidden radio inputs and the :checked ~ sibling CSS trick with grid-template-rows: 0fr → 1fr for smooth height animation. The theme toggle reads localStorage then falls back to prefers-color-scheme.

04 — Infinite Scroll + Search Filter 
IntersectionObserver on a sentinel div triggers paginated fetches from randomuser.me, skeleton shimmer loaders while fetching, debounced search filtering, and staggered fade-in animations on cards.
