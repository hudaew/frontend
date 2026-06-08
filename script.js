let draggedCard = null;
let cardIdCounter = 0;

const SEED_DATA = {
  todo:       ['Design wireframes', 'Write unit tests', 'Update README'],
  inprogress: ['Build login page', 'Fix navbar bug'],
  done:       ['Setup project repo']
};

// ── Seed initial cards ──
Object.entries(SEED_DATA).forEach(([col, tasks]) => {
  tasks.forEach(text => createCard(col, text));
});

function createCard(colId, text) {
  const id = `card-${++cardIdCounter}`;
  const card = document.createElement('div');
  card.className = 'card';
  card.id = id;
  card.draggable = true;
  card.innerHTML = `
    <span class="card-text">${text}</span>
    <button class="card-delete" onclick="deleteCard('${id}')" title="Delete">×</button>
  `;

  card.addEventListener('dragstart', e => {
    draggedCard = card;
    e.dataTransfer.setData('id', id);
    setTimeout(() => card.classList.add('dragging'), 0);
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
    draggedCard = null;
  });

  document.getElementById(`cards-${colId}`).appendChild(card);
  updateCounts();
}

function addCard(colId) {
  const input = document.getElementById(`input-${colId}`);
  const text = input.value.trim();
  if (!text) return;
  createCard(colId, text);
  input.value = '';
}

function deleteCard(id) {
  document.getElementById(id)?.remove();
  updateCounts();
}

function updateCounts() {
  ['todo', 'inprogress', 'done'].forEach(col => {
    const count = document.getElementById(`cards-${col}`).children.length;
    document.getElementById(`count-${col}`).textContent = count;
  });
}

// ── Drop zones ──
document.querySelectorAll('.column').forEach(col => {
  col.addEventListener('dragover', e => {
    e.preventDefault();
    col.classList.add('drag-over');
  });

  col.addEventListener('dragleave', e => {
    if (!col.contains(e.relatedTarget)) col.classList.remove('drag-over');
  });

  col.addEventListener('drop', e => {
    e.preventDefault();
    col.classList.remove('drag-over');
    const id = e.dataTransfer.getData('id');
    const card = document.getElementById(id);
    if (card) {
      col.querySelector('.cards').appendChild(card);
      updateCounts();
    }
  });
});

// ── Enter key to add card ──
document.querySelectorAll('.add-card input').forEach(input => {
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const colId = input.id.replace('input-', '');
      addCard(colId);
    }
  });
});

updateCounts();
