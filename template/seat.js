const busSummary = document.getElementById('busSummary');
const seatGrid = document.getElementById('seatGrid');
const totalPriceEl = document.getElementById('totalPrice');
const payBtn = document.getElementById('payBtn');

const booking = JSON.parse(localStorage.getItem('selectedBus') || 'null');
if (!booking) {
  window.location.href = 'search.html';
}

const pricePerSeat = parseInt(booking.price.replace(/[^0-9]/g, ''), 10);
const selectedSeats = new Set();

function renderBusSummary() {
  busSummary.innerHTML = `
    <div class="bus-summary-card">
      <div>
        <strong>${booking.name}</strong>
        <p>${booking.departure} → ${booking.arrival}</p>
      </div>
      <div class="bus-price">${booking.price}</div>
    </div>
    <div class="bus-meta">
      <span>${booking.time}</span>
      <span>${booking.travelDate}</span>
    </div>
  `;
}

function createSeat(number) {
  const seat = document.createElement('button');
  seat.type = 'button';
  seat.className = 'seat';
  seat.textContent = number;
  if (number % 5 === 0) {
    seat.disabled = true;
    seat.classList.add('seat-booked');
    seat.textContent = `${number}`;
    return seat;
  }

  seat.addEventListener('click', () => {
    if (selectedSeats.has(number)) {
      selectedSeats.delete(number);
      seat.classList.remove('selected');
    } else {
      selectedSeats.add(number);
      seat.classList.add('selected');
    }
    updateTotal();
  });

  return seat;
}

function renderSeats() {
  for (let i = 1; i <= 30; i += 1) {
    seatGrid.appendChild(createSeat(i));
  }
}

function updateTotal() {
  const count = selectedSeats.size;
  const amount = count * pricePerSeat;
  totalPriceEl.textContent = `₹${amount}`;
  payBtn.disabled = count === 0;
}

payBtn.addEventListener('click', () => {
  if (selectedSeats.size === 0) return;
  const bookingInfo = {
    ...booking,
    seats: Array.from(selectedSeats),
    amount: `₹${selectedSeats.size * pricePerSeat}`
  };
  localStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));
  window.location.href = 'payment.html';
});

renderBusSummary();
renderSeats();
updateTotal();
