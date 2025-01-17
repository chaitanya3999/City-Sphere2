// Sample products data (replace with API call in production)
const products = [
    {
        id: 1,
        name: 'Fresh Organic Bananas',
        category: 'fruits',
        price: 2.99,
        unit: 'bunch',
        image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=300',
        inStock: true,
        isOnSale: false
    },
    {
        id: 2,
        name: 'Whole Milk',
        category: 'dairy',
        price: 3.49,
        unit: 'gallon',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=300',
        inStock: true,
        isOnSale: true,
        salePrice: 2.99
    },
    {
        id: 3,
        name: 'Fresh Bread',
        category: 'bakery',
        price: 2.49,
        unit: 'loaf',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300',
        inStock: true,
        isOnSale: false
    },
    // Add more products as needed
];

// Shopping cart
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const cartModal = document.getElementById('cartModal');
const cartButton = document.getElementById('cartButton');
const closeModal = document.querySelector('.close-modal');
const cartItems = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const grocerySearch = document.getElementById('grocerySearch');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const availabilityFilter = document.getElementById('availabilityFilter');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
    updateCartCount();
});

// Load products
function loadProducts(filters = {}) {
    showLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
        let filteredProducts = products;

        // Apply filters
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.category) {
            filteredProducts = filteredProducts.filter(product => 
                product.category === filters.category
            );
        }

        if (filters.availability === 'in-stock') {
            filteredProducts = filteredProducts.filter(product => product.inStock);
        } else if (filters.availability === 'deals') {
            filteredProducts = filteredProducts.filter(product => product.isOnSale);
        }

        // Apply sorting
        if (filters.sort) {
            switch (filters.sort) {
                case 'price-low':
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'name':
                    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                    break;
            }
        }

        renderProducts(filteredProducts);
        showLoading(false);
    }, 500);
}

// Render products grid
function renderProducts(products) {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">
                    ${product.isOnSale 
                        ? `<span class="sale-price">$${product.salePrice.toFixed(2)}</span>
                           <span class="original-price">$${product.price.toFixed(2)}</span>`
                        : `$${product.price.toFixed(2)}`
                    } / ${product.unit}
                </p>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${product.id}, 'decrease')">-</button>
                    <input type="number" class="quantity-input" value="1" min="1" max="99" id="quantity-${product.id}">
                    <button class="quantity-btn" onclick="updateQuantity(${product.id}, 'increase')">+</button>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Search and filters
    grocerySearch.addEventListener('input', debounce(() => {
        applyFilters();
    }, 300));

    categoryFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
    availabilityFilter.addEventListener('change', applyFilters);

    // Cart modal
    cartButton.addEventListener('click', openCart);
    closeModal.addEventListener('click', closeCart);
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            closeCart();
        }
    });

    // Checkout
    checkoutBtn.addEventListener('click', handleCheckout);
}

// Apply filters
function applyFilters() {
    const filters = {
        search: grocerySearch.value,
        category: categoryFilter.value,
        sort: sortFilter.value,
        availability: availabilityFilter.value
    };
    loadProducts(filters);
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
function updateQuantity(productId, action) {
    const input = document.getElementById(`quantity-${productId}`);
    let value = parseInt(input.value);

    if (action === 'increase') {
        value = Math.min(value + 1, 99);
    } else {
        value = Math.max(value - 1, 1);
    }

    input.value = value;
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById(`quantity-${productId}`).value);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.isOnSale ? product.salePrice : product.price,
            quantity: quantity,
            image: product.image
        });
    }

    updateCartCount();
    showAddedToCartMessage(product.name);
}

// Show added to cart message
function showAddedToCartMessage(productName) {
    const message = document.createElement('div');
    message.className = 'cart-message';
    message.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${productName} added to cart
    `;
    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 2000);
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Open cart modal
function openCart() {
    renderCart();
    cartModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close cart modal
function closeCart() {
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Render cart
function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        updateCartTotals();
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
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
    `).join('');

    updateCartTotals();
}

// Update cart item
function updateCartItem(productId, action) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    if (action === 'increase') {
        item.quantity++;
    } else {
        item.quantity--;
        if (item.quantity === 0) {
            removeFromCart(productId);
            return;
        }
    }

    updateCartCount();
    renderCart();
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
}

// Update cart totals
function updateCartTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 0 ? 5 : 0;
    const total = subtotal + deliveryFee;

    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('deliveryFee').textContent = `$${deliveryFee.toFixed(2)}`;
    cartTotal.textContent = `$${total.toFixed(2)}`;

    checkoutBtn.disabled = subtotal === 0;
}

// Handle checkout
async function handleCheckout() {
    if (!cart.length) return;

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Order placed successfully!');
        cart = [];
        updateCartCount();
        closeCart();
    } catch (error) {
        alert('Failed to place order. Please try again.');
    }
}
