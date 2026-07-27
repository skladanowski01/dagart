const lenis = new Lenis({
    duration: 1.2,       // Czas trwania przewijania (im większy, tym "miękkszy")
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Krzywa wygładzania
    direction: 'vertical', // Kierunek: vertical / horizontal
    smoothWheel: true,   // Płynność dla kółka myszy
});

// 2. Synchronizacja Lenis z GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // Przeliczanie klatek na sekundę dla Lenis
});

gsap.ticker.lagSmoothing(0); // Wyłączenie domyślnego opóźnienia GSAP dla pełnej płynności

// --- PRZYKŁAD UŻYCIA GSAP + SCROLLTRIGGER ---
gsap.utils.toArray('section').forEach((section, index) => {
    gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: section,
            start: 'top 80%', // Kiedy góra sekcji dotknie 80% wysokości ekrany
            end: 'top 20%',
            toggleActions: 'play none none reverse',
            // markers: true // Odkomentuj, żeby zobaczyć linie debugowania ScrollTriggera
        }
    });
});