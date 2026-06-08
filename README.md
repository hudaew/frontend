# frontend
01 — Kanban Board → index.html + style.css + script.js
Drag & drop cards between 3 columns, live count badges, add/delete cards, drop zone highlight animation.

02 — Range Slider + Canvas Chart → index.html + style.css + script.js
Two overlapping range thumbs with a filled track between them, driving a Canvas bar chart. Bars outside range go dim, hover shows tooltip, bars grow in on load via requestAnimationFrame.

03 — CSS Accordion + Dark Mode → index.html + style.css + script.js
Accordion open/close is 100% CSS using hidden radio inputs + :checked ~ sibling selector and the grid-template-rows: 0fr → 1fr height animation trick. script.js only handles the theme toggle + localStorage.

04 — Infinite Scroll + Search → index.html + style.css + script.js
Fetches real users from randomuser.me in pages of 20, IntersectionObserver on a sentinel div loads next page, shimmer skeleton cards while fetching, debounced search filters by name or country.
