document.addEventListener("DOMContentLoaded", async () => {
  const userName = localStorage.getItem("userName") || "invité";
  const thanksEl = document.getElementById("thanks");
  if (thanksEl) thanksEl.textContent = `Merci pour ta commande ${userName}`;

  const container = document.getElementById("suivi-card");
  if (!container) return;

  function loadOrders() {
    try {
      return JSON.parse(localStorage.getItem('currentOrders') || '[]');
    } catch (e) {
      console.warn('currentOrders parse failed', e);
      return [];
    }
  }

  function saveOrders(arr) {
    try { localStorage.setItem('currentOrders', JSON.stringify(arr)); } catch (e) { console.warn('saveOrders failed', e); }
  }

  // Render the list of orders
  function renderOrders() {
    const orders = loadOrders();
    if (!orders || orders.length === 0) {
      container.innerHTML = '<p>Aucune commande en cours.</p>';
      return;
    }

    container.innerHTML = '';
    orders.forEach(order => {
      const card = document.createElement('div');
      card.className = 'order-card';
      card.dataset.orderId = order.orderId;

      const title = document.createElement('h4');
      title.textContent = order.name;
      card.appendChild(title);

      if (order.image) {
        const imgP = document.createElement('p');
        imgP.textContent = order.image;
        card.appendChild(imgP);
      }

      const meta = document.createElement('p');
      meta.className = 'meta';
      meta.textContent = `Commandé le ${new Date(order.createdAt).toLocaleString()}`;
      card.appendChild(meta);

      const btn = document.createElement('button');
      btn.textContent = 'Supprimer';
      btn.addEventListener('click', () => {
        removeOrder(order.orderId);
      });
      card.appendChild(btn);

      container.appendChild(card);
    });
  }

  function removeOrder(orderId) {
    const orders = loadOrders();
    const filtered = orders.filter(o => o.orderId !== orderId);
    saveOrders(filtered);
    renderOrders();
  }

  renderOrders();
});
