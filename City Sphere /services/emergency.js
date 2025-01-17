// Sample emergency facilities data (replace with API call in production)
const emergencyFacilities = [
    {
        id: 1,
        name: 'City General Hospital',
        type: 'hospital',
        address: '123 Healthcare Ave',
        phone: '+1234567890',
        distance: '0.8',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        services: ['Emergency Room', 'Trauma Center', 'Ambulance Service'],
        openHours: '24/7'
    },
    {
        id: 2,
        name: 'Central Police Station',
        type: 'police',
        address: '456 Safety Street',
        phone: '+1234567891',
        distance: '1.2',
        coordinates: { lat: 40.7129, lng: -74.0061 },
        services: ['Emergency Response', 'Patrol', 'Investigation'],
        openHours: '24/7'
    },
    {
        id: 3,
        name: 'Downtown Fire Station',
        type: 'fire',
        address: '789 Emergency Road',
        phone: '+1234567892',
        distance: '1.5',
        coordinates: { lat: 40.7130, lng: -74.0062 },
        services: ['Fire Response', 'Rescue', 'Fire Prevention'],
        openHours: '24/7'
    }
];

// Initialize map and markers
let map;
let markers = [];
let userLocation;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadNearbyFacilities();
});

// Setup event listeners
function setupEventListeners() {
    // Add any additional event listeners here
    document.querySelectorAll('.call-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            logEmergencyCall(e.target.href.replace('tel:', ''));
        });
    });
}

// Initialize Google Maps
function initMap() {
    // Default center (update with user's location)
    const defaultCenter = { lat: 40.7128, lng: -74.0060 };
    
    map = new google.maps.Map(document.getElementById('facilitiesMap'), {
        zoom: 13,
        center: defaultCenter,
        styles: [
            {
                "featureType": "poi.business",
                "stylers": [{ "visibility": "off" }]
            },
            {
                "featureType": "transit",
                "elementType": "labels.icon",
                "stylers": [{ "visibility": "off" }]
            }
        ]
    });

    // Try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(userLocation);
                addUserMarker();
                loadNearbyFacilities();
            },
            () => {
                handleLocationError(true);
            }
        );
    } else {
        handleLocationError(false);
    }
}

// Add user location marker
function addUserMarker() {
    if (!userLocation) return;

    new google.maps.Marker({
        position: userLocation,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
        },
        title: 'Your Location'
    });
}

// Add facility markers
function addFacilityMarkers() {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    emergencyFacilities.forEach(facility => {
        const marker = new google.maps.Marker({
            position: facility.coordinates,
            map: map,
            icon: getFacilityIcon(facility.type),
            title: facility.name
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="facility-info-window">
                    <h3>${facility.name}</h3>
                    <p><i class="fas fa-map-marker-alt"></i> ${facility.address}</p>
                    <p><i class="fas fa-phone"></i> ${facility.phone}</p>
                    <p><i class="fas fa-clock"></i> ${facility.openHours}</p>
                    <button onclick="navigateToFacility(${facility.id})">Get Directions</button>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

        markers.push(marker);
    });
}

// Get facility icon based on type
function getFacilityIcon(type) {
    const icons = {
        hospital: 'hospital.png',
        police: 'police.png',
        fire: 'fire.png'
    };

    return {
        url: `../assets/icons/${icons[type]}`,
        scaledSize: new google.maps.Size(32, 32)
    };
}

// Handle location error
function handleLocationError(browserHasGeolocation) {
    const errorMessage = browserHasGeolocation
        ? 'Error: The Geolocation service failed.'
        : 'Error: Your browser doesn\'t support geolocation.';
    
    alert(errorMessage);
}

// Share location
function shareLocation() {
    if (!userLocation) {
        alert('Unable to get your location. Please enable location services.');
        return;
    }

    // Create shareable location link
    const locationLink = `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}`;
    
    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: 'My Emergency Location',
            text: 'Here is my current location:',
            url: locationLink
        }).catch(console.error);
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(locationLink).then(() => {
            alert('Location link copied to clipboard!');
        }).catch(() => {
            alert('Failed to copy location. Please try again.');
        });
    }
}

// Load nearby facilities
function loadNearbyFacilities() {
    const facilitiesList = document.getElementById('facilitiesList');
    
    facilitiesList.innerHTML = emergencyFacilities.map(facility => `
        <div class="facility-card ${facility.type}">
            <div class="facility-info">
                <h3>${facility.name}</h3>
                <p class="facility-address">
                    <i class="fas fa-map-marker-alt"></i> ${facility.address}
                </p>
                <p class="facility-distance">
                    <i class="fas fa-route"></i> ${facility.distance} km away
                </p>
                <p class="facility-hours">
                    <i class="fas fa-clock"></i> ${facility.openHours}
                </p>
                <div class="facility-services">
                    ${facility.services.map(service => 
                        `<span class="service-tag">${service}</span>`
                    ).join('')}
                </div>
            </div>
            <div class="facility-actions">
                <a href="tel:${facility.phone}" class="call-btn">
                    <i class="fas fa-phone"></i> Call Now
                </a>
                <button onclick="navigateToFacility(${facility.id})" class="directions-btn">
                    <i class="fas fa-directions"></i> Get Directions
                </button>
            </div>
        </div>
    `).join('');

    // Add markers to map if it's initialized
    if (map) {
        addFacilityMarkers();
    }
}

// Navigate to facility
function navigateToFacility(facilityId) {
    const facility = emergencyFacilities.find(f => f.id === facilityId);
    if (!facility) return;

    // Open Google Maps directions in new tab
    const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.coordinates.lat},${facility.coordinates.lng}`;
    window.open(url, '_blank');
}

// Log emergency call
function logEmergencyCall(number) {
    // Log the emergency call (implement according to your needs)
    console.log(`Emergency call placed to: ${number}`);
    
    // You might want to send this information to your backend
    // to keep track of emergency calls
    const callData = {
        number,
        timestamp: new Date().toISOString(),
        userLocation: userLocation || null
    };

    // Example API call
    // fetch('/api/emergency-calls', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(callData)
    // });
}

// Calculate distance between two points
function calculateDistance(point1, point2) {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Update facilities distances
function updateFacilitiesDistances() {
    if (!userLocation) return;

    emergencyFacilities.forEach(facility => {
        facility.distance = calculateDistance(
            userLocation,
            facility.coordinates
        ).toFixed(1);
    });

    // Refresh the facilities list
    loadNearbyFacilities();
}

// Watch user's location
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            updateFacilitiesDistances();
        },
        null,
        { enableHighAccuracy: true }
    );
}
