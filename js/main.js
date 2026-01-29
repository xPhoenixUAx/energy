document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", !isExpanded);
      mainNav.classList.toggle("nav-open");
    });
  }

  // Scroll Reveal (Intersection Observer)
  // Updated selector to target '.fade-up' to match the new HTML/CSS class names
  const revealElements = document.querySelectorAll(".fade-up, .scroll-reveal");

  const revealCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.1,
    rootMargin: "0px 0px -30px 0px",
  });

  revealElements.forEach((el) => revealObserver.observe(el));

  // Auto slider (case study image rotation)
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const autoSliders = document.querySelectorAll("[data-auto-slider]");

  autoSliders.forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll(".case-study-slide"));
    if (slides.length < 2) return;

    let currentIndex = slides.findIndex((s) =>
      s.classList.contains("is-active"),
    );
    if (currentIndex < 0) {
      currentIndex = 0;
      slides[0].classList.add("is-active");
    }

    const intervalMs = parseInt(
      slider.getAttribute("data-interval") || "5000",
      10,
    );
    let timerId = null;

    const show = (nextIndex) => {
      slides[currentIndex].classList.remove("is-active");
      currentIndex = nextIndex;
      slides[currentIndex].classList.add("is-active");
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

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    slider.addEventListener("focusin", stop);
    slider.addEventListener("focusout", start);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    start();
  });

  // Accordion
  const accordionHeaders = document.querySelectorAll(".accordion-header");
  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      // Simple toggle
      if (content.style.display === "block") {
        content.style.display = "none";
        header.querySelector("span").textContent = "+";
      } else {
        content.style.display = "block";
        header.querySelector("span").textContent = "-";
      }
    });
  });

  // Form Validation
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Basic validation simulation
      const btn = contactForm.querySelector("button");
      const originalText = btn.textContent;

      btn.disabled = true;
      btn.textContent = "Processing...";

      setTimeout(() => {
        contactForm.reset();
        const successMsg = document.getElementById("formSuccess");
        if (successMsg) successMsg.style.display = "block";

        btn.textContent = "Sent";
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = originalText;
          if (successMsg) successMsg.style.display = "none";
        }, 3000);
      }, 1000);
    });
  }

  // Cookie banner: inject and manage consent (simple localStorage)
  (function manageCookieBanner() {
    try {
      const consentKey = "cookieConsent";
      if (localStorage.getItem(consentKey) === "accepted") return;

      const banner = document.createElement("div");
      banner.className = "cookie-banner";
      banner.setAttribute("role", "region");
      banner.setAttribute("aria-label", "Cookie banner");
      banner.innerHTML = `
                <div class="cookie-banner-inner container">
                    <div class="cookie-copy">
                        <p>
                            We use cookies to improve your experience on this site. By continuing, you agree to our
                            <a href="cookie-policy.html" class="cookie-link">Cookie Policy</a>.
                        </p>
                    </div>
                    <div class="cookie-actions">
                        <button class="btn btn-outline cookie-settings" type="button">Cookie Settings</button>
                        <button class="btn btn-primary cookie-accept" type="button">Accept</button>
                    </div>
                </div>`;

      document.body.appendChild(banner);

      const acceptBtn = banner.querySelector(".cookie-accept");
      const settingsBtn = banner.querySelector(".cookie-settings");

      acceptBtn.addEventListener("click", () => {
        localStorage.setItem(consentKey, "accepted");
        banner.classList.add("cookie-hidden");
        setTimeout(() => banner.remove(), 350);
      });

      settingsBtn.addEventListener("click", () => {
        window.location.href = "cookie-policy.html";
      });
    } catch (e) {
      // Fail silently if storage not available
      console.warn("Cookie banner failed:", e);
    }
  })();
});
