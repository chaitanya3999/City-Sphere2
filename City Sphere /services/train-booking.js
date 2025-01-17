document.addEventListener('DOMContentLoaded', function() {
    const trainBookingForm = document.getElementById('trainBookingForm');
    const trainResults = document.getElementById('trainResults');
    const resultsGrid = document.getElementById('resultsGrid');
    const passengerModal = document.getElementById('passengerModal');
    const closeModal = document.querySelector('.close-modal');
    const passengerForm = document.getElementById('passengerForm');
    const passengerFields = document.getElementById('passengerFields');

    // Sample train data
    const trains = [
        {
            id: "12345",
            name: "Rajdhani Express",
            number: "12301",
            from: "Mumbai Central",
            to: "New Delhi",
            departureTime: "16:30",
            arrivalTime: "08:30",
            duration: "16h",
            availability: {
                "1A": 12,
                "2A": 24,
                "3A": 46,
                "SL": 120
            },
            fare: {
                "1A": 4500,
                "2A": 2800,
                "3A": 1900,
                "SL": 800
            }
        },
        {
            id: "12346",
            name: "Duronto Express",
            number: "12302",
            from: "Mumbai Central",
            to: "New Delhi",
            departureTime: "23:00",
            arrivalTime: "15:30",
            duration: "16h 30m",
            availability: {
                "1A": 8,
                "2A": 22,
                "3A": 42,
                "SL": 140
            },
            fare: {
                "1A": 4200,
                "2A": 2600,
                "3A": 1800,
                "SL": 750
            }
        }
    ];

    // Handle form submission
    trainBookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        displayTrainResults();
    });

    function displayTrainResults() {
        trainResults.style.display = 'block';
        resultsGrid.innerHTML = '';
        
        const selectedClass = document.getElementById('class').value;

        trains.forEach(train => {
            const trainCard = createTrainCard(train, selectedClass);
            resultsGrid.appendChild(trainCard);
        });
    }

    function createTrainCard(train, selectedClass) {
        const card = document.createElement('div');
        card.className = 'train-card';
        card.innerHTML = `
            <div class="train-info">
                <div class="train-primary">
                    <h3>${train.name}</h3>
                    <p class="train-number">${train.number}</p>
                </div>
                <div class="time-info">
                    <div class="departure">
                        <h4>${train.departureTime}</h4>
                        <p>${train.from}</p>
                    </div>
                    <div class="duration">
                        <span class="line"></span>
                        <p>${train.duration}</p>
                    </div>
                    <div class="arrival">
                        <h4>${train.arrivalTime}</h4>
                        <p>${train.to}</p>
                    </div>
                </div>
                <div class="availability-info">
                    ${createAvailabilityInfo(train, selectedClass)}
                </div>
            </div>
        `;
        return card;
    }

    function createAvailabilityInfo(train, selectedClass) {
        if (selectedClass) {
            return `
                <div class="class-info">
                    <span class="class-name">${selectedClass}</span>
                    <span class="availability">Available: ${train.availability[selectedClass]}</span>
                    <span class="fare">₹${train.fare[selectedClass]}</span>
                    <button class="btn btn-book" onclick="bookTrain('${train.id}', '${selectedClass}')">Book Now</button>
                </div>
            `;
        }

        return Object.keys(train.availability).map(className => `
            <div class="class-info">
                <span class="class-name">${className}</span>
                <span class="availability">Available: ${train.availability[className]}</span>
                <span class="fare">₹${train.fare[className]}</span>
                <button class="btn btn-book" onclick="bookTrain('${train.id}', '${className}')">Book Now</button>
            </div>
        `).join('');
    }

    // Booking functionality
    window.bookTrain = function(trainId, className) {
        const train = trains.find(t => t.id === trainId);
        const passengers = document.getElementById('passengers').value;
        
        passengerModal.style.display = 'block';
        generatePassengerFields(passengers, train, className);
    };

    closeModal.onclick = function() {
        passengerModal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == passengerModal) {
            passengerModal.style.display = 'none';
        }
    };

    function generatePassengerFields(count, train, className) {
        passengerFields.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const passengerField = document.createElement('div');
            passengerField.className = 'passenger-details';
            passengerField.innerHTML = `
                <h3>Passenger ${i + 1}</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label for="name${i}">Name</label>
                        <input type="text" id="name${i}" required>
                    </div>
                    <div class="form-group">
                        <label for="age${i}">Age</label>
                        <input type="number" id="age${i}" required min="1" max="120">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="gender${i}">Gender</label>
                        <select id="gender${i}" required>
                            <option value="">Select Gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="O">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="berth${i}">Berth Preference</label>
                        <select id="berth${i}">
                            <option value="NO">No Preference</option>
                            <option value="LB">Lower Berth</option>
                            <option value="MB">Middle Berth</option>
                            <option value="UB">Upper Berth</option>
                            <option value="SL">Side Lower</option>
                            <option value="SU">Side Upper</option>
                        </select>
                    </div>
                </div>
            `;
            passengerFields.appendChild(passengerField);
        }

        // Add total fare information
        const totalFare = train.fare[className] * count;
        const fareInfo = document.createElement('div');
        fareInfo.className = 'fare-summary';
        fareInfo.innerHTML = `
            <div class="fare-details">
                <p>Base Fare (${count} passengers): ₹${totalFare}</p>
                <p>Convenience Fee: ₹${Math.round(totalFare * 0.05)}</p>
                <h4>Total Fare: ₹${totalFare + Math.round(totalFare * 0.05)}</h4>
            </div>
        `;
        passengerFields.appendChild(fareInfo);
    }

    // Handle passenger form submission
    passengerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect passenger details
        const passengers = [];
        const count = document.getElementById('passengers').value;
        
        for (let i = 0; i < count; i++) {
            passengers.push({
                name: document.getElementById(`name${i}`).value,
                age: document.getElementById(`age${i}`).value,
                gender: document.getElementById(`gender${i}`).value,
                berthPreference: document.getElementById(`berth${i}`).value
            });
        }

        const bookingDetails = {
            passengers: passengers,
            insurance: document.getElementById('insurance').checked,
            gst: document.getElementById('gst').value
        };

        // Store booking details in sessionStorage
        sessionStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
        
        // Redirect to payment page
        window.location.href = 'payment.html';
    });
});
