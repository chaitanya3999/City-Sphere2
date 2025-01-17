// Sample vendors data (replace with API call in production)
const vendors = [
    {
        id: 1,
        name: 'Green Valley Farms',
        type: 'farmers',
        rating: 4.8,
        reviews: 342,
        distance: '3.2',
        address: 'Local Farmers Market, North End',
        image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=300',
        featured: true,
        organic: true,
        inventory: {
            'Vegetables': [
                { id: 101, name: 'Fresh Tomatoes', price: 2.99, unit: 'lb', organic: true, inSeason: true },
                { id: 102, name: 'Carrots', price: 1.99, unit: 'lb', organic: true }
            ],
            'Leafy Greens': [
                { id: 201, name: 'Organic Spinach', price: 3.99, unit: 'bunch', organic: true },
                { id: 202, name: 'Fresh Lettuce', price: 2.49, unit: 'head', organic: true }
            ],
            'Herbs': [
                { id: 301, name: 'Fresh Basil', price: 1.99, unit: 'bunch', organic: true },
                { id: 302, name: 'Mint', price: 1.49, unit: 'bunch', organic: true }
            ]
        }
    },
    {
        id: 2,
        name: 'City Fresh Market',
        type: 'wholesale',
        rating: 4.6,
        reviews: 256,
        distance: '1.8',
        address: 'Downtown Market District',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300',
        featured: true,
        inventory: {
            'Vegetables': [
                { id: 401, name: 'Bell Peppers', price: 1.49, unit: 'piece', inSeason: true },
                { id: 402, name: 'Onions', price: 0.99, unit: 'lb' }
            ],
            'Fruits': [
                { id: 501, name: 'Fresh Apples', price: 2.99, unit: 'lb', inSeason: true },
                { id: 502, name: 'Bananas', price: 0.59, unit: 'lb' }
            ]
        }
    },
    // Add more vendors as needed
];

// Seasonal produce data
const seasonalProduce = [
    {
        id: 1,
        name: 'Fresh Strawberries',
        price: 4.99,
        unit: 'box',
        image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=300',
        discount: '20% OFF'
    },
    {
        id: 2,
        name: 'Organic Asparagus',
        price: 3.99,
        unit: 'bunch',
        image: 'https://images.unsplash.com/photo-1515471209610-dae1c92d8777?auto=format&fit=crop&w=300',
        discount: 'Buy 2 Get 1'
    },
    // Add more seasonal items
];

// DOM Elements
const vendorCards = document.getElementById('vendorCards');
const seasonalGrid = document.getElementById('seasonalGrid');
const produceGrid = document.getElementById('produceGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const vendorModal = document.getElementById('vendorModal');
const cartModal = document.getElementById('cartModal');
const cartButton = document.getElementById('cartButton');
const closeModals = document.querySelectorAll('.close-modal');
const vendorDetails = document.getElementById('vendorDetails');
const produceCategories = document.getElementById('produceCategories');
const vendorItems = document.getElementById('vendorItems');
const cartItems = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const produceSearch = document.getElementById('produceSearch');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const vendorFilter = document.getElementById('vendorFilter');

// Shopping cart
let cart = {
    items: [],
    vendorId: null
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadVendors();
    loadSeasonalProduce();
    setupEventListeners();
    updateCartCount();
});

// Load vendors
function loadVendors(filters = {}) {
    showLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
        let filteredVendors = vendors;

        // Apply filters
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredVendors = filteredVendors.filter(vendor => 
                vendor.name.toLowerCase().includes(searchTerm) ||
                vendor.type.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.type) {
            filteredVendors = filteredVendors.filter(vendor => 
                vendor.type === filters.type
            );
        }

        // Apply sorting
        if (filters.sort) {
            switch (filters.sort) {
                case 'rating':
                    filteredVendors.sort((a, b) => b.rating - a.rating);
                    break;
                case 'distance':
                    filteredVendors.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
                    break;
            }
        }

        renderVendors(filteredVendors);
        showLoading(false);
    }, 500);
}

// Load seasonal produce
function loadSeasonalProduce() {
    seasonalGrid.innerHTML = seasonalProduce.map(item => `
        <div class="seasonal-card">
            <div class="discount-badge">${item.discount}</div>
            <img src="${item.image}" alt="${item.name}" class="seasonal-image">
            <div class="seasonal-info">
                <h3>${item.name}</h3>
                <p class="price">$${item.price}/${item.unit}</p>
                <button class="add-to-cart" onclick="addToCart(null, ${item.id}, true)">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Render vendors grid
function renderVendors(vendors) {
    // Render featured vendors
    const featuredVendors = vendors.filter(v => v.featured);
    vendorCards.innerHTML = featuredVendors.map(vendor => `
        <div class="vendor-card" onclick="openVendor(${vendor.id})">
            <img src="${vendor.image}" alt="${vendor.name}" class="vendor-image">
            <div class="vendor-info">
                <h3 class="vendor-name">${vendor.name}</h3>
                <p class="vendor-type">${vendor.type}</p>
                <div class="vendor-rating">
                    <div class="rating-stars">
                        ${getRatingStars(vendor.rating)}
                    </div>
                    <span class="rating-count">(${vendor.reviews})</span>
                </div>
                <p class="vendor-distance">
                    <i class="fas fa-route"></i> ${vendor.distance} km
                </p>
                ${vendor.organic ? '<span class="organic-tag">Organic</span>' : ''}
            </div>
        </div>
    `).join('');

    // Render all produce items
    let allProduce = [];
    vendors.forEach(vendor => {
        Object.values(vendor.inventory).forEach(category => {
            category.forEach(item => {
                allProduce.push({
                    ...item,
                    vendorId: vendor.id,
                    vendorName: vendor.name
                });
            });
        });
    });

    produceGrid.innerHTML = allProduce.map(item => `
        <div class="produce-card">
            <div class="produce-info">
                <h3>${item.name}</h3>
                <p class="vendor">by ${item.vendorName}</p>
                <p class="price">$${item.price}/${item.unit}</p>
                ${item.organic ? '<span class="organic-tag">Organic</span>' : ''}
                ${item.inSeason ? '<span class="season-tag">In Season</span>' : ''}
            </div>
            <div class="quantity-control">
                <button class="quantity-btn" onclick="updateQuantity(${item.vendorId}, ${item.id}, 'decrease')">-</button>
                <input type="number" class="quantity-input" value="1" min="1" max="99" id="quantity-${item.id}">
                <button class="quantity-btn" onclick="updateQuantity(${item.vendorId}, ${item.id}, 'increase')">+</button>
            </div>
            <button class="add-to-cart" onclick="addToCart(${item.vendorId}, ${item.id})">
                Add to Cart
            </button>
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
    produceSearch.addEventListener('input', debounce(() => {
        applyFilters();
    }, 300));

    categoryFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
    vendorFilter.addEventListener('change', applyFilters);

    // Modals
    closeModals.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            vendorModal.style.display = 'none';
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === vendorModal || e.target === cartModal) {
            vendorModal.style.display = 'none';
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
        search: produceSearch.value,
        category: categoryFilter.value,
        sort: sortFilter.value,
        type: vendorFilter.value
    };
    loadVendors(filters);
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

// Update quantity
function updateQuantity(vendorId, itemId, action) {
    const input = document.getElementById(`quantity-${itemId}`);
    let value = parseInt(input.value);

    if (action === 'increase') {
        value = Math.min(value + 1, 99);
    } else {
        value = Math.max(value - 1, 1);
    }

    input.value = value;
}

// Add to cart
function addToCart(vendorId, itemId, isSeasonal = false) {
    if (isSeasonal) {
        const item = seasonalProduce.find(i => i.id === itemId);
        if (!item) return;

        const existingItem = cart.items.find(i => i.id === itemId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.items.push({
                id: item.id,
                name: item.name,
                price: item.price,
                unit: item.unit,
                quantity: 1,
                seasonal: true
            });
        }
    } else {
        // Check if adding from a different vendor
        if (cart.vendorId && cart.vendorId !== vendorId) {
            if (!confirm('Adding items from a different vendor will clear your current cart. Continue?')) {
                return;
            }
            cart.items = [];
        }

        cart.vendorId = vendorId;
        const vendor = vendors.find(v => v.id === vendorId);
        let item;
        
        // Find item in vendor inventory
        for (const category in vendor.inventory) {
            const foundItem = vendor.inventory[category].find(i => i.id === itemId);
            if (foundItem) {
                item = foundItem;
                break;
            }
        }

        if (!item) return;

        const quantity = parseInt(document.getElementById(`quantity-${itemId}`).value);
        const existingItem = cart.items.find(i => i.id === itemId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                id: item.id,
                name: item.name,
                price: item.price,
                unit: item.unit,
                quantity: quantity,
                organic: item.organic
            });
        }
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

// Open vendor details
function openVendor(vendorId) {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    vendorDetails.innerHTML = `
        <div class="vendor-header">
            <img src="${vendor.image}" alt="${vendor.name}">
            <div class="vendor-header-info">
                <h2>${vendor.name}</h2>
                <p>${vendor.type}</p>
                <div class="vendor-rating">
                    ${getRatingStars(vendor.rating)}
                    <span>(${vendor.reviews} reviews)</span>
                </div>
                <p><i class="fas fa-route"></i> ${vendor.distance} km away</p>
                ${vendor.organic ? '<span class="organic-tag">Organic Certified</span>' : ''}
            </div>
        </div>
    `;

    produceCategories.innerHTML = Object.keys(vendor.inventory).map(category => `
        <button class="produce-category" onclick="showProduceCategory('${category}')">${category}</button>
    `).join('');

    showProduceCategory(Object.keys(vendor.inventory)[0], vendor);

    vendorModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Show produce category
function showProduceCategory(category, vendor) {
    const items = vendors.find(v => v.id === vendor.id).inventory[category];
    
    vendorItems.innerHTML = items.map(item => `
        <div class="produce-item">
            <div class="produce-item-info">
                <h4>${item.name}</h4>
                <p class="price">$${item.price}/${item.unit}</p>
                ${item.organic ? '<span class="organic-tag">Organic</span>' : ''}
                ${item.inSeason ? '<span class="season-tag">In Season</span>' : ''}
            </div>
            <div class="quantity-control">
                <button class="quantity-btn" onclick="updateQuantity(${vendor.id}, ${item.id}, 'decrease')">-</button>
                <input type="number" class="quantity-input" value="1" min="1" max="99" id="modal-quantity-${item.id}">
                <button class="quantity-btn" onclick="updateQuantity(${vendor.id}, ${item.id}, 'increase')">+</button>
            </div>
            <button class="add-to-cart" onclick="addToCart(${vendor.id}, ${item.id})">
                Add to Cart
            </button>
        </div>
    `).join('');
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

    let cartHTML = '';
    if (cart.vendorId) {
        const vendor = vendors.find(v => v.id === cart.vendorId);
        cartHTML += `
            <div class="cart-vendor">
                <h3>${vendor.name}</h3>
                <p>${vendor.type} • ${vendor.distance} km away</p>
            </div>
        `;
    }

    cartHTML += cart.items.map(item => `
        <div class="cart-item">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>$${item.price}/${item.unit} x ${item.quantity}</p>
                ${item.organic ? '<span class="organic-tag">Organic</span>' : ''}
                ${item.seasonal ? '<span class="season-tag">Seasonal</span>' : ''}
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
    `).join('');

    cartItems.innerHTML = cartHTML;
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
        cart.vendorId = null;
    }
    updateCartCount();
    renderCart();
}

// Update cart totals
function updateCartTotals() {
    const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 0 ? 3.99 : 0;
    const total = subtotal + deliveryFee;

    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('deliveryFee').textContent = `$${deliveryFee.toFixed(2)}`;
    cartTotal.textContent = `$${total.toFixed(2)}`;

    checkoutBtn.disabled = subtotal === 0;
}

// Handle checkout
async function handleCheckout() {
    if (!cart.items.length) return;

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Order placed successfully! Your fresh produce will be delivered soon.');
        cart.items = [];
        cart.vendorId = null;
        updateCartCount();
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    } catch (error) {
        alert('Failed to place order. Please try again.');
    }
}
