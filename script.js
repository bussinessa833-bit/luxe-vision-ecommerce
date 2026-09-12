// ==================== PRODUCT DATABASE ==================== //
const products = [
    {
        id: 1,
        name: "Classic Aviator",
        category: "men",
        price: 189.99,
        oldPrice: 249.99,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
        rating: 5,
        badge: "Best Seller"
    },
    {
        id: 2,
        name: "Cat Eye Elegance",
        category: "women",
        price: 179.99,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1514633921057-bfd47cb42875?w=500&h=500&fit=crop",
        rating: 5,
        badge: null
    },
    {
        id: 3,
        name: "Wayfarer Classic",
        category: "sunglasses",
        price: 159.99,
        oldPrice: 199.99,
        image: "https://images.unsplash.com/photo-1538163521033-0c4694c9d4d0?w=500&h=500&fit=crop",
        rating: 4,
        badge: "Sale"
    },
    {
        id: 4,
        name: "Luxury Designer Frame",
        category: "luxury",
        price: 349.99,
        oldPrice: 499.99,
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop",
        rating: 5,
        badge: "Premium"
    },
    {
        id: 5,
        name: "Oversized Sunglasses",
        category: "women",
        price: 169.99,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
        rating: 4,
        badge: null
    },
    {
        id: 6,
        name: "Sport Sunglasses",
        category: "men",
        price: 199.99,
        oldPrice: 279.99,
        image: "https://images.unsplash.com/photo-1591076482161-eaf373fbb2b7?w=500&h=500&fit=crop",
        rating: 5,
        badge: "New"
    },
    {
        id: 7,
        name: "Retro Round Frames",
        category: "eyeglasses",
        price: 149.99,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1514633921057-bfd47cb42875?w=500&h=500&fit=crop",
        rating: 4,
        badge: null
    },
    {
        id: 8,
        name: "Gold Frame Elegance",
        category: "luxury",
        price: 299.99,
        oldPrice: 399.99,
        image: "https://images.unsplash.com/photo-1521695925474-444d7cb6658d?w=500&h=500&fit=crop",
        rating: 5,
        badge: "Exclusive"
    }
];

// ==================== STATE MANAGEMENT ==================== //
let cart = [];
let wishlist = [];
let currentFilter = 'all';

// ==================== LOCAL STORAGE ==================== //
function loadFromLocalStorage() {
    const savedCart = localStorage.getItem('luxeVisionCart');
    const savedWishlist = localStorage.getItem('luxeVisionWishlist');
    
    if (savedCart) cart = JSON.parse(savedCart);
    if (savedWishlist) wishlist = JSON.parse(savedWishlist);
    
    updateCartUI();
    updateWishlistUI();
}

function saveToLocalStorage() {
    localStorage.setItem('luxeVisionCart', JSON.stringify(cart));
    localStorage.setItem('luxeVisionWishlist', JSON.stringify(wishlist));
}

// ==================== DOM ELEMENTS ==================== //
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const wishlistBtn = document.getElementById('wishlistBtn');
const wishlistSidebar = document.getElementById('wishlistSidebar');
const closeWishlist = document.getElementById('closeWishlist');
const overlay = document.getElementById('overlay');
const searchBtn = document.getElementById('searchBtn');
const searchModal = document.getElementById('searchModal');
const closeSearch = document.getElementById('closeSearch');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const quickViewModal = document.getElementById('quickViewModal');
const closeQuickView = document.getElementById('closeQuickView');
const productsGrid = document.getElementById('productsGrid');
const backToTop = document.getElementById('backToTop');
const newsletterForm = document.getElementById('newsletterForm');

// ==================== NAVBAR & NAVIGATION ==================== //
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ==================== CART FUNCTIONALITY ==================== //
cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
});

closeCart.addEventListener('click', closeCartSidebar);

function closeCartSidebar() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveToLocalStorage();
    updateCartUI();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveToLocalStorage();
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveToLocalStorage();
            updateCartUI();
        }
    }
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-item" style="animation: slideIn 0.3s ease-out;">
                <div class="cart-item-image" style="background-image: url('${item.image}');"></div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-quantity">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span style="width: 30px; text-align: center;">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = '$' + total.toFixed(2);
}

// ==================== WISHLIST FUNCTIONALITY ==================== //
wishlistBtn.addEventListener('click', () => {
    wishlistSidebar.classList.add('active');
    overlay.classList.add('active');
});

closeWishlist.addEventListener('click', closeWishlistSidebar);

function closeWishlistSidebar() {
    wishlistSidebar.classList.remove('active');
    overlay.classList.remove('active');
}

function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = wishlist.find(item => item.id === productId);
    
    if (existingItem) {
        wishlist = wishlist.filter(item => item.id !== productId);
        showNotification(`${product.name} removed from wishlist`);
    } else {
        wishlist.push(product);
        showNotification(`${product.name} added to wishlist!`);
    }
    
    saveToLocalStorage();
    updateWishlistUI();
    updateProductCards();
}

function updateWishlistUI() {
    const wishlistItems = document.getElementById('wishlistItems');
    const wishlistCount = document.getElementById('wishlistCount');
    
    wishlistCount.textContent = wishlist.length;
    
    if (wishlist.length === 0) {
        wishlistItems.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Your wishlist is empty</p>';
        return;
    }
    
    wishlistItems.innerHTML = wishlist.map(item => `
        <div class="wishlist-item" style="animation: slideIn 0.3s ease-out;">
            <div class="wishlist-item-image" style="background-image: url('${item.image}');"></div>
            <div class="wishlist-item-info">
                <div class="wishlist-item-name">${item.name}</div>
                <div class="wishlist-item-price">$${item.price.toFixed(2)}</div>
                <button class="btn btn-primary" onclick="addToCart(${item.id})" style="width: 100%; padding: 8px; margin-top: 0.5rem;">Add to Cart</button>
            </div>
            <button class="remove-btn" onclick="toggleWishlist(${item.id})">✕</button>
        </div>
    `).join('');
}

// ==================== SEARCH FUNCTIONALITY ==================== //
searchBtn.addEventListener('click', () => {
    searchModal.classList.add('active');
    searchInput.focus();
});

closeSearch.addEventListener('click', () => {
    searchModal.classList.remove('active');
    searchResults.innerHTML = '';
    searchInput.value = '';
});

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    if (query.length === 0) {
        searchResults.innerHTML = '';
        return;
    }
    
    const results = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p style="text-align: center; padding: 1rem; color: #999;">No products found</p>';
        return;
    }
    
    searchResults.innerHTML = results.map(product => `
        <div class="search-result-item" onclick="addToCart(${product.id}); searchModal.classList.remove('active');">
            <strong>${product.name}</strong>
            <p style="font-size: 0.9rem; color: #666;">$${product.price.toFixed(2)}</p>
        </div>
    `).join('');
});

// Close search modal when clicking outside
searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
        searchModal.classList.remove('active');
    }
});

// ==================== QUICK VIEW MODAL ==================== //
closeQuickView.addEventListener('click', () => {
    quickViewModal.classList.remove('active');
});

quickViewModal.addEventListener('click', (e) => {
    if (e.target === quickViewModal) {
        quickViewModal.classList.remove('active');
    }
});

function showQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const quickViewContent = document.getElementById('quickViewContent');
    quickViewContent.innerHTML = `
        <div class="quick-view-image" style="background-image: url('${product.image}');"></div>
        <div class="quick-view-details">
            <h2>${product.name}</h2>
            <div class="product-price">
                <span class="price-current">$${product.price.toFixed(2)}</span>
                ${product.oldPrice ? `<span class="price-old">$${product.oldPrice.toFixed(2)}</span>` : ''}
            </div>
            <div class="product-rating">${'★'.repeat(product.rating)}${'☆'.repeat(5-product.rating)}</div>
            <p>Premium eyewear crafted with precision and elegance. Perfect for any occasion and complements any style.</p>
            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-primary" onclick="addToCart(${product.id}); quickViewModal.classList.remove('active');">Add to Cart</button>
                <button class="btn btn-secondary" onclick="toggleWishlist(${product.id});">Wishlist</button>
            </div>
        </div>
    `;
    
    quickViewModal.classList.add('active');
}

// ==================== PRODUCT RENDERING ==================== //
function renderProducts(filter = 'all') {
    let filteredProducts = products;
    
    if (filter !== 'all') {
        filteredProducts = products.filter(p => p.category === filter);
    }
    
    productsGrid.innerHTML = filteredProducts.map((product, index) => `
        <div class="product-card" style="animation: slideIn 0.3s ease-out; animation-delay: ${index * 0.05}s;">
            <div class="product-image-container">
                <div class="product-image" style="background-image: url('${product.image}');"></div>
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="wishlist-icon ${wishlist.some(w => w.id === product.id) ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
                    ❤
                </div>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                    <span class="price-current">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="price-old">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-rating">${'★'.repeat(product.rating)}${'☆'.repeat(5-product.rating)}</div>
                <div class="product-actions">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                    <button class="quick-view-btn" onclick="showQuickView(${product.id})">Quick View</button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateProductCards() {
    document.querySelectorAll('.wishlist-icon').forEach((icon, index) => {
        const product = products[index];
        if (wishlist.some(w => w.id === product.id)) {
            icon.classList.add('active');
        } else {
            icon.classList.remove('active');
        }
    });
}

// ==================== COUNTDOWN TIMER ==================== //
function startCountdown() {
    const endDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000); // 3 days from now
    
    function updateTimer() {
        const now = new Date().getTime();
        const distance = endDate - now;
        
        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// ==================== SCROLL FUNCTIONALITY ==================== //
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Close sidebars when clicking overlay
overlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    wishlistSidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// ==================== NEWSLETTER ==================== //
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    if (validateEmail(email)) {
        showNotification('Thank you for subscribing!');
        newsletterForm.reset();
    } else {
        showNotification('Please enter a valid email', 'error');
    }
});

// ==================== FORM VALIDATION ==================== //
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ==================== NOTIFICATIONS ==================== //
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 2500;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-in reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== SMOOTH SCROLL ANIMATION ==================== //
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(element);
});

// ==================== CHECKOUT BUTTON ==================== //
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    showNotification('Redirecting to checkout...');
    setTimeout(() => {
        // In a real application, this would redirect to a checkout page
        closeCartSidebar();
    }, 1500);
});

// ==================== INITIALIZATION ==================== //
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    renderProducts();
    startCountdown();
});

// ==================== UTILITY FUNCTION ==================== //
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
