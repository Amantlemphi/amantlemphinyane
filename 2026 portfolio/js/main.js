/* ==========================================================
   AMANTLE PORTFOLIO
   MAIN.JS
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeLoader();

    initializeLenis();

    initializeCursor();

    initializeNavigation();

    initializeScrollEffects();

    initializeRevealAnimations();

    initializeCounters();

    initializeMagneticButtons();

    initializeContactForm();

    initializeScrollIndicator();

    const yearEl = document.getElementById("current-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

});

/* ==========================================================
   LOADER
========================================================== */

function initializeLoader() {

    const loader = document.getElementById("loader");

    if (!loader) return;

    window.addEventListener("load", () => {

        gsap.to(loader, {

            opacity: 0,

            duration: 1,

            delay: 1,

            onComplete: () => {

                loader.style.display = "none";

            }

        });

    });

}

/* ==========================================================
   LENIS SMOOTH SCROLL
========================================================== */

let lenis;

function initializeLenis() {

    if (typeof Lenis === "undefined") return;

    lenis = new Lenis({

        duration: 1.2,

        smoothWheel: true,

        wheelMultiplier: 1,

        touchMultiplier: 2

    });

    function raf(time) {

        lenis.raf(time);

        requestAnimationFrame(raf);

    }

    requestAnimationFrame(raf);

}

/* ==========================================================
   CUSTOM CURSOR
========================================================== */

function initializeCursor() {

    const cursor = document.querySelector(".cursor");

    const outline = document.querySelector(".cursor-outline");

    if (!cursor || !outline) return;

    let mouseX = 0;
    let mouseY = 0;

    let outlineX = 0;
    let outlineY = 0;

    document.addEventListener("mousemove", e => {

        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";

    });

    function animateCursor() {

        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;

        outline.style.left = outlineX + "px";
        outline.style.top = outlineY + "px";

        requestAnimationFrame(animateCursor);

    }

    animateCursor();

}

/* ==========================================================
   NAVIGATION
========================================================== */

function initializeNavigation() {

    const header = document.querySelector(".header");

    const menuBtn = document.querySelector(".menu-btn");

    const nav = document.querySelector(".nav-links");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    });

    if (menuBtn && nav) {

        menuBtn.addEventListener("click", () => {

            nav.classList.toggle("active");

        });

    }

}

/* ==========================================================
   ACTIVE LINKS
========================================================== */

function initializeScrollEffects() {

    const sections = document.querySelectorAll("section");

    const links = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {

        let current = "";

        sections.forEach(section => {

            const top = section.offsetTop - 200;

            if (scrollY >= top) {

                current = section.getAttribute("id");

            }

        });

        links.forEach(link => {

            link.classList.remove("active");

            if (link.href.includes(current)) {

                link.classList.add("active");

            }

        });

    });

}

/* ==========================================================
   GSAP REVEALS
========================================================== */

function initializeRevealAnimations() {

    if (typeof gsap === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".glass").forEach(card => {

        gsap.from(card, {

            y: 60,

            opacity: 0,

            duration: 1,

            ease: "power3.out",

            scrollTrigger: {

                trigger: card,

                start: "top 85%"

            }

        });

    });

    gsap.utils.toArray(".section-title").forEach(title => {

        gsap.from(title, {

            y: 80,

            opacity: 0,

            duration: 1,

            scrollTrigger: {

                trigger: title,

                start: "top 85%"

            }

        });

    });

}

/* ==========================================================
   COUNTERS
========================================================== */

function initializeCounters() {

    const stats = document.querySelectorAll(".stat h3");

    stats.forEach(stat => {

        const finalValue = stat.innerText;

        const number = parseInt(finalValue);

        if (isNaN(number)) return;

        let count = 0;

        const interval = setInterval(() => {

            count++;

            stat.innerText = count;

            if (count >= number) {

                clearInterval(interval);

                stat.innerText = finalValue;

            }

        }, 40);

    });

}

/* ==========================================================
   MAGNETIC BUTTONS
========================================================== */

function initializeMagneticButtons() {

    const buttons = document.querySelectorAll(

        ".primary-btn,.secondary-btn"

    );

    buttons.forEach(button => {

        button.addEventListener("mousemove", e => {

            const rect = button.getBoundingClientRect();

            const x = e.clientX - rect.left - rect.width / 2;

            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(button, {

                x: x * 0.25,

                y: y * 0.25,

                duration: 0.3

            });

        });

        button.addEventListener("mouseleave", () => {

            gsap.to(button, {

                x: 0,

                y: 0,

                duration: 0.5,

                ease: "elastic.out(1,0.4)"

            });

        });

    });

}

/* ==========================================================
   CONTACT FORM
========================================================== */

function initializeContactForm() {

    const form = document.querySelector(".contact-form");

    if (!form) return;

    const messageBox = document.getElementById("form-message");
    const submitBtn = form.querySelector("button[type='submit']");
    const btnText = submitBtn ? submitBtn.querySelector(".btn-text") : null;

    function showMessage(text, type) {

        if (!messageBox) return;

        messageBox.textContent = text;
        messageBox.className = "form-message show " + type;

    }

    form.addEventListener("submit", async e => {

        e.preventDefault();

        const requiredFields = form.querySelectorAll(
            "input[required], textarea[required]"
        );

        let valid = true;

        requiredFields.forEach(input => {

            if (input.value.trim() === "") {

                valid = false;

                input.style.borderColor = "#ff4d6d";

            } else {

                input.style.borderColor = "rgba(255,255,255,.08)";

            }

        });

        if (!valid) {

            showMessage("Please fill in all required fields.", "error");

            return;

        }

        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.textContent = "Sending...";

        try {

            const formData = new FormData(form);

            const response = await fetch(form.action, {

                method: "POST",
                body: formData,
                headers: { "Accept": "application/json" }

            });

            if (response.ok) {

                showMessage(
                    "Thank you! Your message has been sent successfully. I'll get back to you soon.",
                    "success"
                );

                form.reset();

            } else {

                showMessage("Something went wrong. Please try again later.", "error");

            }

        } catch (err) {

            showMessage("Something went wrong. Please try again later.", "error");

        } finally {

            if (submitBtn) submitBtn.disabled = false;
            if (btnText) btnText.textContent = "Send Message";

        }

    });

}

/* ==========================================================
   SCROLL INDICATOR
========================================================== */

function initializeScrollIndicator() {

    const indicator = document.querySelector(

        ".scroll-indicator"

    );

    if (!indicator) return;

    window.addEventListener("scroll", () => {

        indicator.style.opacity =

            window.scrollY > 250 ? 0 : 1;

    });

}

/* ==========================================================
   PARALLAX
========================================================== */

window.addEventListener("mousemove", e => {

    const moveX =

        (e.clientX / window.innerWidth - 0.5) * 20;

    const moveY =

        (e.clientY / window.innerHeight - 0.5) * 20;

    gsap.to(".profile-container", {

        x: moveX,

        y: moveY,

        duration: 1.2,

        ease: "power2.out"

    });

});

/* ==========================================================
   HERO FLOAT
========================================================== */

gsap.to(".profile-container", {

    y: -20,

    repeat: -1,

    yoyo: true,

    duration: 3,

    ease: "sine.inOut"

});

/* ==========================================================
   HERO TEXT
========================================================== */

gsap.from(".hero h1", {

    y: 100,

    opacity: 0,

    duration: 1.3,

    ease: "power4.out"

});

gsap.from(".hero p", {

    delay: .3,

    y: 50,

    opacity: 0,

    duration: 1

});

gsap.from(".hero-buttons", {

    delay: .6,

    opacity: 0,

    y: 50,

    duration: 1

});

/* ==========================================================
   END
========================================================== */

console.log(
    "%cPortfolio Loaded Successfully 🚀",
    "color:#00e5ff;font-size:16px;font-weight:bold;"
);
