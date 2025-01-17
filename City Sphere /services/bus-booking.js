document.addEventListener('DOMContentLoaded', function() {
    const busBookingForm = document.getElementById('busBookingForm');
    const busResults = document.getElementById('busResults');
    const resultsGrid = document.getElementById('resultsGrid');
    const seatModal = document.getElementById('seatModal');
    const closeModal = document.querySelector('.close-modal');
    const busLayout = document.getElementById('busLayout');
    const selectedSeatsText = document.getElementById('selectedSeatsText');
    const totalAmount = document.getElementById('totalAmount');
    const proceedToPayment = document.getElementById('proceedToPayment');

    // Sample bus data
    const buses = [
        {
            id: 1,
            name: "Express Travels",
            type: "AC Sleeper",
            departureTime: "21:00",
            arrivalTime: "06:00",
            duration: "9h",
            price: 800,
            availableSeats: 25,
            rating: 4.5
        },
        {
            id: 2,
            name: "City Connect",
            type: "AC Seater",
            departureTime: "08:00",
            arrivalTime: "14:00",
            duration: "6h",
            price: 600,
            availableSeats: 32,
            rating: 4.2
        },
        {
            id: 3,
            name: "Night Rider",
            type: "Non-AC Sleeper",
            departureTime: "22:00",
            arrivalTime: "08:00",
            duration: "10h",
            price: 500,
            availableSeats: 28,
            rating: 4.0
        }
    ];

    // Handle form submission
    busBookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        displayBusResults();
    });

    function displayBusResults() {
        busResults.style.display = 'block';
        resultsGrid.innerHTML = '';

        buses.forEach(bus => {
            const busCard = createBusCard(bus);
            resultsGrid.appendChild(busCard);
        });
    }

    function createBusCard(bus) {
        const card = document.createElement('div');
        card.className = 'bus-card';
        card.innerHTML = `
            <div class="bus-info">
                <h3>${bus.name}</h3>
                <p class="bus-type">${bus.type}</p>
                <div class="time-info">
                    <span class="departure">${bus.departureTime}</span>
                    <span class="duration">${bus.duration}</span>
                    <span class="arrival">${bus.arrivalTime}</span>
                </div>
                <div class="bus-details">
                    <span class="seats"><i class="fas fa-chair"></i> ${bus.availableSeats} seats available</span>
                    <span class="rating"><i class="fas fa-star"></i> ${bus.rating}</span>
                </div>
                <div class="price-section">
                    <span class="price">₹${bus.price}</span>
                    <button class="btn btn-select" onclick="selectBus(${bus.id})">Select Seats</button>
                </div>
            </div>
        `;
        return card;
    }

    // Seat selection functionality
    window.selectBus = function(busId) {
        seatModal.style.display = 'block';
        generateSeatLayout();
    };

    closeModal.onclick = function() {
        seatModal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == seatModal) {
            seatModal.style.display = 'none';
        }
    };

    function generateSeatLayout() {
        busLayout.innerHTML = '';
        const rows = 8;
        const seatsPerRow = 4;
        
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('div');
            row.className = 'seat-row';
            
            for (let j = 0; j < seatsPerRow; j++) {
                const seat = document.createElement('div');
                seat.className = 'seat available';
                seat.setAttribute('data-seat', `${i+1}${String.fromCharCode(65+j)}`);
                seat.onclick = function() { toggleSeat(this); };
                row.appendChild(seat);
            }
            
            busLayout.appendChild(row);
        }
    }

    function toggleSeat(seat) {
        if (seat.classList.contains('booked')) return;
        
        seat.classList.toggle('selected');
        updateSelectedSeats();
    }

    function updateSelectedSeats() {
        const selectedSeats = document.querySelectorAll('.seat.selected');
        const seatNumbers = Array.from(selectedSeats).map(seat => seat.getAttribute('data-seat'));
        
        selectedSeatsText.textContent = seatNumbers.length ? seatNumbers.join(', ') : 'None';
        totalAmount.textContent = seatNumbers.length * 800; // Sample price per seat
    }

    // Payment handling
    proceedToPayment.addEventListener('click', function() {
        const selectedSeats = document.querySelectorAll('.seat.selected');
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat to proceed.');
            return;
        }

        // Redirect to payment page with booking details
        const bookingDetails = {
            seats: Array.from(selectedSeats).map(seat => seat.getAttribute('data-seat')),
            amount: parseInt(totalAmount.textContent)
        };

        // Store booking details in sessionStorage
        sessionStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
        
        // Redirect to payment page
        window.location.href = 'payment.html';
    });
});
