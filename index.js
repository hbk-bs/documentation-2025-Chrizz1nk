// DOM-Elemente
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const filterButtons = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const worksGrid = document.getElementById('worksGrid');

// Navigation Toggle für Mobile
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Navigation Links - Smooth Scroll
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
        // Mobile Navigation schließen
        navMenu.classList.remove('active');
    });
});

// Header Scroll-Effekt
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.9)';
    }
});

// Info-Section Toggle Funktionalität - NEU
const infoHeader = document.getElementById('infoHeader');
const infoCard = document.getElementById('infoCard');
const infoContent = document.getElementById('infoContent');

infoHeader.addEventListener('click', () => {
    infoCard.classList.toggle('expanded');
    infoContent.classList.toggle('expanded');
});

// Filter-Funktionalität
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Aktive Klasse entfernen
        filterButtons.forEach(b => b.classList.remove('active'));
        // Neue aktive Klasse hinzufügen
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        filterWorks(filterValue);
    });
});

// Werke filtern
function filterWorks(filter) {
    workCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            card.classList.remove('hidden');
            // Animation hinzufügen
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.classList.add('hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
        }
    });
}

// Such-Funktionalität
function searchWorks(query) {
    const searchTerm = query.toLowerCase();
    
    workCards.forEach(card => {
        const title = card.querySelector('.work-title').textContent.toLowerCase();
        const description = card.querySelector('.work-description').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.classList.remove('hidden');
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        } else {
            card.classList.add('hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
        }
    });
}

// Suche Event Listener (falls vorhanden)
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (query.length > 0) {
            searchWorks(query);
            // Alle Filter-Buttons deaktivieren während der Suche
            filterButtons.forEach(btn => btn.classList.remove('active'));
        } else {
            // Wenn Suchfeld leer ist, alle Werke anzeigen
            workCards.forEach(card => {
                card.classList.remove('hidden');
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
            // "Alle" Filter wieder aktivieren
            const allFilter = document.querySelector('[data-filter="all"]');
            if (allFilter) allFilter.classList.add('active');
        }
    });
}

if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value;
        if (query.length > 0) {
            searchWorks(query);
        }
    });
}

// Enter-Taste für Suche
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value;
            if (query.length > 0) {
                searchWorks(query);
            }
        }
    });
}

// Scroll-Animationen für Werke
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);