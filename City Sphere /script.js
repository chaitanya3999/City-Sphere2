// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navWrapper = document.querySelector('.nav-wrapper');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.querySelector('.newsletter-form');
const greeting = document.querySelector('.greeting');
const timeDisplay = document.querySelector('.current-time');

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navWrapper.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navWrapper.contains(e.target)) {
        hamburger.classList.remove('active');
        navWrapper.classList.remove('active');
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a, .nav-buttons a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navWrapper.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll Animation
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .feature-card, .step-card, .place-card, .event-card, .about-content');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
animateOnScroll(); // Initial check

// Time-based Greeting
function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    
    // Update time display
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    timeDisplay.textContent = timeString;

    // Update greeting based on time
    let greetingText = '';
    let greetingIcon = '';

    if (hour >= 5 && hour < 12) {
        greetingText = 'Good Morning!';
        greetingIcon = '☀️';
    } else if (hour >= 12 && hour < 17) {
        greetingText = 'Good Afternoon!';
        greetingIcon = '🌤️';
    } else if (hour >= 17 && hour < 21) {
        greetingText = 'Good Evening!';
        greetingIcon = '🌅';
    } else {
        greetingText = 'Good Night!';
        greetingIcon = '🌙';
    }

    greeting.innerHTML = `${greetingIcon} ${greetingText}`;
}

// Update greeting and time immediately and then every minute
updateGreeting();
setInterval(updateGreeting, 60000);

// Notification System
const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'notification animate';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
};

// Contact Form Submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        
        // Here you would typically send the data to a server
        console.log('Form submitted:', Object.fromEntries(formData));
        
        showNotification('Thank you! Your message has been sent.');
        contactForm.reset();
    });
}

// Newsletter Subscription
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Here you would typically send this to your backend
        console.log('Newsletter subscription:', email);
        
        // Show success message
        showNotification('Thank you for subscribing to our newsletter!');
        
        // Reset form
        newsletterForm.reset();
    });
}

// Add loading animation to images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.place-image, .event-image');
    images.forEach(img => {
        img.classList.add('loaded');
    });
});

// Search functionality
const searchBox = document.querySelector('.search-box input');
if (searchBox) {
    searchBox.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.place-card, .event-card');
        
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Dynamic copyright year
const yearSpan = document.querySelector('.footer-bottom');
if (yearSpan) {
    const currentYear = new Date().getFullYear();
    yearSpan.innerHTML = `<p>&copy; ${currentYear} City Sphere. All rights reserved.</p>`;
}
