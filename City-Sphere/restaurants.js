function redirectToHome() {
  window.location.href = "index.html";
}
document.addEventListener("DOMContentLoaded", () => {
  const categories = document.querySelectorAll(".category");
  const restaurants = document.querySelectorAll(".restaurant");

  // Function to reset the filters
  function resetFilters() {
    categories.forEach((cat) => {
      cat.classList.remove("active"); // Deselect all categories
      cat.querySelector(".clear").style.display = "none"; // Hide all cross icons
    });

    // Show all restaurants when no categories are selected
    restaurants.forEach((restaurant) => {
      restaurant.style.display = "block";
    });
  }

  // Add click event listeners to each category (for selecting/deselecting)
  categories.forEach((category) => {
    category.addEventListener("click", (e) => {
      // Ignore click if the cross icon was clicked (no toggling)
      if (e.target.classList.contains("clear")) return;

      const selectedCategory = category.getAttribute("data-category");
      const isActive = category.classList.contains("active");

      // Toggle the active state of the category
      if (isActive) {
        category.classList.remove("active");
        category.querySelector(".clear").style.display = "none"; // Hide the cross icon
      } else {
        category.classList.add("active");
        category.querySelector(".clear").style.display = "block"; // Show the cross icon
      }

      // Filter restaurants based on selected categories
      filterRestaurants();
    });
  });

  // Add function to handle deselecting a category using the cross icon
  window.clearCategory = (event) => {
    event.stopPropagation(); // Prevent the click from triggering the category event
    const category = event.target.parentElement;
    category.classList.remove("active");
    category.querySelector(".clear").style.display = "none"; // Hide cross icon

    // Filter restaurants after deselecting a category
    filterRestaurants();
  };

  // Function to filter restaurants based on selected categories
  function filterRestaurants() {
    // Get all selected categories
    const activeCategories = Array.from(categories)
      .filter((cat) => cat.classList.contains("active"))
      .map((cat) => cat.getAttribute("data-category"));

    // Show restaurants that match any of the selected categories
    restaurants.forEach((restaurant) => {
      const restaurantCategory = restaurant.getAttribute("data-category");
      if (
        activeCategories.length === 0 ||
        activeCategories.includes(restaurantCategory)
      ) {
        restaurant.style.display = "block"; // Show matching restaurants
      } else {
        restaurant.style.display = "none"; // Hide non-matching restaurants
      }
    });
  }

  // Handle click event on the clear icon (cross icon)
  const clearIcons = document.querySelectorAll(".clear");
  clearIcons.forEach((icon) => {
    icon.addEventListener("click", function (event) {
      event.stopPropagation(); // Stop event from propagating to the parent
      const category = icon.parentElement; // Get the parent category div
      category.classList.remove("active"); // Remove active class
      category.querySelector(".clear").style.display = "none"; // Hide the cross icon

      // Re-filter restaurants after deselection
      filterRestaurants();
    });
  });
});
