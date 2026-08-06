/*=========================================
PRELOADER
=========================================*/
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = "https://clrulnqpblazshugvhfj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNscnVsbnFwYmxhenNodWd2aGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MTEwNDEsImV4cCI6MjEwMTA4NzA0MX0.7FB98w9zMCYAXgZhdWS4jabYN36i7sV58BZ0fPwB1lY";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
window.addEventListener("load", () => {

    document.body.classList.add("loaded");

});

/*=========================================
STICKY HEADER
=========================================*/

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});

/*=========================================
MOBILE MENU
=========================================*/

const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector("nav");

menuBtn.addEventListener("click", () => {

    nav.classList.toggle("active");

    const icon = menuBtn.querySelector("i");

    if (nav.classList.contains("active")) {

        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    }

});

/* Close menu when a link is clicked */

document.querySelectorAll("nav a").forEach(link => {

    link.addEventListener("click", () => {

        nav.classList.remove("active");

        const icon = menuBtn.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});

/*=========================================
GALLERY FILTER
=========================================*/

const filterButtons = document.querySelectorAll(".gallery-filter button");
const cards = document.querySelectorAll(".art-card");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        const filter = button.dataset.filter;

        cards.forEach(card => {

            if (
                filter === "all" ||
                card.classList.contains(filter)
            ) {

                card.style.display = "block";

                setTimeout(() => {

                    card.style.opacity = "1";
                    card.style.transform = "scale(1)";

                }, 50);

            } else {

                card.style.opacity = "0";
                card.style.transform = "scale(.8)";

                setTimeout(() => {

                    card.style.display = "none";

                }, 250);

            }

        });

    });

});

/*=========================================
LIGHTBOX
=========================================*/

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.getElementById("close");

/* Lightbox only exists on the gallery page, so every part of this
   feature is guarded and skipped on pages that don't include it. */

if (lightbox && lightboxImg && closeBtn) {

    document.querySelectorAll(".art-card img").forEach(image => {

        image.addEventListener("click", () => {

            lightbox.classList.add("show");

            lightboxImg.src = image.src;

            lightboxImg.alt = image.alt;

            document.body.style.overflow = "hidden";

        });

    });

    closeBtn.addEventListener("click", () => {

        lightbox.classList.remove("show");

        document.body.style.overflow = "auto";

    });

    lightbox.addEventListener("click", (e) => {

        if (e.target === lightbox) {

            lightbox.classList.remove("show");

            document.body.style.overflow = "auto";

        }

    });

}

/*=========================================
SCROLL REVEAL
=========================================*/

const revealElements = document.querySelectorAll(
    ".feature, .art-card, .about-image, .about-text, form"
);

function revealOnScroll() {

    revealElements.forEach(item => {

        const top = item.getBoundingClientRect().top;

        const visible = window.innerHeight - 100;

        if (top < visible) {

            item.classList.add("active");

        }

    });

}

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();

/*=========================================
SMOOTH BUTTON HOVER
=========================================*/

document.querySelectorAll(".btn, .btn-outline, .buy-btn")
.forEach(button => {

    button.addEventListener("mouseenter", () => {

        button.style.transform = "translateY(-4px)";

    });

    button.addEventListener("mouseleave", () => {

        button.style.transform = "translateY(0px)";

    });

});

/*=========================================
CONTACT FORM
=========================================*/

const form = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

/* Contact form only exists on contact.html, so this whole feature
   is guarded and skipped on every other page.

   "Database" note: this is a static site with no server, so
   submissions are stored in the visitor's own browser via
   localStorage as a lightweight stand-in for a real database.
   It is NOT shared across devices or visible to you centrally —
   for that you would need an actual backend (a form service like
   Formspree, a Google Sheet via Apps Script, or a small server
   with a real database). */

if (form && formSuccess) {

    const STORAGE_KEY = "adeyemiGalleryEnquiries";
    const SUBMITTED_KEY = "adeyemiGalleryEnquirySubmitted";

    const fields = {
        name: document.getElementById("name"),
        phone: document.getElementById("phone"),
        email: document.getElementById("email"),
        message: document.getElementById("message")
    };

    const errors = {
        name: document.getElementById("nameError"),
        phone: document.getElementById("phoneError"),
        email: document.getElementById("emailError"),
        message: document.getElementById("messageError")
    };

    function showSuccess() {

        form.style.display = "none";

        formSuccess.classList.add("show");

    }

    /* If this visitor already submitted, keep the form hidden on
       future visits/reloads instead of showing it again. */

    if (localStorage.getItem(SUBMITTED_KEY) === "true") {

        showSuccess();

    }

    function setError(key, message) {

        fields[key].classList.add("invalid");

        errors[key].textContent = message;

    }

    function clearError(key) {

        fields[key].classList.remove("invalid");

        errors[key].textContent = "";

    }

    function validateForm() {

        let isValid = true;

        const name = fields.name.value.trim();
        const phone = fields.phone.value.trim();
        const email = fields.email.value.trim();
        const message = fields.message.value.trim();

        if (!name) {

            setError("name", "Please enter your name.");
            isValid = false;

        } else {

            clearError("name");

        }

        const phonePattern = /^[+]?[0-9\s-]{7,15}$/;

        if (!phone) {

            setError("phone", "Please enter your phone number.");
            isValid = false;

        } else if (!phonePattern.test(phone)) {

            setError("phone", "Please enter a valid phone number.");
            isValid = false;

        } else {

            clearError("phone");

        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {

            setError("email", "Please enter your email.");
            isValid = false;

        } else if (!emailPattern.test(email)) {

            setError("email", "Please enter a valid email address.");
            isValid = false;

        } else {

            clearError("email");

        }

        if (!message) {

            setError("message", "Please enter your message.");
            isValid = false;

        } else {

            clearError("message");

        }

        return isValid;

    }

    /* Clear a field's error as soon as the visitor starts fixing it */

    Object.keys(fields).forEach(key => {

        fields[key].addEventListener("input", () => clearError(key));

    });

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        if (!validateForm()) {

            return;

        }

        const entry = {
            name: fields.name.value.trim(),
            phone: fields.phone.value.trim(),
            email: fields.email.value.trim(),
            message: fields.message.value.trim(),
            submittedAt: new Date().toISOString()
        };

       const { error } = await supabase
  .from("contacts")
  .insert([
    {
      name: entry.name,
      phone: entry.phone,
      email: entry.email
    }
  ]);

if (error) {
  alert(error.message);
  return;
}

form.reset();
showSuccess();

    });

}

/*=========================================
ACTIVE NAV LINK
=========================================*/

const navLinks = document.querySelectorAll("nav a");

const currentPage = window.location.pathname
    .split("/")
    .pop() || "index.html";

navLinks.forEach(link => {

    const linkPage = link.getAttribute("href");

    link.classList.remove("active");

    if (
        linkPage === currentPage ||
        (currentPage === "" && linkPage === "index.html")
    ) {

        link.classList.add("active");

    }

});

/*=========================================
KEYBOARD LIGHTBOX CLOSE
=========================================*/

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape" && lightbox) {

        lightbox.classList.remove("show");

        document.body.style.overflow = "auto";

    }

});

/*=========================================
HERO SLIDER
=========================================*/

const heroSlides = document.querySelectorAll(".hero-slide");
const heroDots = document.querySelectorAll(".slider-dots .dot");
const prevBtn = document.querySelector(".slider-prev");
const nextBtn = document.querySelector(".slider-next");

/* Hero slider markup only exists on the home page, so this whole
   feature is guarded and skipped everywhere else. */

if (heroSlides.length > 0) {

    let currentSlide = 0;
    let slideTimer = null;

    function goToSlide(index) {

        heroSlides[currentSlide].classList.remove("active");
        heroDots[currentSlide]?.classList.remove("active");

        currentSlide = (index + heroSlides.length) % heroSlides.length;

        heroSlides[currentSlide].classList.add("active");
        heroDots[currentSlide]?.classList.add("active");

    }

    function nextSlide() {

        goToSlide(currentSlide + 1);

    }

    function startAutoplay() {

        slideTimer = setInterval(nextSlide, 6000);

    }

    function resetAutoplay() {

        clearInterval(slideTimer);

        startAutoplay();

    }

    if (nextBtn) {

        nextBtn.addEventListener("click", () => {

            nextSlide();

            resetAutoplay();

        });

    }

    if (prevBtn) {

        prevBtn.addEventListener("click", () => {

            goToSlide(currentSlide - 1);

            resetAutoplay();

        });

    }

    heroDots.forEach((dot, index) => {

        dot.addEventListener("click", () => {

            goToSlide(index);

            resetAutoplay();

        });

    });

    startAutoplay();

}

/*=========================================
END
=========================================*/
