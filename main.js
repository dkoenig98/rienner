// Navigation
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        toggleNav();
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                toggleNav();
            }
        });
    });

    // Close nav when clicking outside
    document.addEventListener('click', (event) => {
        if (nav.classList.contains('nav-active') && !nav.contains(event.target) && !burger.contains(event.target)) {
            toggleNav();
        }
    });
}

function resetNavbarOnLoad() {
    const navbar = document.getElementById('navbar');
    navbar.classList.remove('scrolled');
}

function toggleNav() {
    const nav = document.querySelector('.nav-links');
    const burger = document.querySelector('.burger');
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
    document.querySelectorAll('.nav-links li').forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
}

// Scroll effects
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const isHomePage = document.body.classList.contains('home-page');
    const isBookingPage = document.body.classList.contains('booking-page');

    if ((isHomePage || isBookingPage) && window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    document.querySelectorAll('.fade-in').forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('visible');
        }
    });

    updateLocationIndicator();
});

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    );
}

function updateLocationIndicator() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    const sections = document.querySelectorAll('section');
    const locationDots = document.querySelectorAll('.location-dot');

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            locationDots.forEach(dot => dot.classList.remove('active'));
            if (locationDots[index]) {
                locationDots[index].classList.add('active');
            }
        }
    });

    // Wenn wir am Ende der Seite sind, aktivieren wir den letzten Punkt
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        locationDots.forEach(dot => dot.classList.remove('active'));
        locationDots[locationDots.length - 1].classList.add('active');
    }
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Initialize
navSlide();
updateLocationIndicator();
window.addEventListener('load', updateLocationIndicator);

// Karte initialisieren
function initMap() {
    if (document.getElementById('map')) {
        var map = L.map('map').setView([47.72526, 13.848444], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([47.72526, 13.848444]).addTo(map)
            .bindPopup('Riennerhütte')
            .openPopup();
    }
}

resetNavbarOnLoad();