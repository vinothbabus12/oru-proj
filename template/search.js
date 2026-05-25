const results = document.getElementById('results');
const form = document.getElementById('searchForm');
let currentTravelDate = '';

const cityMap = {
  chennai: 'Chennai',
  madras: 'Chennai',
  bangalore: 'Bangalore',
  bengaluru: 'Bangalore',
  hyderabad: 'Hyderabad',
  hyd: 'Hyderabad'
};

const sampleBuses = [
  { name: 'Express Air', departure: 'Chennai', arrival: 'Bangalore', time: '07:00 AM', price: '₹650' },
  { name: 'Silver Line', departure: 'Chennai', arrival: 'Bangalore', time: '09:30 AM', price: '₹720' },
  { name: 'City Cruiser', departure: 'Bangalore', arrival: 'Chennai', time: '05:00 PM', price: '₹690' },
  { name: 'Alpha Travel', departure: 'Chennai', arrival: 'Hyderabad', time: '08:15 AM', price: '₹780' },
  { name: 'Metro Express', departure: 'Bangalore', arrival: 'Hyderabad', time: '02:00 PM', price: '₹820' }
];

function normalizeCity(value) {
  if (!value) return '';
  const key = value.trim().toLowerCase();
  return cityMap[key] || value.trim();
}

function sameCity(a, b) {
  if (!a || !b) return false;
  const normalizedA = a.toLowerCase();
  const normalizedB = b.toLowerCase();
  return normalizedA === normalizedB || normalizedA.includes(normalizedB) || normalizedB.includes(normalizedA);
}

function createBusCard(bus) {
  const card = document.createElement('article');
  card.className = 'bus-card bus-card-action';
  card.innerHTML = `
    <div>
      <strong>${bus.name}</strong>
      <p>${bus.departure} → ${bus.arrival}</p>
      <p>${bus.time}</p>
    </div>
    <div class="card-right">
      <div class="bus-price">${bus.price}</div>
      <button type="button" class="outline select-button">Book seats</button>
    </div>
  `;
  const button = card.querySelector('.select-button');
  button.addEventListener('click', () => {
    const selectedBus = { ...bus, travelDate: currentTravelDate };
    localStorage.setItem('selectedBus', JSON.stringify(selectedBus));
    window.location.href = 'seat.html';
  });
  return card;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  results.innerHTML = '';

  const departure = normalizeCity(document.getElementById('departure').value);
  const arrival = normalizeCity(document.getElementById('arrival').value);
  currentTravelDate = document.getElementById('travelDate').value;

  if (!departure || !arrival || !currentTravelDate) {
    results.innerHTML = '<p class="msg error">Please fill in all travel details.</p>';
    return;
  }

  const matching = sampleBuses.filter((bus) => {
    return sameCity(bus.departure, departure) && sameCity(bus.arrival, arrival);
  });

  if (!matching.length) {
    results.innerHTML = `<p class="msg error">No buses found for ${departure} → ${arrival} on ${currentTravelDate}.</p>`;
    return;
  }

  results.innerHTML = `<p class="msg success">Showing ${matching.length} buses for ${departure} → ${arrival} on ${currentTravelDate}</p>`;
  matching.forEach((bus) => results.appendChild(createBusCard(bus)));
});
