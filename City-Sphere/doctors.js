function redirectToHome() {
    window.location.href = "index.html";
}

// JavaScript for handling dynamic forms for booking appointment and getting prescription

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".container");

    // Function to create and display the form dynamically
    function displayForm(action, doctorName) {
        const existingForm = document.getElementById("dynamic-form");

        // Remove any existing form before creating a new one
        if (existingForm) {
            existingForm.remove();
        }

        // Create the form container
        const form = document.createElement("form");
        form.id = "dynamic-form";
        form.style.border = "1px solid #ccc";
        form.style.padding = "15px";
        form.style.marginTop = "20px";
        form.style.background = "#f9f9f9";

        // Add heading
        const heading = document.createElement("h3");
        heading.textContent = `${action} for ${doctorName}`;
        form.appendChild(heading);

        // Add input fields
        const nameField = document.createElement("input");
        nameField.type = "text";
        nameField.name = "patientName";
        nameField.placeholder = "Enter your name";
        nameField.required = true;
        nameField.style.margin = "10px 0";
        nameField.style.display = "block";
        form.appendChild(nameField);

        const contactField = document.createElement("input");
        contactField.type = "text";
        contactField.name = "contact";
        contactField.placeholder = "Enter your contact details";
        contactField.required = true;
        contactField.style.margin = "10px 0";
        contactField.style.display = "block";
        form.appendChild(contactField);

        if (action === "Book Appointment") {
            const dateField = document.createElement("input");
            dateField.type = "date";
            dateField.name = "appointmentDate";
            dateField.required = true;
            dateField.style.margin = "10px 0";
            dateField.style.display = "block";
            form.appendChild(dateField);
        }

        // Add submit button
        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = `Submit ${action}`;
        submitButton.style.display = "block";
        submitButton.style.marginTop = "10px";
        form.appendChild(submitButton);

        // Append the form to the container
        container.appendChild(form);

        // Scroll to the form
        form.scrollIntoView({ behavior: "smooth" });

        // Add event listener for form submission
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            alert(`${action} submitted successfully!`);
            form.remove();
        });
    }

    // Attach event listeners to the buttons
    document.querySelectorAll(".doctor-card .button").forEach((button) => {
        button.addEventListener("click", (event) => {
            const doctorCard = button.closest(".doctor-card");
            const doctorName = doctorCard.querySelector("h2").textContent;

            if (button.textContent === "Book Appointment") {
                displayForm("Book Appointment", doctorName);
            } else if (button.textContent === "Get Prescription") {
                displayForm("Get Prescription", doctorName);
            }
        });
    });
});

