// Sample restaurants data (replace with API call in production)
const restaurants = [
    {
        id: 1,
        name: 'La Piazza',
        cuisine: 'italian',
        rating: 4.5,
        reviews: 328,
        deliveryTime: '30-40',
        priceRange: '$$',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300',
        dietary: ['vegetarian'],
        featured: true,
        menu: {
            'Starters': [
                { id: 101, name: 'Bruschetta', price: 8.99, description: 'Toasted bread with tomatoes and herbs' },
                { id: 102, name: 'Caprese Salad', price: 10.99, description: 'Fresh mozzarella with tomatoes and basil' }
            ],
            'Pasta': [
                { id: 201, name: 'Spaghetti Carbonara', price: 16.99, description: 'Classic carbonara with pancetta' },
                { id: 202, name: 'Penne Arrabbiata', price: 14.99, description: 'Spicy tomato sauce', vegetarian: true }
            ],
            'Pizza': [
                { id: 301, name: 'Margherita', price: 15.99, description: 'Classic tomato and mozzarella', vegetarian: true },
                { id: 302, name: 'Pepperoni', price: 17.99, description: 'Spicy pepperoni with mozzarella' }
            ]
        }
    },
    {
        id: 2,
        name: 'Taj Mahal',
        cuisine: 'indian',
        rating: 4.7,
        reviews: 425,
        deliveryTime: '40-50',
        priceRange: '$$',
        image: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=300',
        dietary: ['vegetarian', 'vegan'],
        menu: {
            'Starters': [
                { id: 401, name: 'Samosas', price: 6.99, description: 'Crispy pastries with spiced potatoes', vegetarian: true },
                { id: 402, name: 'Onion Bhaji', price: 5.99, description: 'Crispy onion fritters', vegan: true }
            ],
            'Main Course': [
                { id: 501, name: 'Butter Chicken', price: 18.99, description: 'Creamy tomato curry with chicken' },
                { id: 502, name: 'Palak Paneer', price: 16.99, description: 'Spinach curry with cottage cheese', vegetarian: true }
            ]
        }
    },
    // Add more restaurants as needed
];

// DOM Elements
const restaurantsGrid = document.getElementById('restaurantsGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const restaurantModal = document.getElementById('restaurantModal');
const cartModal = document.getElementById('cartModal');
const cartButton = document.getElementById('cartButton');
const closeModals = document.querySelectorAll('.close-modal');
const restaurantDetails = document.getElementById('restaurantDetails');
const menuCategories = document.getElementById('menuCategories');
const menuItems = document.getElementById('menuItems');
const cartItems = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const restaurantSearch = document.getElementById('restaurantSearch');
const cuisineFilter = document.getElementById('cuisineFilter');
const sortFilter = document.getElementById('sortFilter');
const dietaryFilter = document.getElementById('dietaryFilter');

// Shopping cart
let cart = {
    items: [],
    restaurantId: null
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadRestaurants();
    setupEventListeners();
    updateCartCount();
});

// Load restaurants
function loadRestaurants(filters = {}) {
    showLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
        let filteredRestaurants = restaurants;

        // Apply filters
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredRestaurants = filteredRestaurants.filter(restaurant => 
                restaurant.name.toLowerCase().includes(searchTerm) ||
                restaurant.cuisine.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.cuisine) {
            filteredRestaurants = filteredRestaurants.filter(restaurant => 
                restaurant.cuisine === filters.cuisine
            );
        }

        if (filters.dietary) {
            filteredRestaurants = filteredRestaurants.filter(restaurant => 
                restaurant.dietary.includes(filters.dietary)
            );
        }

        // Apply sorting
        if (filters.sort) {
            switch (filters.sort) {
                case 'rating':
                    filteredRestaurants.sort((a, b) => b.rating - a.rating);
                    break;
                case 'delivery-time':
                    filteredRestaurants.sort((a, b) => {
                        const aTime = parseInt(a.deliveryTime.split('-')[0]);
                        const bTime = parseInt(b.deliveryTime.split('-')[0]);
                        return aTime - bTime;
                    });
                    break;
                case 'price-low':
                    filteredRestaurants.sort((a, b) => a.priceRange.length - b.priceRange.length);
                    break;
                case 'price-high':
                    filteredRestaurants.sort((a, b) => b.priceRange.length - a.priceRange.length);
                    break;
            }
        }

        renderRestaurants(filteredRestaurants);
        showLoading(false);
    }, 500);
}

// Render restaurants grid
function renderRestaurants(restaurants) {
    restaurantsGrid.innerHTML = restaurants.map(restaurant => `
        <div class="restaurant-card" onclick="openRestaurant(${restaurant.id})">
            <img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-image">
            <div class="restaurant-info">
                <h3 class="restaurant-name">${restaurant.name}</h3>
                <p class="restaurant-cuisine">${restaurant.cuisine}</p>
                <div class="restaurant-rating">
                    <div class="rating-stars">
                        ${getRatingStars(restaurant.rating)}
                    </div>
                    <span class="rating-count">(${restaurant.reviews})</span>
                </div>
                <p class="restaurant-delivery">
                    <i class="fas fa-clock"></i> ${restaurant.deliveryTime} mins
                </p>
                <p class="restaurant-price">${restaurant.priceRange}</p>
                ${restaurant.dietary.map(diet => 
                    `<span class="dietary-tag">${diet}</span>`
                ).join('')}
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
    restaurantSearch.addEventListener('input', debounce(() => {
        applyFilters();
    }, 300));

    cuisineFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
    dietaryFilter.addEventListener('change', applyFilters);

    // Modals
    closeModals.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            restaurantModal.style.display = 'none';
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === restaurantModal || e.target === cartModal) {
            restaurantModal.style.display = 'none';
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    cartButton.addEventListener('click', openCart);
    checkoutBtn.addEventListener('click', handleCheckout);
}

// Apply filters
function applyFilters() {
    const filters = {
        search: restaurantSearch.value,
        cuisine: cuisineFilter.value,
        sort: sortFilter.value,
        dietary: dietaryFilter.value
    };
    loadRestaurants(filters);
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

// Open restaurant menu
function openRestaurant(restaurantId) {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;

    restaurantDetails.innerHTML = `
        <div class="restaurant-header">
            <img src="${restaurant.image}" alt="${restaurant.name}">
            <div class="restaurant-header-info">
                <h2>${restaurant.name}</h2>
                <p>${restaurant.cuisine}</p>
                <div class="restaurant-rating">
                    ${getRatingStars(restaurant.rating)}
                    <span>(${restaurant.reviews} reviews)</span>
                </div>
                <p><i class="fas fa-clock"></i> ${restaurant.deliveryTime} mins</p>
                <p>${restaurant.priceRange}</p>
            </div>
        </div>
    `;

    menuCategories.innerHTML = Object.keys(restaurant.menu).map(category => `
        <button class="menu-category" onclick="showMenuCategory('${category}')">${category}</button>
    `).join('');

    showMenuCategory(Object.keys(restaurant.menu)[0], restaurant);

    restaurantModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Show menu category
function showMenuCategory(category, restaurant) {
    const items = restaurants.find(r => r.id === restaurant.id).menu[category];
    
    menuItems.innerHTML = items.map(item => `
        <div class="menu-item">
            <div class="menu-item-info">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <p class="menu-item-price">$${item.price.toFixed(2)}</p>
                ${item.vegetarian ? '<span class="dietary-tag">Vegetarian</span>' : ''}
                ${item.vegan ? '<span class="dietary-tag">Vegan</span>' : ''}
            </div>
            <button class="add-item-btn" onclick="addToCart(${restaurant.id}, ${item.id})">
                Add to Cart
            </button>
        </div>
    `).join('');
}

// Add to cart
function addToCart(restaurantId, itemId) {
    // Check if adding from a different restaurant
    if (cart.restaurantId && cart.restaurantId !== restaurantId) {
        if (!confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
            return;
        }
        cart.items = [];
    }

    cart.restaurantId = restaurantId;
    const restaurant = restaurants.find(r => r.id === restaurantId);
    let item;
    
    // Find item in restaurant menu
    for (const category in restaurant.menu) {
        const foundItem = restaurant.menu[category].find(i => i.id === itemId);
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
            quantity: 1
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

// Render cart
function renderCart() {
    if (cart.items.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        updateCartTotals();
        return;
    }

    const restaurant = restaurants.find(r => r.id === cart.restaurantId);
    cartItems.innerHTML = `
        <div class="cart-restaurant">
            <h3>${restaurant.name}</h3>
            <p>${restaurant.cuisine} • ${restaurant.deliveryTime} mins</p>
        </div>
        ${cart.items.map(item => `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
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
        cart.restaurantId = null;
    }
    updateCartCount();
    renderCart();
}

// Update cart totals
function updateCartTotals() {
    const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 0 ? 4.99 : 0;
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

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Order placed successfully! Your food will arrive in ' + 
              restaurants.find(r => r.id === cart.restaurantId).deliveryTime + ' minutes.');
        cart.items = [];
        cart.restaurantId = null;
        updateCartCount();
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    } catch (error) {
        alert('Failed to place order. Please try again.');
    }
}
