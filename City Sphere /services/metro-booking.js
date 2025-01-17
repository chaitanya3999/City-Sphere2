document.addEventListener('DOMContentLoaded', function() {
    const metroBookingForm = document.getElementById('metroBookingForm');
    const fromStation = document.getElementById('fromStation');
    const toStation = document.getElementById('toStation');
    const fareEstimate = document.getElementById('fareEstimate');
    
    // Sample metro stations data
    const stations = [
        { id: 1, name: "Versova", line: "Blue" },
        { id: 2, name: "D.N. Nagar", line: "Blue" },
        { id: 3, name: "Azad Nagar", line: "Blue" },
        { id: 4, name: "Andheri", line: "Blue" },
        { id: 5, name: "Ghatkopar", line: "Blue" },
        { id: 6, name: "Wadala", line: "Green" },
        { id: 7, name: "Bandra", line: "Green" },
        { id: 8, name: "Kurla", line: "Green" },
        { id: 9, name: "Thane", line: "Green" }
    ];

    // Populate station dropdowns
    function populateStations() {
        stations.forEach(station => {
            const option1 = document.createElement('option');
            const option2 = document.createElement('option');
            
            option1.value = option2.value = station.id;
            option1.textContent = option2.textContent = `${station.name} (${station.line} Line)`;
            
            fromStation.appendChild(option1);
            toStation.appendChild(option2);
        });
    }

    // Calculate distance between stations (simplified version)
    function calculateDistance(from, to) {
        // In a real application, this would use actual station coordinates or predefined distances
        return Math.abs(from - to) * 2; // Simple multiplication for demo
    }

    // Calculate fare based on distance and ticket type
    function calculateFare(distance, ticketType, passengers = 1, groupType = 'regular') {
        let baseFare = 0;
        
        switch(ticketType) {
            case 'single':
                baseFare = Math.min(20 + (distance * 5), 60); // Base 20 + 5 per km, max 60
                return baseFare * passengers;
            
            case 'return':
                baseFare = Math.min(20 + (distance * 5), 60);
                return (baseFare * passengers) * 1.8; // 10% discount on return journey
            
            case 'pass':
                const passType = document.getElementById('passType').value;
                switch(passType) {
                    case 'daily': return 150;
                    case 'weekly': return 400;
                    case 'monthly': return 1400;
                    default: return 0;
                }
            
            case 'group':
                baseFare = Math.min(20 + (distance * 5), 60);
                const groupSize = parseInt(document.getElementById('groupSize').value);
                let discount = 0;
                
                switch(groupType) {
                    case 'student': discount = 0.1; break;
                    case 'senior': discount = 0.15; break;
                    default: discount = 0.05; // Regular group discount
                }
                
                return (baseFare * groupSize) * (1 - discount);
            
            default:
                return 0;
        }
    }

    // Update fare estimate
    function updateFareEstimate() {
        const from = parseInt(fromStation.value);
        const to = parseInt(toStation.value);
        
        if (from && to) {
            const distance = calculateDistance(from, to);
            const currentTicketType = getCurrentTicketType();
            let fare = 0;
            
            if (currentTicketType === 'group') {
                const groupType = document.getElementById('groupType').value;
                fare = calculateFare(distance, currentTicketType, null, groupType);
            } else if (currentTicketType === 'pass') {
                fare = calculateFare(distance, currentTicketType);
            } else {
                const passengers = parseInt(document.getElementById('passengers').value);
                fare = calculateFare(distance, currentTicketType, passengers);
            }
            
            fareEstimate.innerHTML = `
                <div class="fare-details">
                    <p>Distance: ${distance} km</p>
                    <h4>Estimated Fare: ₹${Math.round(fare)}</h4>
                    <small>*Fare includes all applicable taxes</small>
                </div>
            `;
        }
    }

    // Get current ticket type
    function getCurrentTicketType() {
        if (document.getElementById('passFields').style.display !== 'none') return 'pass';
        if (document.getElementById('groupFields').style.display !== 'none') return 'group';
        return document.getElementById('journeyDate').value ? 'single' : 'return';
    }

    // Handle ticket type selection
    window.selectTicketType = function(type) {
        // Hide all ticket fields first
        document.querySelectorAll('.ticket-fields').forEach(field => {
            field.style.display = 'none';
        });

        // Show relevant fields based on selection
        switch(type) {
            case 'single':
            case 'return':
                document.getElementById('singleJourneyFields').style.display = 'block';
                break;
            case 'pass':
                document.getElementById('passFields').style.display = 'block';
                break;
            case 'group':
                document.getElementById('groupFields').style.display = 'block';
                break;
        }

        // Update fare estimate
        updateFareEstimate();

        // Update active state of ticket options
        document.querySelectorAll('.ticket-option').forEach(option => {
            option.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
    };

    // Handle form submission
    metroBookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const bookingDetails = {
            from: fromStation.options[fromStation.selectedIndex].text,
            to: toStation.options[toStation.selectedIndex].text,
            ticketType: getCurrentTicketType(),
            fare: parseFloat(fareEstimate.querySelector('h4').textContent.replace('₹', ''))
        };

        // Add specific details based on ticket type
        switch(bookingDetails.ticketType) {
            case 'pass':
                bookingDetails.passType = document.getElementById('passType').value;
                bookingDetails.startDate = document.getElementById('startDate').value;
                break;
            case 'group':
                bookingDetails.groupSize = document.getElementById('groupSize').value;
                bookingDetails.groupType = document.getElementById('groupType').value;
                break;
            default:
                bookingDetails.journeyDate = document.getElementById('journeyDate').value;
                bookingDetails.passengers = document.getElementById('passengers').value;
        }

        // Store booking details in sessionStorage
        sessionStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
        
        // Redirect to payment page
        window.location.href = 'payment.html';
    });

    // Event listeners for fare calculation
    fromStation.addEventListener('change', updateFareEstimate);
    toStation.addEventListener('change', updateFareEstimate);
    if (document.getElementById('passengers')) {
        document.getElementById('passengers').addEventListener('change', updateFareEstimate);
    }
    if (document.getElementById('groupSize')) {
        document.getElementById('groupSize').addEventListener('change', updateFareEstimate);
    }
    if (document.getElementById('groupType')) {
        document.getElementById('groupType').addEventListener('change', updateFareEstimate);
    }
    if (document.getElementById('passType')) {
        document.getElementById('passType').addEventListener('change', updateFareEstimate);
    }

    // Initialize stations
    populateStations();

    // Open full metro map
    window.openFullMap = function() {
        // In a real application, this would open a modal or new window with a zoomable map
        alert('Full metro map functionality would be implemented here');
    };
});
