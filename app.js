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

// --- 6. PŁYNNY EFEKT ZOOM I ZMIANY ROZMIARU (ZOPTYMALIZOWANY DLA MOBILE) ---
gsap.utils.toArray('.gallery-item').forEach((item) => {
    gsap.fromTo(item, 
        { scale: 0.85, opacity: 0.6 },
        {
            scale: 1,
            opacity: 1,
            ease: "power1.out",
            scrollTrigger: {
                trigger: item,
                start: "top 90%",
                end: "center 50%",
                scrub: 1.5,
                invalidateOnRefresh: true
            }
        }
    );
});

// --- 7. OBSŁUGA MODALA PEŁNOEKRANOWEGO ZE STRZAŁKAMI ---
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const modalClose = document.getElementById('modalClose');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');
const galleryItems = document.querySelectorAll('.gallery-item img');

let currentIndex = 0;

function updateModalImage(index) {
    modalImg.src = galleryItems[index].src;
    modalImg.alt = galleryItems[index].alt;
}

galleryItems.forEach((img, index) => {
    img.addEventListener('click', () => {
        currentIndex = index;
        updateModalImage(currentIndex);
        modal.classList.add('active');
        lenis.stop();
    });
});

function closeModal() {
    modal.classList.remove('active');
    lenis.start();
}

function showPrevImage(e) {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    updateModalImage(currentIndex);
}

function showNextImage(e) {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % galleryItems.length;
    updateModalImage(currentIndex);
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalPrev) modalPrev.addEventListener('click', showPrevImage);
if (modalNext) modalNext.addEventListener('click', showNextImage);

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateModalImage(currentIndex);
    } else if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateModalImage(currentIndex);
    }
});