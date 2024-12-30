function redirectToLogin() {
  window.location.href = "Register-login.html";
  document.getElementById("login-tab");
}
function redirectToSignUp() {
  const signup = document.getElementById("register-tab");
}

let map;
let autocomplete;

function initMap() {
  const defaultLocation = { lat: 18.5204, lng: 73.8567 }; // Pune coordinates

  // Initialize the map with a default location
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 13,
  });

  // Try to get the user's current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(userLocation); // Center the map on user's location
        map.setZoom(15); // Zoom in for better visibility

        // Add a marker for user's location
        new google.maps.Marker({
          position: userLocation,
          map: map,
          title: "You are here!",
        });
      },
      (error) => {
        console.warn("Geolocation failed or permission denied:", error);
      }
    );
  } else {
    console.warn("Geolocation is not supported by this browser.");
  }

  // Initialize autocomplete for the search input
  const input = document.getElementById("pac-input");
  autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  // Handle place selection from the autocomplete
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      console.log("No details available for the selected place.");
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17); // Zoom to 17 if no viewport is available
    }

    // Add a marker for the selected place
    new google.maps.Marker({
      position: place.geometry.location,
      map: map,
    });
  });
}
