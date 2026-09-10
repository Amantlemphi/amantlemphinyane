/* ==========================================================
   AMANTLE PORTFOLIO — MAIN.JS
   Non-scrolling 3D single-page app: view routing, 3D nav
   cards, portfolio carousel, contact form.
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeLoader();
    initializeCursor();
    initializeRouter();
    initializeNavCardTilt();
    initializeParallax();
    initializeCarousel();
    initializeContactForm();

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

        const finish = () => { loader.style.display = "none"; };

        if (typeof gsap !== "undefined") {
            gsap.to(loader, { opacity: 0, duration: 1, delay: 1, onComplete: finish });
        } else {
            setTimeout(() => {
                loader.style.transition = "opacity .6s ease";
                loader.style.opacity = 0;
                setTimeout(finish, 600);
            }, 1000);
        }

    });

}

/* ==========================================================
   CUSTOM CURSOR
========================================================== */

function initializeCursor() {

    const cursor = document.querySelector(".cursor");
    const outline = document.querySelector(".cursor-outline");
    if (!cursor || !outline) return;

    let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;

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
   VIEW ROUTER
========================================================== */

let currentView = "home";

function initializeRouter() {

    const views = {};
    document.querySelectorAll(".view").forEach(v => { views[v.dataset.view] = v; });

    function setDockState(name) {
        document.querySelectorAll("[data-nav]").forEach(btn => {
            if (btn.classList.contains("dock-btn")) {
                btn.classList.toggle("active", btn.dataset.nav === name);
            }
        });
    }

    function goTo(name) {

        if (!views[name] || name === currentView) return;

        const from = views[currentView];
        const to = views[name];

        setDockState(name);

        if (typeof gsap !== "undefined") {

            gsap.to(from, {
                duration: .45,
                opacity: 0,
                scale: .94,
                rotateY: -12,
                ease: "power2.in",
                onComplete: () => {
                    from.classList.remove("active");
                    to.classList.add("active");
                    gsap.fromTo(to,
                        { opacity: 0, scale: .94, rotateY: 12 },
                        { opacity: 1, scale: 1, rotateY: 0, duration: .6, ease: "power3.out" }
                    );
                }
            });

        } else {
            from.classList.remove("active");
            to.classList.add("active");
        }

        currentView = name;

        const scrollable = to.querySelector(".view-scroll");
        if (scrollable) scrollable.scrollTop = 0;

    }

    document.querySelectorAll("[data-nav]").forEach(el => {
        el.addEventListener("click", () => goTo(el.dataset.nav));
    });

}

/* ==========================================================
   3D TILT ON NAV CARDS
========================================================== */

function initializeNavCardTilt() {

    document.querySelectorAll(".nav-card").forEach(card => {

        card.addEventListener("mousemove", e => {

            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;

            card.style.transform =
                `perspective(900px) rotateY(${px * 16}deg) rotateX(${-py * 16}deg) translateY(-8px)`;

        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });

    });

}

/* ==========================================================
   PARALLAX (home photo)
========================================================== */

function initializeParallax() {

    if (typeof gsap === "undefined") return;

    window.addEventListener("mousemove", e => {

        const moveX = (e.clientX / window.innerWidth - 0.5) * 20;
        const moveY = (e.clientY / window.innerHeight - 0.5) * 20;

        gsap.to(".home-photo", { x: moveX, y: moveY, duration: 1.2, ease: "power2.out" });

    });

}

/* ==========================================================
   PORTFOLIO PROJECTS DATA
========================================================== */

const PROJECTS = [

    {
        title: "School Library System",
        role: "MVC Web Application",
        icon: "ri-book-2-line",
        tech: ["Java", "Servlets", "JSP", "MVC", "MySQL"],
        desc: "A full MVC library management platform for schools, handling book catalogues, member records and loan/return workflows with complete CRUD control from the librarian dashboard.",
        mockup: "library",
        demo: "demos/library-demo.html"
    },
    {
        title: "Scientific Calculator",
        role: "Android Application",
        icon: "ri-calculator-line",
        tech: ["Java", "Android SDK", "XML Layouts"],
        desc: "A native Android scientific calculator supporting trigonometric, logarithmic and memory functions, built with a focus on clean UI and precise input handling.",
        mockup: "calc",
        demo: "demos/calculator-demo.html"
    },
    {
        title: "Online E-Commerce Platform",
        role: "Front-End Web App",
        icon: "ri-shopping-cart-2-line",
        tech: ["JavaScript", "HTML5", "CSS3", "DOM APIs"],
        desc: "A browser-based online store concept with dynamic product listings, cart management and checkout flow, built to demonstrate front-end commerce logic.",
        mockup: "ecom",
        demo: "demos/ecommerce-demo.html"
    },
    {
        title: "ATM Simulation System",
        role: "Desktop Java Application",
        icon: "ri-bank-card-line",
        tech: ["Java", "NetBeans", "OOP", "File/DB Storage"],
        desc: "A desktop banking simulator replicating core ATM operations — balance enquiry, withdrawals, deposits and PIN authentication.",
        mockup: "atm",
        demo: "demos/atm-demo.html"
    },
    {
        title: "reCAPTCHA Verification System",
        role: "Cybersecurity Module",
        icon: "ri-shield-check-line",
        tech: ["Java", "Google reCAPTCHA API", "Web Security"],
        desc: "A cybersecurity-focused verification layer integrated into a school records system to block automated/bot access and protect sensitive student data.",
        mockup: "captcha",
        demo: "demos/recaptcha-demo.html"
    },
    {
        title: "Real Estate Listings Platform",
        role: "Web Application",
        icon: "ri-building-3-line",
        tech: ["JavaScript", "HTML5", "CSS3", "Dynamic Rendering"],
        desc: "A property listings web concept letting users browse, filter and view real estate listings dynamically rendered from structured data.",
        mockup: "realestate",
        demo: "demos/realestate-demo.html"
    },
    {
        title: "Tshireletso — Community Safety App",
        role: "Mobile Safety App",
        icon: "ri-map-pin-user-line",
        tech: ["Java", "GPS/Location Services", "Real-Time Alerts"],
        desc: "A safety-first mobile concept that maps red-zoned high-risk routes around Gaborone and includes a one-tap SOS button that shares live location with emergency contacts.",
        mockup: "safety",
        demo: "demos/safety-demo.html"
    }

];


/* ==========================================================
   PORTFOLIO CAROUSEL
========================================================== */

function initializeCarousel() {

    const track = document.getElementById("carousel");
    const dotsWrap = document.getElementById("carouselDots");
    const detail = document.getElementById("projectDetail");
    const prevBtn = document.getElementById("prevProj");
    const nextBtn = document.getElementById("nextProj");

    if (!track || !detail) return;

    const count = PROJECTS.length;
    const angleStep = 360 / count;
    const radius = 420;
    let activeIndex = 0;
    let autoTimer = null;

    PROJECTS.forEach((project, i) => {

        const item = document.createElement("div");
        item.className = "carousel-item";
        item.dataset.index = i;
        item.style.transform = `rotateY(${i * angleStep}deg) translateZ(${radius}px)`;

        item.innerHTML = `
            <div class="device-frame">
                <div class="device-dots"><span></span><span></span><span></span></div>
                <div class="device-screen">
                    <iframe src="${project.demo}" title="${project.title} live demo" loading="lazy"></iframe>
                </div>
            </div>
            <div class="carousel-caption"><i class="${project.icon}"></i><span>${project.title}</span></div>
        `;

        item.addEventListener("click", () => setActive(i, true));

        track.appendChild(item);

    });

    PROJECTS.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.addEventListener("click", () => setActive(i, true));
        dotsWrap.appendChild(dot);
    });

    function renderDetail(project) {

        detail.innerHTML = `
            <h3>${project.title}</h3>
            <span class="role">${project.role}</span>
            <p>${project.desc}</p>
            <div class="tags">${project.tech.map(t => `<span>${t}</span>`).join("")}</div>
            <span class="demo-hint"><i class="ri-cursor-line"></i> The centered card above is live — try it</span>
        `;

        if (typeof gsap !== "undefined") {
            gsap.fromTo(detail, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .5 });
        }

    }

    function setActive(index, userTriggered) {

        activeIndex = ((index % count) + count) % count;

        track.style.transform = `rotateY(${-activeIndex * angleStep}deg)`;

        track.querySelectorAll(".carousel-item").forEach(el => {
            el.classList.toggle("active", Number(el.dataset.index) === activeIndex);
        });

        dotsWrap.querySelectorAll("span").forEach((el, i) => {
            el.classList.toggle("active", i === activeIndex);
        });

        renderDetail(PROJECTS[activeIndex]);

        if (userTriggered) restartAutoRotate();

    }

    function restartAutoRotate() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => setActive(activeIndex + 1, false), 7000);
    }

    if (prevBtn) prevBtn.addEventListener("click", () => setActive(activeIndex - 1, true));
    if (nextBtn) nextBtn.addEventListener("click", () => setActive(activeIndex + 1, true));

    setActive(0, false);
    restartAutoRotate();

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

        const requiredFields = form.querySelectorAll("input[required], textarea[required]");
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
                showMessage("Thank you! Your message has been sent successfully. I'll get back to you soon.", "success");
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
   END
========================================================== */

console.log(
    "%cPortfolio Loaded Successfully 🚀",
    "color:#38d9ff;font-size:16px;font-weight:bold;"
);
