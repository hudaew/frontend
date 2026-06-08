const PAGE_SIZE = 20;
const grid      = document.getElementById('grid');
const sentinel  = document.getElementById('sentinel');
const status    = document.getElementById('status');
const searchEl  = document.getElementById('search');
const noResults = document.getElementById('no-results');
const badge     = document.getElementById('count-badge');

let allUsers   = [];
let page       = 0;
let loading    = false;
let exhausted  = false;
let query      = '';

// ── Fetch a page of users ──
async function fetchUsers() {
  if (loading || exhausted) return;
  loading = true;
  status.textContent = 'Loading…';
  showSkeletons(PAGE_SIZE);

  try {
    const res  = await fetch(
      `https://randomuser.me/api/?results=${PAGE_SIZE}&page=${++page}&seed=huda`
    );
    const data = await res.json();
    const users = data.results;

    removeSkeletons();

    if (!users.length) {
      exhausted = true;
      status.textContent = 'All users loaded.';
      observer.unobserve(sentinel);
      return;
    }

    allUsers = [...allUsers, ...users];
    renderUsers(users, page);
    badge.textContent = `${allUsers.length} users`;

    if (allUsers.length >= 200) {
      exhausted = true;
      observer.unobserve(sentinel);
      status.textContent = 'All 200 users loaded.';
    } else {
      status.textContent = `Showing ${allUsers.length} users`;
    }

  } catch (err) {
    removeSkeletons();
    status.textContent = 'Failed to load. Check connection.';
    console.error(err);
  } finally {
    loading = false;
  }
}

// ── Render user cards ──
function renderUsers(users, pageNum) {
  const frag = document.createDocumentFragment();
  users.forEach((u, i) => {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.style.animationDelay = `${i * 30}ms`;
    card.dataset.name    = `${u.name.first} ${u.name.last}`.toLowerCase();
    card.dataset.country = u.location.country.toLowerCase();
    card.innerHTML = `
      <img src="${u.picture.medium}" alt="${u.name.first}" loading="lazy"/>
      <div class="user-name">${u.name.first} ${u.name.last}</div>
      <div class="user-email">${u.email}</div>
      <span class="user-country">${u.location.country}</span>
    `;
    frag.appendChild(card);
  });
  grid.appendChild(frag);
  filterCards(query);
}

// ── Skeleton loaders ──
function showSkeletons(n) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement('div');
    s.className = 'skeleton-card skel-placeholder';
    s.innerHTML = `
      <div class="skel skel-avatar"></div>
      <div class="skel skel-line" style="width:70%"></div>
      <div class="skel skel-line" style="width:90%"></div>
      <div class="skel skel-line" style="width:40%"></div>
    `;
    grid.appendChild(s);
  }
}

function removeSkeletons() {
  grid.querySelectorAll('.skel-placeholder').forEach(el => el.remove());
}

// ── Filter / search ──
function filterCards(q) {
  query = q.toLowerCase();
  const cards = grid.querySelectorAll('.user-card');
  let visible = 0;
  cards.forEach(card => {
    const match = card.dataset.name.includes(query) ||
                  card.dataset.country.includes(query);
    card.style.display = match ? '' : 'none';
    if (match) visible++;
  });
  noResults.style.display = (visible === 0 && !loading) ? 'block' : 'none';
}

// ── Debounce helper ──
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

searchEl.addEventListener('input', debounce(e => filterCards(e.target.value), 300));

// ── IntersectionObserver ──
const observer = new IntersectionObserver(
  ([entry]) => { if (entry.isIntersecting) fetchUsers(); },
  { rootMargin: '300px' }
);
observer.observe(sentinel);

// ── Initial load ──
fetchUsers();
