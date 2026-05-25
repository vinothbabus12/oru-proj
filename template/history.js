document.addEventListener('DOMContentLoaded', ()=>{
  const widget = document.createElement('div');
  widget.className = 'history-widget';
  widget.innerHTML = `
    <button class="history-btn" aria-label="Bookings">
      <span class="icon">🧾</span>
      <span class="count">0</span>
    </button>
    <div class="history-dropdown" aria-hidden="true"></div>
  `;
  document.body.appendChild(widget);

  const btn = widget.querySelector('.history-btn');
  const dropdown = widget.querySelector('.history-dropdown');

  function render() {
    const userId = localStorage.getItem('userId') || 'guest';
    const list = JSON.parse(localStorage.getItem('bookings_' + userId) || '[]');
    widget.querySelector('.count').textContent = list.length;
    if (!list.length) {
      dropdown.innerHTML = '<div class="hd-empty">No bookings</div>';
      return;
    }
    dropdown.innerHTML = list.slice().reverse().slice(0,5).map(b=>{
      const info = JSON.stringify(b).replace(/'/g, "\\'");
      return `
        <div class="hd-item">
          <div class="hd-left"><strong>${b.name}</strong><div class="small">${b.departure} → ${b.arrival}</div></div>
          <div class="hd-right"><div>${b.amount}</div><a class="link" href="confirm.html" onclick="localStorage.setItem('bookingInfo','${info}')">View</a></div>
        </div>`;
    }).join('');
  }

  btn.addEventListener('click', ()=>{
    const open = dropdown.getAttribute('aria-hidden') === 'false';
    dropdown.setAttribute('aria-hidden', open ? 'true' : 'false');
  });

  // close when clicking outside
  document.addEventListener('click', (e)=>{
    if (!widget.contains(e.target)) dropdown.setAttribute('aria-hidden','true');
  });

  render();
  // re-render when storage changes
  window.addEventListener('storage', render);
});
