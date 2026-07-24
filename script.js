/*=========================================
PRELOADER
=========================================*/

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

const form = document.querySelector("form");

if (form) {

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const name = form.querySelector("input[type='text']").value.trim();
        const email = form.querySelector("input[type='email']").value.trim();
        const message = form.querySelector("textarea").value.trim();

        if (!name || !email || !message) {

            alert("Please complete all fields.");

            return;

        }

        alert("Thank you for your message. I will get back to you soon.");

        form.reset();

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