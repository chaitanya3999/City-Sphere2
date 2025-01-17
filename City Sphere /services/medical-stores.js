// Sample medical stores data (replace with API call in production)
const medicalStores = [
    {
        id: 1,
        name: 'LifeCare Pharmacy',
        rating: 4.6,
        reviews: 238,
        distance: '0.8',
        openHours: '24x7',
        address: '123 Health Street, Downtown',
        image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=300',
        isOpen: true,
        homeDelivery: true,
        inventory: {
            'Prescription Medicines': [
                { id: 101, name: 'Amoxicillin 500mg', price: 12.99, requiresPrescription: true },
                { id: 102, name: 'Metformin 1000mg', price: 15.99, requiresPrescription: true }
            ],
            'Over The Counter': [
                { id: 201, name: 'Paracetamol 500mg', price: 5.99, description: 'Pain reliever and fever reducer' },
                { id: 202, name: 'Vitamin C 1000mg', price: 8.99, description: 'Immune system support' }
            ],
            'Healthcare Devices': [
                { id: 301, name: 'Digital Thermometer', price: 19.99, description: 'Quick and accurate readings' },
                { id: 302, name: 'Blood Pressure Monitor', price: 49.99, description: 'Home BP monitoring' }
            ]
        }
    },
    {
        id: 2,
        name: 'MediPlus Pharmacy',
        rating: 4.4,
        reviews: 186,
        distance: '1.2',
        openHours: '8:00 AM - 10:00 PM',
        address: '456 Wellness Ave, Midtown',
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=300',
        isOpen: true,
        homeDelivery: true,
        inventory: {
            'Prescription Medicines': [
                { id: 401, name: 'Lisinopril 10mg', price: 14.99, requiresPrescription: true },
                { id: 402, name: 'Omeprazole 20mg', price: 16.99, requiresPrescription: true }
            ],
            'Personal Care': [
                { id: 501, name: 'Hand Sanitizer 500ml', price: 4.99, description: 'Kills 99.9% germs' },
                { id: 502, name: 'Face Masks (Pack of 10)', price: 9.99, description: '3-ply protection' }
            ]
        }
    },
    // Add more stores as needed
];

// DOM Elements
const storesGrid = document.getElementById('storesGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const storeModal = document.getElementById('storeModal');
const prescriptionModal = document.getElementById('prescriptionModal');
const cartModal = document.getElementById('cartModal');
const cartButton = document.getElementById('cartButton');
const closeModals = document.querySelectorAll('.close-modal');
const storeDetails = document.getElementById('storeDetails');
const medicineCategories = document.getElementById('medicineCategories');
const medicineItems = document.getElementById('medicineItems');
const cartItems = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const uploadPrescriptionBtn = document.getElementById('uploadPrescriptionBtn');
const prescriptionForm = document.getElementById('prescriptionForm');
const medicineSearch = document.getElementById('medicineSearch');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const availabilityFilter = document.getElementById('availabilityFilter');

// Shopping cart
let cart = {
    items: [],
    storeId: null
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadStores();
    setupEventListeners();
    updateCartCount();
});

// Load stores
function loadStores(filters = {}) {
    showLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
        let filteredStores = medicalStores;

        // Apply filters
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredStores = filteredStores.filter(store => 
                store.name.toLowerCase().includes(searchTerm) ||
                store.address.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.availability === 'open-now') {
            filteredStores = filteredStores.filter(store => store.isOpen);
        } else if (filters.availability === '24-hours') {
            filteredStores = filteredStores.filter(store => store.openHours === '24x7');
        } else if (filters.availability === 'home-delivery') {
            filteredStores = filteredStores.filter(store => store.homeDelivery);
        }

        // Apply sorting
        if (filters.sort) {
            switch (filters.sort) {
                case 'nearest':
                    filteredStores.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
                    break;
                case 'rating':
                    filteredStores.sort((a, b) => b.rating - a.rating);
                    break;
            }
        }

        renderStores(filteredStores);
        showLoading(false);
    }, 500);
}

// Render stores grid
function renderStores(stores) {
    storesGrid.innerHTML = stores.map(store => `
        <div class="store-card" onclick="openStore(${store.id})">
            <img src="${store.image}" alt="${store.name}" class="store-image">
            <div class="store-info">
                <h3 class="store-name">${store.name}</h3>
                <p class="store-address"><i class="fas fa-map-marker-alt"></i> ${store.address}</p>
                <div class="store-rating">
                    <div class="rating-stars">
                        ${getRatingStars(store.rating)}
                    </div>
                    <span class="rating-count">(${store.reviews})</span>
                </div>
                <p class="store-distance">
                    <i class="fas fa-route"></i> ${store.distance} km
                </p>
                <p class="store-hours">
                    <i class="fas fa-clock"></i> ${store.openHours}
                    <span class="store-status ${store.isOpen ? 'open' : 'closed'}">
                        ${store.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                </p>
                ${store.homeDelivery ? 
                    '<span class="delivery-tag"><i class="fas fa-truck"></i> Home Delivery</span>' : ''}
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
    medicineSearch.addEventListener('input', debounce(() => {
        applyFilters();
    }, 300));

    categoryFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
    availabilityFilter.addEventListener('change', applyFilters);

    // Modals
    closeModals.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            storeModal.style.display = 'none';
            prescriptionModal.style.display = 'none';
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === storeModal || e.target === prescriptionModal || e.target === cartModal) {
            storeModal.style.display = 'none';
            prescriptionModal.style.display = 'none';
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    cartButton.addEventListener('click', openCart);
    uploadPrescriptionBtn.addEventListener('click', openPrescriptionUpload);
    checkoutBtn.addEventListener('click', handleCheckout);
    prescriptionForm.addEventListener('submit', handlePrescriptionUpload);
}

// Apply filters
function applyFilters() {
    const filters = {
        search: medicineSearch.value,
        category: categoryFilter.value,
        sort: sortFilter.value,
        availability: availabilityFilter.value
    };
    loadStores(filters);
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

// Open store details
function openStore(storeId) {
    const store = medicalStores.find(s => s.id === storeId);
    if (!store) return;

    storeDetails.innerHTML = `
        <div class="store-header">
            <img src="${store.image}" alt="${store.name}">
            <div class="store-header-info">
                <h2>${store.name}</h2>
                <p><i class="fas fa-map-marker-alt"></i> ${store.address}</p>
                <div class="store-rating">
                    ${getRatingStars(store.rating)}
                    <span>(${store.reviews} reviews)</span>
                </div>
                <p><i class="fas fa-clock"></i> ${store.openHours}</p>
                <p><i class="fas fa-route"></i> ${store.distance} km away</p>
            </div>
        </div>
    `;

    medicineCategories.innerHTML = Object.keys(store.inventory).map(category => `
        <button class="medicine-category" onclick="showMedicineCategory('${category}')">${category}</button>
    `).join('');

    showMedicineCategory(Object.keys(store.inventory)[0], store);

    storeModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Show medicine category
function showMedicineCategory(category, store) {
    const items = medicalStores.find(s => s.id === store.id).inventory[category];
    
    medicineItems.innerHTML = items.map(item => `
        <div class="medicine-item">
            <div class="medicine-item-info">
                <h4>${item.name}</h4>
                ${item.description ? `<p>${item.description}</p>` : ''}
                <p class="medicine-item-price">$${item.price.toFixed(2)}</p>
                ${item.requiresPrescription ? 
                    '<span class="prescription-tag"><i class="fas fa-file-medical"></i> Prescription Required</span>' : ''}
            </div>
            <button class="add-item-btn" onclick="addToCart(${store.id}, ${item.id}, ${item.requiresPrescription})">
                Add to Cart
            </button>
        </div>
    `).join('');
}

// Add to cart
function addToCart(storeId, itemId, requiresPrescription) {
    if (requiresPrescription) {
        openPrescriptionUpload();
        return;
    }

    // Check if adding from a different store
    if (cart.storeId && cart.storeId !== storeId) {
        if (!confirm('Adding items from a different store will clear your current cart. Continue?')) {
            return;
        }
        cart.items = [];
    }

    cart.storeId = storeId;
    const store = medicalStores.find(s => s.id === storeId);
    let item;
    
    // Find item in store inventory
    for (const category in store.inventory) {
        const foundItem = store.inventory[category].find(i => i.id === itemId);
        if (foundItem) {
            item = foundItem;
            break;
        }
    }

    if (!item) return;

    const existingItem = cart.items.find(i => i.id === itemId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.items.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            requiresPrescription: item.requiresPrescription
        });
    }

    updateCartCount();
    showAddedToCartMessage(item.name);
}

// Show added to cart message
function showAddedToCartMessage(itemName) {
    const message = document.createElement('div');
    message.className = 'cart-message';
    message.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${itemName} added to cart
    `;
    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 2000);
}

// Update cart count
function updateCartCount() {
    const count = cart.items.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Open cart modal
function openCart() {
    renderCart();
    cartModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Open prescription upload modal
function openPrescriptionUpload() {
    prescriptionModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Handle prescription upload
async function handlePrescriptionUpload(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('prescription', document.getElementById('prescriptionFile').files[0]);
    formData.append('notes', document.getElementById('prescriptionNotes').value);

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Prescription uploaded successfully! Our pharmacist will review it and contact you shortly.');
        prescriptionModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        prescriptionForm.reset();
    } catch (error) {
        alert('Failed to upload prescription. Please try again.');
    }
}

// Render cart
function renderCart() {
    if (cart.items.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        updateCartTotals();
        return;
    }

    const store = medicalStores.find(s => s.id === cart.storeId);
    cartItems.innerHTML = `
        <div class="cart-store">
            <h3>${store.name}</h3>
            <p><i class="fas fa-map-marker-alt"></i> ${store.address}</p>
        </div>
        ${cart.items.map(item => `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                    ${item.requiresPrescription ? 
                        '<span class="prescription-tag">Prescription Required</span>' : ''}
                </div>
                <div class="cart-item-actions">
                    <button onclick="updateCartItem(${item.id}, 'decrease')">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartItem(${item.id}, 'increase')">+</button>
                    <button onclick="removeFromCart(${item.id})" class="remove-item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('')}
    `;

    updateCartTotals();
}

// Update cart item
function updateCartItem(itemId, action) {
    const item = cart.items.find(item => item.id === itemId);
    if (!item) return;

    if (action === 'increase') {
        item.quantity++;
    } else {
        item.quantity--;
        if (item.quantity === 0) {
            removeFromCart(itemId);
            return;
        }
    }

    updateCartCount();
    renderCart();
}

// Remove from cart
function removeFromCart(itemId) {
    cart.items = cart.items.filter(item => item.id !== itemId);
    if (cart.items.length === 0) {
        cart.storeId = null;
    }
    updateCartCount();
    renderCart();
}

// Update cart totals
function updateCartTotals() {
    const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 0 ? 2.99 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;

    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('deliveryFee').textContent = `$${deliveryFee.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    cartTotal.textContent = `$${total.toFixed(2)}`;

    checkoutBtn.disabled = subtotal === 0;
}

// Handle checkout
async function handleCheckout() {
    if (!cart.items.length) return;

    const prescriptionRequired = cart.items.some(item => item.requiresPrescription);
    if (prescriptionRequired) {
        alert('Please upload prescription for prescription medicines before checkout.');
        openPrescriptionUpload();
        return;
    }

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Order placed successfully! Your medicines will be delivered soon.');
        cart.items = [];
        cart.storeId = null;
        updateCartCount();
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    } catch (error) {
        alert('Failed to place order. Please try again.');
    }
}
