document.addEventListener('DOMContentLoaded', function() {
    const bookingSummary = document.getElementById('bookingSummary');
    const paymentForms = {
        upi: document.getElementById('upiForm'),
        card: document.getElementById('cardForm'),
        netbanking: document.getElementById('netbankingForm'),
        wallet: document.getElementById('walletForm')
    };

    // Get booking details from sessionStorage
    const bookingDetails = JSON.parse(sessionStorage.getItem('bookingDetails'));
    
    // Display booking summary based on the type of booking
    function displayBookingSummary() {
        if (!bookingDetails) {
            bookingSummary.innerHTML = '<p>No booking details found. Please try again.</p>';
            return;
        }

        let summaryHTML = '<div class="summary-details">';

        // Common booking details
        if (bookingDetails.from && bookingDetails.to) {
            summaryHTML += `
                <div class="journey-details">
                    <div class="from-to">
                        <div class="station">
                            <label>From</label>
                            <p>${bookingDetails.from}</p>
                        </div>
                        <i class="fas fa-arrow-right"></i>
                        <div class="station">
                            <label>To</label>
                            <p>${bookingDetails.to}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        // Specific details based on booking type
        if (bookingDetails.passengers) {
            if (Array.isArray(bookingDetails.passengers)) {
                // Train/Bus booking with passenger details
                summaryHTML += `
                    <div class="passenger-details">
                        <h3>Passenger Details</h3>
                        ${bookingDetails.passengers.map((passenger, index) => `
                            <div class="passenger">
                                <p><strong>Passenger ${index + 1}:</strong> ${passenger.name}</p>
                                <p>Age: ${passenger.age} | Gender: ${passenger.gender}</p>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else {
                // Metro booking with just number of passengers
                summaryHTML += `
                    <div class="passenger-details">
                        <p><strong>Number of Passengers:</strong> ${bookingDetails.passengers}</p>
                    </div>
                `;
            }
        }

        // Ticket type specific details
        if (bookingDetails.ticketType) {
            summaryHTML += `
                <div class="ticket-details">
                    <p><strong>Ticket Type:</strong> ${formatTicketType(bookingDetails.ticketType)}</p>
                `;

            if (bookingDetails.passType) {
                summaryHTML += `<p><strong>Pass Type:</strong> ${formatPassType(bookingDetails.passType)}</p>`;
            }

            if (bookingDetails.journeyDate) {
                summaryHTML += `<p><strong>Journey Date:</strong> ${formatDate(bookingDetails.journeyDate)}</p>`;
            }

            summaryHTML += '</div>';
        }

        // Additional services
        if (bookingDetails.insurance) {
            summaryHTML += `
                <div class="additional-services">
                    <p><i class="fas fa-shield-alt"></i> Travel Insurance Added</p>
                </div>
            `;
        }

        // Fare breakdown
        summaryHTML += `
            <div class="fare-breakdown">
                <h3>Fare Breakdown</h3>
                <div class="fare-item">
                    <span>Base Fare</span>
                    <span>₹${bookingDetails.fare}</span>
                </div>
        `;

        if (bookingDetails.insurance) {
            summaryHTML += `
                <div class="fare-item">
                    <span>Travel Insurance</span>
                    <span>₹35</span>
                </div>
            `;
        }

        const convenienceFee = Math.round(bookingDetails.fare * 0.02); // 2% convenience fee
        summaryHTML += `
                <div class="fare-item">
                    <span>Convenience Fee</span>
                    <span>₹${convenienceFee}</span>
                </div>
                <div class="fare-item total">
                    <span>Total Amount</span>
                    <span>₹${bookingDetails.fare + (bookingDetails.insurance ? 35 : 0) + convenienceFee}</span>
                </div>
            </div>
        </div>`;

        bookingSummary.innerHTML = summaryHTML;
    }

    // Helper functions for formatting
    function formatTicketType(type) {
        return type.charAt(0).toUpperCase() + type.slice(1) + ' Ticket';
    }

    function formatPassType(type) {
        return type.charAt(0).toUpperCase() + type.slice(1) + ' Pass';
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Handle payment method selection
    window.selectPaymentMethod = function(method) {
        // Hide all payment forms
        Object.values(paymentForms).forEach(form => {
            form.style.display = 'none';
        });

        // Show selected payment form
        paymentForms[method].style.display = 'block';

        // Update active state of payment options
        document.querySelectorAll('.payment-option').forEach(option => {
            option.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
    };

    // Handle form submissions
    Object.values(paymentForms).forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, this would handle the payment processing
            // For demo purposes, show a success message and redirect
            alert('Payment successful! Your booking is confirmed.');
            
            // Clear the booking details from session storage
            sessionStorage.removeItem('bookingDetails');
            
            // Redirect to homepage
            window.location.href = '../index.html';
        });
    });

    // Initialize booking summary
    displayBookingSummary();
});
