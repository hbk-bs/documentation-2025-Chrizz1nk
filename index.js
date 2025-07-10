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
        const category = card.querySelector('.work-category').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm)) {
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

// Suche Event Listener
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
        document.querySelector('[data-filter="all"]').classList.add('active');
    }
});

searchBtn.addEventListener('click', () => {
    const query = searchInput.value;
    if (query.length > 0) {
        searchWorks(query);
    }
});

// Enter-Taste für Suche
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value;
        if (query.length > 0) {
            searchWorks(query);
        }
    }
});

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

// Alle Werk-Karten für Scroll-Animation registrieren
workCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Parallax-Effekt für Hero-Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Dynamische Werk-Karten hinzufügen (Beispiel-Funktion)
function addWork(title, description, category, year, link) {
    const worksGrid = document.getElementById('worksGrid');
    
    const workCard = document.createElement('div');
    workCard.className = 'work-card';
    workCard.setAttribute('data-category', category.toLowerCase());
    
    // Emoji für Kategorie bestimmen
    let emoji = '📄';
    switch(category.toLowerCase()) {
        case 'writing':
        case 'schreiben':
            emoji = '📝';
            break;
        case 'art':
        case 'kunst':
            emoji = '🎨';
            break;
        case 'projects':
        case 'projekte':
            emoji = '💻';
            break;
    }
    
    workCard.innerHTML = `
        <div class="work-image">
            <div class="placeholder-image">${emoji}</div>
        </div>
        <div class="work-info">
            <h3 class="work-title">${title}</h3>
            <p class="work-description">${description}</p>
            <div class="work-meta">
                <span class="work-date">${year}</span>
                <span class="work-category">${category}</span>
            </div>
            <a href="${link}" class="work-link">Ansehen</a>
        </div>
    `;
    
    worksGrid.appendChild(workCard);
    
    // Neue Karte für Animation registrieren
    workCard.style.opacity = '0';
    workCard.style.transform = 'translateY(30px)';
    workCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(workCard);
    
    // Filter-Buttons aktualisieren
    updateFilterButtons();
}

// Filter-Buttons basierend auf vorhandenen Kategorien aktualisieren
function updateFilterButtons() {
    const categories = new Set();
    document.querySelectorAll('.work-card').forEach(card => {
        const category = card.getAttribute('data-category');
        if (category) {
            categories.add(category);
        }
    });
    
    // Hier könnten Sie zusätzliche Filter-Buttons dynamisch hinzufügen
    // wenn neue Kategorien erkannt werden
}

// Werk-Karten Hover-Effekte
workCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Lazy Loading für Bilder (falls echte Bilder verwendet werden)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    // Alle Animationen starten
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Lazy Loading initialisieren
    lazyLoadImages();
    
    // Erste Animation für Hero-Section
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 500);
    }
});

// Utility-Funktionen für erweiterte Funktionalität

// Werk-Karten sortieren
function sortWorks(criteria) {
    const container = document.getElementById('worksGrid');
    const cards = Array.from(container.children);
    
    cards.sort((a, b) => {
        switch(criteria) {
            case 'title':
                return a.querySelector('.work-title').textContent.localeCompare(
                    b.querySelector('.work-title').textContent
                );
            case 'date':
                return parseInt(b.querySelector('.work-date').textContent) - 
                       parseInt(a.querySelector('.work-date').textContent);
            case 'category':
                return a.querySelector('.work-category').textContent.localeCompare(
                    b.querySelector('.work-category').textContent
                );
            default:
                return 0;
        }
    });
    
    // Karten neu anordnen
    cards.forEach(card => container.appendChild(card));
}

// Dark/Light Mode Toggle (optional)
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Theme aus localStorage laden
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
}

// Responsive Breakpoint Detection
function handleResize() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Mobile-spezifische Anpassungen
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
        // Desktop-spezifische Anpassungen
        navMenu.classList.remove('active');
    }
}

// Resize Event Listener
window.addEventListener('resize', handleResize);
handleResize(); // Initial ausführen

// Statistiken für das Archiv
function getArchiveStats() {
    const totalWorks = document.querySelectorAll('.work-card').length;
    const categories = new Set();
    
    document.querySelectorAll('.work-card').forEach(card => {
        const category = card.getAttribute('data-category');
        if (category) categories.add(category);
    });
    
    return {
        totalWorks: totalWorks,
        categories: Array.from(categories),
        categoryCount: categories.size
    };
}

// Werk-Details Modal (optional - kann später erweitert werden)
function showWorkDetails(workCard) {
    const title = workCard.querySelector('.work-title').textContent;
    const description = workCard.querySelector('.work-description').textContent;
    const category = workCard.querySelector('.work-category').textContent;
    const date = workCard.querySelector('.work-date').textContent;
    
    // Hier könnte ein Modal mit detaillierten Informationen geöffnet werden
    console.log('Werk-Details:', { title, description, category, date });
}

// Event Listener für Werk-Karten Klicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('work-link')) {
        // Hier können Sie Custom-Actions für Werk-Links hinzufügen
        console.log('Werk-Link geklickt:', e.target.href);
    }
});

// Performance-Optimierung: Debounce für Suche
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

// Debounced Search
const debouncedSearch = debounce((query) => {
    searchWorks(query);
}, 300);

// Suche mit Debounce aktualisieren
searchInput.removeEventListener('input', searchWorks);
searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.length > 0) {
        debouncedSearch(query);
        filterButtons.forEach(btn => btn.classList.remove('active'));
    } else {
        workCards.forEach(card => {
            card.classList.remove('hidden');
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
        document.querySelector('[data-filter="all"]').classList.add('active');
    }
});

// Exportfunktionen für andere Skripte
window.ArchiveAPI = {
    addWork: addWork,
    filterWorks: filterWorks,
    searchWorks: searchWorks,
    sortWorks: sortWorks,
    getStats: getArchiveStats,
    toggleTheme: toggleTheme
};
