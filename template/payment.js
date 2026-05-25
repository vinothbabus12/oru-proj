const paymentSummary = document.getElementById('paymentSummary');
const paymentForm = document.getElementById('paymentForm');
const payTotalEl = document.getElementById('payTotal');

const bookingInfo = JSON.parse(localStorage.getItem('bookingInfo') || 'null');
if (!bookingInfo) {
  window.location.href = 'seat.html';
}

paymentSummary.innerHTML = `
  <div class="bus-summary-card">
    <div>
      <strong>${bookingInfo.name}</strong>
      <p>${bookingInfo.departure} → ${bookingInfo.arrival}</p>
    </div>
    <div class="bus-price">${bookingInfo.amount}</div>
  </div>
  <div class="bus-meta">
    <span>${bookingInfo.travelDate}</span>
    <span>${bookingInfo.seats.length} seat(s)</span>
  </div>
`;
payTotalEl.textContent = bookingInfo.amount.replace('₹', '');

paymentForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const cardName = document.getElementById('cardName').value.trim();
  const cardNumber = document.getElementById('cardNumber').value.trim();
  const expiry = document.getElementById('expiry').value.trim();
  const cvc = document.getElementById('cvc').value.trim();

  if (!cardName || !cardNumber || !expiry || !cvc) {
    alert('Please fill in all payment details.');
    return;
  }

  if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, '')) || !/^\d{2}\/\d{2}$/.test(expiry) || !/^\d{3,4}$/.test(cvc)) {
    alert('Enter valid card details in the form shown.');
    return;
  }
  // finalize booking using common function
  finalizeBooking();
});

// expose a global finalize function used by QR scanner
window.finalizeBooking = function(){
  try{
    const userId = localStorage.getItem('userId') || 'guest';
    const key = 'bookings_' + userId;
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    // dedupe by bus name + travelDate + seats
    const exists = list.some(b => b.name === bookingInfo.name && b.travelDate === bookingInfo.travelDate && JSON.stringify(b.seats) === JSON.stringify(bookingInfo.seats));
    if(!exists) {
      list.push(bookingInfo);
      localStorage.setItem(key, JSON.stringify(list));
    }
  }catch(e){}
  localStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));
  setTimeout(() => window.location.href = 'confirm.html', 400);
};