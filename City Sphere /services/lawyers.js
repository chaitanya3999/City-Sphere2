document.addEventListener("DOMContentLoaded", function () {
  // Sample data - In a real application, this would come from a backend API
  const lawyers = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialization: "Criminal Law",
      experience: "15 years",
      rating: 4.8,
      location: "Downtown",
      image: "https://placeholder.com/150",
      availability: ["Monday", "Wednesday", "Friday"],
      consultationFee: "₹2000",
      languages: ["English", "Hindi"],
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      specialization: "Family Law",
      experience: "12 years",
      rating: 4.5,
      location: "Bandra West",
      image: "https://placeholder.com/150",
      availability: ["Tuesday", "Thursday", "Saturday"],
      consultationFee: "₹1800",
      languages: ["English", "Hindi", "Marathi"],
    },
    {
      id: 3,
      name: "Jack Reacher",
      specialization: "Corporate Law",
      experience: "14 years",
      rating: 4.6,
      location: "Andheri East",
      image: "https://placeholder.com/150",
      availability: ["Monday", "Tuesday", "Wednesday"],
      consultationFee: "₹2500",
      languages: ["English", "Hindi"],
    },
    // Add more sample lawyers here
  ];

  const lawyersGrid = document.getElementById("lawyersGrid");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const searchInput = document.getElementById("lawyerSearch");
  const specialtyFilter = document.getElementById("specialtyFilter");
  const availabilityFilter = document.getElementById("availabilityFilter");
  const ratingFilter = document.getElementById("ratingFilter");
  const modal = document.getElementById("appointmentModal");
  const closeModal = document.querySelector(".close-modal");

  function createLawyerCard(lawyer) {
    const card = document.createElement("div");
    card.className = "lawyer-card";
    card.innerHTML = `
            <div class="lawyer-image">
                <img src="${lawyer.image}" alt="${lawyer.name}">
            </div>
            <div class="lawyer-info">
                <h3>${lawyer.name}</h3>
                <p class="specialization">${lawyer.specialization}</p>
                <p class="experience">${lawyer.experience} Experience</p>
                <div class="rating">
                    <span class="stars">${"★".repeat(
                      Math.floor(lawyer.rating)
                    )}${"☆".repeat(5 - Math.floor(lawyer.rating))}</span>
                    <span class="rating-number">${lawyer.rating}</span>
                </div>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${
                  lawyer.location
                }</p>
                <p class="fee">Consultation Fee: ${lawyer.consultationFee}</p>
                <p class="languages">Languages: ${lawyer.languages.join(
                  ", "
                )}</p>
                <button class="btn btn-book" onclick="openBooking(${
                  lawyer.id
                })">Book Consultation</button>
            </div>
        `;
    return card;
  }

  function displayLawyers(filteredLawyers = lawyers) {
    lawyersGrid.innerHTML = "";
    loadingSpinner.style.display = "block";

    setTimeout(() => {
      filteredLawyers.forEach((lawyer) => {
        lawyersGrid.appendChild(createLawyerCard(lawyer));
      });
      loadingSpinner.style.display = "none";
    }, 500);
  }

  function filterLawyers() {
    const searchTerm = searchInput.value.toLowerCase();
    const specialty = specialtyFilter.value;
    const availability = availabilityFilter.value;
    const minRating = ratingFilter.value ? parseFloat(ratingFilter.value) : 0;

    const filtered = lawyers.filter((lawyer) => {
      const matchesSearch =
        lawyer.name.toLowerCase().includes(searchTerm) ||
        lawyer.specialization.toLowerCase().includes(searchTerm) ||
        lawyer.location.toLowerCase().includes(searchTerm);
      const matchesSpecialty =
        !specialty || lawyer.specialization.toLowerCase().includes(specialty);
      const matchesRating = lawyer.rating >= minRating;

      return matchesSearch && matchesSpecialty && matchesRating;
    });

    displayLawyers(filtered);
  }

  // Event listeners for filters
  searchInput.addEventListener("input", filterLawyers);
  specialtyFilter.addEventListener("change", filterLawyers);
  availabilityFilter.addEventListener("change", filterLawyers);
  ratingFilter.addEventListener("change", filterLawyers);

  // Modal functionality
  window.openBooking = function (lawyerId) {
    modal.style.display = "block";
    // Here you would typically load the lawyer's available time slots
    populateTimeSlots();
  };

  closeModal.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  function populateTimeSlots() {
    const timeSlotSelect = document.getElementById("appointmentTime");
    timeSlotSelect.innerHTML = '<option value="">Select Time</option>';

    // Sample time slots - In a real application, these would be fetched based on lawyer's availability
    const timeSlots = [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
      "05:00 PM",
    ];

    timeSlots.forEach((slot) => {
      const option = document.createElement("option");
      option.value = slot;
      option.textContent = slot;
      timeSlotSelect.appendChild(option);
    });
  }

  // Handle form submission
  const appointmentForm = document.getElementById("appointmentForm");
  appointmentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Here you would typically send the form data to your backend
    const formData = {
      date: document.getElementById("appointmentDate").value,
      time: document.getElementById("appointmentTime").value,
      consultationType: document.getElementById("consultationType").value,
      caseType: document.getElementById("caseType").value,
      notes: document.getElementById("appointmentNotes").value,
    };

    // For demo purposes, just log the data and show a success message
    console.log("Booking details:", formData);
    alert(
      "Consultation booked successfully! We will send you a confirmation email shortly."
    );
    modal.style.display = "none";
    appointmentForm.reset();
  });

  // Initial display
  displayLawyers();
});
