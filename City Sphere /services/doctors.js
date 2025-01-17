// Sample doctors data (replace with API call in production)
const doctors = [
    {
        id: 1,
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        location: 'Central Hospital, Downtown',
        rating: 4.8,
        reviews: 127,
        availability: 'Available Today',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300'
    },
    {
        id: 2,
        name: 'Dr. Michael Chen',
        specialty: 'Dermatology',
        location: 'Wellness Center, Westside',
        rating: 4.6,
        reviews: 98,
        availability: 'Next Available: Tomorrow',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300'
    },
    {
        id: 3,
        name: 'Dr. Emily Martinez',
        specialty: 'Pediatrics',
        location: 'Children\'s Medical Center',
        rating: 4.9,
        reviews: 156,
        availability: 'Available Today',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300'
    },
    // Add more doctors as needed
];

// DOM Elements
const doctorsGrid = document.getElementById('doctorsGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const appointmentModal = document.getElementById('appointmentModal');
const appointmentForm = document.getElementById('appointmentForm');
const closeModal = document.querySelector('.close-modal');
const doctorSearch = document.getElementById('doctorSearch');
const specialtyFilter = document.getElementById('specialtyFilter');
const availabilityFilter = document.getElementById('availabilityFilter');
const ratingFilter = document.getElementById('ratingFilter');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadDoctors();
    setupEventListeners();
});

// Load doctors
function loadDoctors(filters = {}) {
    showLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
        let filteredDoctors = doctors;

        // Apply filters
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredDoctors = filteredDoctors.filter(doctor => 
                doctor.name.toLowerCase().includes(searchTerm) ||
                doctor.specialty.toLowerCase().includes(searchTerm) ||
                doctor.location.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.specialty) {
            filteredDoctors = filteredDoctors.filter(doctor => 
                doctor.specialty.toLowerCase() === filters.specialty.toLowerCase()
            );
        }

        if (filters.rating) {
            filteredDoctors = filteredDoctors.filter(doctor => 
                doctor.rating >= parseFloat(filters.rating)
            );
        }

        // Render doctors
        renderDoctors(filteredDoctors);
        showLoading(false);
    }, 500);
}

// Render doctors grid
function renderDoctors(doctors) {
    doctorsGrid.innerHTML = doctors.map(doctor => `
        <div class="doctor-card">
            <img src="${doctor.image}" alt="Dr. ${doctor.name}" class="doctor-image">
            <div class="doctor-info">
                <h3 class="doctor-name">${doctor.name}</h3>
                <p class="doctor-specialty">${doctor.specialty}</p>
                <p class="doctor-location"><i class="fas fa-map-marker-alt"></i> ${doctor.location}</p>
                <div class="doctor-rating">
                    <div class="rating-stars">
                        ${getRatingStars(doctor.rating)}
                    </div>
                    <span class="rating-count">(${doctor.reviews} reviews)</span>
                </div>
                <p class="doctor-availability"><i class="fas fa-clock"></i> ${doctor.availability}</p>
                <button class="book-btn" onclick="openBooking(${doctor.id})">
                    Book Appointment
                </button>
            </div>
        </div>
    `).join('');
}

// Generate rating stars
function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Setup event listeners
function setupEventListeners() {
    // Search and filters
    doctorSearch.addEventListener('input', debounce(() => {
        applyFilters();
    }, 300));

    specialtyFilter.addEventListener('change', applyFilters);
    availabilityFilter.addEventListener('change', applyFilters);
    ratingFilter.addEventListener('change', applyFilters);

    // Modal
    closeModal.addEventListener('click', closeBooking);
    window.addEventListener('click', (e) => {
        if (e.target === appointmentModal) {
            closeBooking();
        }
    });

    // Appointment form
    appointmentForm.addEventListener('submit', handleAppointmentSubmit);
}

// Apply filters
function applyFilters() {
    const filters = {
        search: doctorSearch.value,
        specialty: specialtyFilter.value,
        availability: availabilityFilter.value,
        rating: ratingFilter.value
    };
    loadDoctors(filters);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show/hide loading spinner
function showLoading(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
}

// Open booking modal
function openBooking(doctorId) {
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) return;

    // Populate time slots
    const timeSelect = document.getElementById('appointmentTime');
    timeSelect.innerHTML = generateTimeSlots();

    appointmentModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close booking modal
function closeBooking() {
    appointmentModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Generate time slots
function generateTimeSlots() {
    let slots = '';
    for (let hour = 9; hour <= 17; hour++) {
        const time12 = hour > 12 ? `${hour-12}:00 PM` : `${hour}:00 AM`;
        slots += `<option value="${hour}:00">${time12}</option>`;
        if (hour !== 17) {
            const time12Half = hour > 12 ? `${hour-12}:30 PM` : `${hour}:30 AM`;
            slots += `<option value="${hour}:30">${time12Half}</option>`;
        }
    }
    return slots;
}

// Handle appointment form submission
async function handleAppointmentSubmit(e) {
    e.preventDefault();

    const formData = {
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        type: document.getElementById('appointmentType').value,
        notes: document.getElementById('appointmentNotes').value
    };

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Appointment booked successfully!');
        closeBooking();
        appointmentForm.reset();
    } catch (error) {
        alert('Failed to book appointment. Please try again.');
    }
}
