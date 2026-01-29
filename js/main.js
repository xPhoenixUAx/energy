document.addEventListener('DOMContentLoaded', () => {
    
    // Mobile Menu
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('nav-open');
        });
    }

    // Scroll Reveal (Intersection Observer)
    // Updated selector to target '.fade-up' to match the new HTML/CSS class names
    const revealElements = document.querySelectorAll('.fade-up, .scroll-reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Auto slider (case study image rotation)
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const autoSliders = document.querySelectorAll('[data-auto-slider]');

    autoSliders.forEach(slider => {
        const slides = Array.from(slider.querySelectorAll('.case-study-slide'));
        if (slides.length < 2) return;

        let currentIndex = slides.findIndex(s => s.classList.contains('is-active'));
        if (currentIndex < 0) {
            currentIndex = 0;
            slides[0].classList.add('is-active');
        }

        const intervalMs = parseInt(slider.getAttribute('data-interval') || '5000', 10);
        let timerId = null;

        const show = (nextIndex) => {
            slides[currentIndex].classList.remove('is-active');
            currentIndex = nextIndex;
            slides[currentIndex].classList.add('is-active');
        };

        const next = () => show((currentIndex + 1) % slides.length);

        const stop = () => {
            if (timerId) window.clearInterval(timerId);
            timerId = null;
        };

        const start = () => {
            if (prefersReducedMotion) return;
            stop();
            timerId = window.setInterval(next, intervalMs);
        };

        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        slider.addEventListener('focusin', stop);
        slider.addEventListener('focusout', start);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stop();
            else start();
        });

        start();
    });

    // Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            // Simple toggle
            if (content.style.display === "block") {
                content.style.display = "none";
                header.querySelector('span').textContent = "+";
            } else {
                content.style.display = "block";
                header.querySelector('span').textContent = "-";
            }
        });
    });

    // Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Basic validation simulation
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            
            btn.disabled = true;
            btn.textContent = "Processing...";
            
            setTimeout(() => {
                contactForm.reset();
                const successMsg = document.getElementById('formSuccess');
                if (successMsg) successMsg.style.display = 'block';
                
                btn.textContent = "Sent";
                setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = originalText;
                    if (successMsg) successMsg.style.display = 'none';
                }, 3000);
            }, 1000);
        });
    }
});
