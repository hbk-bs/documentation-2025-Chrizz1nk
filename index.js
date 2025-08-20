// Warten bis das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function() {
    
    // DOM-Elemente
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workCards = document.querySelectorAll('.work-card');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const worksGrid = document.getElementById('worksGrid');
    
    // Info-Section Elemente - WICHTIG: Diese müssen zuerst geladen werden
    const infoHeader = document.getElementById('infoHeader');
    const infoCard = document.getElementById('infoCard');
    const infoContent = document.getElementById('infoContent');

    // Navigation Toggle für Mobile
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

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
            if (navMenu) navMenu.classList.remove('active');
        });
    });

    // Header Scroll-Effekt
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(0, 0, 0, 0.95)';
            } else {
                header.style.background = 'rgba(0, 0, 0, 0.9)';
            }
        }
    });

    // Info-Section Toggle Funktionalität - KORRIGIERT
    if (infoHeader && infoCard && infoContent) {
        console.log('Info-Section Elemente gefunden'); // Debug
        
        infoHeader.addEventListener('click', function() {
            console.log('Info-Header geklickt'); // Debug
            
            infoCard.classList.toggle('expanded');
            infoContent.classList.toggle('expanded');
            
            // Alternative Methode falls die CSS-Klassen nicht funktionieren
            if (infoContent.classList.contains('expanded')) {
                infoContent.style.maxHeight = infoContent.scrollHeight + 'px';
            } else {
                infoContent.style.maxHeight = '0';
            }
        });
    } else {
        console.error('Info-Section Elemente nicht gefunden'); // Debug
    }

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

    // Suche Event Listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            if (query.length > 0) {
                searchWorks(query);
                filterButtons.forEach(btn => btn.classList.remove('active'));
            } else {
                workCards.forEach(card => {
                    card.classList.remove('hidden');
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
                const allFilter = document.querySelector('[data-filter="all"]');
                if (allFilter) allFilter.classList.add('active');
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
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value;
            if (query.length > 0) {
                searchWorks(query);
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

    // Alle Werk-Karten für Scroll-Animation registrieren
    workCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Werk-Karten Hover-Effekte
    workCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

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

    // Alle Animationen starten
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // Responsive Breakpoint Detection
    function handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
            if (navMenu) navMenu.classList.remove('active');
        }
    }

    // Resize Event Listener
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial ausführen

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

    // Parallax-Effekt für Hero-Section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

});