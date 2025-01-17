// Flight booking functionality
document.addEventListener('DOMContentLoaded', function() {
    const flightSearchForm = document.getElementById('flightSearchForm');
    const flightResults = document.getElementById('flightResults');
    const resultsGrid = document.getElementById('resultsGrid');
    const flightModal = document.getElementById('flightModal');
    const closeModal = document.querySelector('.close-modal');

    // Sample flight data (in a real app, this would come from an API)
    const sampleFlights = [
        {
            id: 'FL001',
            airline: 'IndiGo',
            flightNumber: '6E-123',
            departure: {
                city: 'Mumbai',
                time: '06:00',
                terminal: 'T2'
            },
            arrival: {
                city: 'Delhi',
                time: '08:00',
                terminal: 'T3'
            },
            duration: '2h 00m',
            price: 4500,
            seats: generateSeats(),
            logo: '../assets/airlines/indigo.png'
        },
        {
            id: 'FL002',
            airline: 'Air India',
            flightNumber: 'AI-456',
            departure: {
                city: 'Mumbai',
                time: '08:30',
                terminal: 'T2'
            },
            arrival: {
                city: 'Delhi',
                time: '10:45',
                terminal: 'T3'
            },
            duration: '2h 15m',
            price: 5200,
            seats: generateSeats(),
            logo: '../assets/airlines/air-india.png'
        },
        {
            id: 'FL003',
            airline: 'Vistara',
            flightNumber: 'UK-789',
            departure: {
                city: 'Mumbai',
                time: '11:15',
                terminal: 'T2'
            },
            arrival: {
                city: 'Delhi',
                time: '13:30',
                terminal: 'T3'
            },
            duration: '2h 15m',
            price: 5800,
            seats: generateSeats(),
            logo: '../assets/airlines/vistara.png'
        }
    ];

    let selectedFlight = null;
    let selectedSeats = [];
    let selectedMeal = null;
    let extraServices = {
        extraBaggage: false,
        priorityBoarding: false,
        travelInsurance: false
    };

    // Flight type selection
    window.selectFlightType = function(type) {
        const options = document.querySelectorAll('.flight-option');
        options.forEach(option => option.classList.remove('active'));
        event.target.closest('.flight-option').classList.add('active');

        const returnDateGroup = document.getElementById('returnDateGroup');
        returnDateGroup.style.display = type === 'roundtrip' ? 'block' : 'none';
    };

    // Generate random seats
    function generateSeats() {
        const seats = [];
        const rows = 10;
        const cols = 6;
        const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

        for (let row = 1; row <= rows; row++) {
            for (let col = 0; col < cols; col++) {
                const seatNumber = `${row}${seatLetters[col]}`;
                seats.push({
                    number: seatNumber,
                    status: Math.random() > 0.3 ? 'available' : 'booked'
                });
            }
        }
        return seats;
    }

    // Search flights
    flightSearchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const fromCity = document.getElementById('fromCity').value;
        const toCity = document.getElementById('toCity').value;
        const departureDate = document.getElementById('departureDate').value;
        
        // In a real app, we would make an API call here
        displayFlightResults(sampleFlights);
    });

    // Display flight results
    function displayFlightResults(flights) {
        resultsGrid.innerHTML = '';
        flights.forEach(flight => {
            const flightCard = document.createElement('div');
            flightCard.className = 'flight-card';
            flightCard.innerHTML = `
                <div class="flight-info">
                    <div class="airline-info">
                        <img src="${flight.logo}" alt="${flight.airline}" class="airline-logo">
                        <div>
                            <h3>${flight.airline}</h3>
                            <p>${flight.flightNumber}</p>
                        </div>
                    </div>
                    <div class="time-info">
                        <div class="departure">
                            <h3>${flight.departure.time}</h3>
                            <p>${flight.departure.city}</p>
                            <small>Terminal ${flight.departure.terminal}</small>
                        </div>
                        <div class="duration">
                            <span>${flight.duration}</span>
                            <div class="line"></div>
                            <span>Non-stop</span>
                        </div>
                        <div class="arrival">
                            <h3>${flight.arrival.time}</h3>
                            <p>${flight.arrival.city}</p>
                            <small>Terminal ${flight.arrival.terminal}</small>
                        </div>
                    </div>
                    <div class="price-section">
                        <div class="price">₹${flight.price}</div>
                        <button class="btn btn-book" onclick="selectFlight('${flight.id}')">Book Now</button>
                    </div>
                </div>
            `;
            resultsGrid.appendChild(flightCard);
        });
        flightResults.style.display = 'block';
    }

    // Select flight and show modal
    window.selectFlight = function(flightId) {
        selectedFlight = sampleFlights.find(f => f.id === flightId);
        displaySeatLayout();
        flightModal.style.display = 'block';
    };

    // Display seat layout
    function displaySeatLayout() {
        const seatLayout = document.getElementById('seatLayout');
        seatLayout.innerHTML = '';
        
        selectedFlight.seats.forEach(seat => {
            const seatElement = document.createElement('div');
            seatElement.className = `seat ${seat.status}`;
            seatElement.textContent = seat.number;
            if (seat.status === 'available') {
                seatElement.onclick = () => toggleSeatSelection(seat.number);
            }
            seatLayout.appendChild(seatElement);
        });
    }

    // Toggle seat selection
    function toggleSeatSelection(seatNumber) {
        const seatElement = document.querySelector(`.seat:contains('${seatNumber}')`);
        if (selectedSeats.includes(seatNumber)) {
            selectedSeats = selectedSeats.filter(s => s !== seatNumber);
            seatElement.classList.remove('selected');
        } else {
            selectedSeats.push(seatNumber);
            seatElement.classList.add('selected');
        }
        updateBookingSummary();
    }

    // Select meal preference
    window.selectMeal = function(element, mealType) {
        document.querySelectorAll('.meal-option').forEach(option => {
            option.classList.remove('selected');
        });
        element.classList.add('selected');
        selectedMeal = mealType;
        updateBookingSummary();
    };

    // Update booking summary
    function updateBookingSummary() {
        const summary = document.getElementById('bookingSummary');
        const baseFare = selectedFlight.price;
        const mealPrice = selectedMeal ? getMealPrice(selectedMeal) : 0;
        const extraServicesPrice = calculateExtraServicesPrice();
        const totalPrice = baseFare + mealPrice + extraServicesPrice;

        summary.innerHTML = `
            <div class="summary-item">
                <span>Base Fare</span>
                <span>₹${baseFare}</span>
            </div>
            ${selectedMeal ? `
                <div class="summary-item">
                    <span>Meal (${selectedMeal})</span>
                    <span>₹${mealPrice}</span>
                </div>
            ` : ''}
            ${extraServicesPrice > 0 ? `
                <div class="summary-item">
                    <span>Extra Services</span>
                    <span>₹${extraServicesPrice}</span>
                </div>
            ` : ''}
            <div class="summary-item total">
                <span>Total</span>
                <span>₹${totalPrice}</span>
            </div>
        `;
    }

    // Get meal price
    function getMealPrice(mealType) {
        const prices = {
            veg: 350,
            nonveg: 400,
            special: 450
        };
        return prices[mealType] || 0;
    }

    // Calculate extra services price
    function calculateExtraServicesPrice() {
        let total = 0;
        if (extraServices.extraBaggage) total += 750;
        if (extraServices.priorityBoarding) total += 400;
        if (extraServices.travelInsurance) total += 249;
        return total;
    }

    // Handle extra services selection
    document.querySelectorAll('.service-option input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            extraServices[this.id] = this.checked;
            updateBookingSummary();
        });
    });

    // Proceed to payment
    window.proceedToPayment = function() {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat');
            return;
        }

        // Save booking details to localStorage
        const bookingDetails = {
            flight: selectedFlight,
            seats: selectedSeats,
            meal: selectedMeal,
            extraServices: extraServices,
            totalPrice: calculateTotalPrice()
        };
        localStorage.setItem('flightBooking', JSON.stringify(bookingDetails));

        // Redirect to payment page
        window.location.href = '../payment.html';
    };

    // Calculate total price
    function calculateTotalPrice() {
        const baseFare = selectedFlight.price;
        const mealPrice = selectedMeal ? getMealPrice(selectedMeal) : 0;
        const extraServicesPrice = calculateExtraServicesPrice();
        return baseFare + mealPrice + extraServicesPrice;
    }

    // Close modal
    closeModal.onclick = function() {
        flightModal.style.display = 'none';
    };

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === flightModal) {
            flightModal.style.display = 'none';
        }
    };
});
