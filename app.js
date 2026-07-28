// --- 1. INICJALIZACJA LENIS (Płynne przewijanie) ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// --- 2. OBSŁUGA PRZYCISKU "GALERIA" ---
const scrollDownBtn = document.querySelector('.scroll-down');
const gallerySection = document.querySelector('.gallery-section');

if (scrollDownBtn && gallerySection) {
    scrollDownBtn.addEventListener('click', () => {
        lenis.scrollTo(gallerySection, {
            offset: 0,
            duration: 1.2
        });
    });
}

// --- 3. TRANSPARENTNY HEADER ---
const headerElement = document.querySelector('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        headerElement.classList.add('scrolled');
    } else {
        headerElement.classList.remove('scrolled');
    }
});

// --- 4. ROZWIJANE MENU KONTAKTU ---
const contactBtn = document.querySelector('.contact-btn');
const contactMenu = document.querySelector('.contact-menu');

if (contactBtn && contactMenu) {
    contactBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        contactMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!contactMenu.contains(e.target) && !contactBtn.contains(e.target)) {
            contactMenu.classList.remove('active');
        }
    });
}

// --- 5. LOGO - SKOK NA GÓRĘ ---
const logoBtn = document.querySelector('.logo');

if (logoBtn) {
    logoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        lenis.scrollTo(0, {
            duration: 1.2
        });
    });
}

// --- 6. PŁYNNY EFEKT ZOOM I LŻEJSZEGO DIMMERA DLA GALERII ---
gsap.utils.toArray('.gallery-item').forEach((item) => {
    gsap.fromTo(item, 
        { scale: 0.9, opacity: 0.7 }, // Lżejszy start (opacity 0.7 zamiast 0.3)
        {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
                trigger: item,
                start: "top bottom",     // Kafel zaczyna reagować, gdy wchodzi od dołu ekranu
                end: "bottom top",       // Kończy cykl, gdy całkowicie opuszcza górę ekranu
                scrub: 1                 // Płynne wygładzenie (lag) likwidujące jakiekolwiek przeskoki
            }
        }
    );
});

// --- 7. OBSŁUGA MODALA PEŁNOEKRANOWEGO ---
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const modalClose = document.getElementById('modalClose');
const galleryItems = document.querySelectorAll('.gallery-item img');

galleryItems.forEach(img => {
    img.addEventListener('click', () => {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modal.classList.add('active');
        lenis.stop();
    });
});

function closeModal() {
    modal.classList.remove('active');
    lenis.start();
}

if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});