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
   MOCKUP SCREEN MARKUP GENERATORS
========================================================== */

const MOCK_ACCENT = "#38d9ff";
const MOCK_PRIMARY = "#2f6fed";
const MOCK_SECONDARY = "#1b3a8a";
const MOCK_PANEL = "#0f2557";
const MOCK_LINE = "rgba(255,255,255,.14)";
const MOCK_MUTED = "#7f8bb3";
const MOCK_WHITE = "#f4f7ff";

function mockupMarkup(type) {

    switch (type) {

        case "library":
            return `
            <svg viewBox="0 0 200 220" class="mock-svg">
                <rect x="4" y="4" width="192" height="26" rx="8" fill="${MOCK_PANEL}" stroke="${MOCK_LINE}"/>
                <circle cx="20" cy="17" r="5" fill="none" stroke="${MOCK_ACCENT}" stroke-width="2"/>
                <line x1="24" y1="21" x2="28" y2="25" stroke="${MOCK_ACCENT}" stroke-width="2" stroke-linecap="round"/>
                <rect x="40" y="13" width="90" height="8" rx="4" fill="${MOCK_LINE}"/>
                ${[0,1,2,3].map(i => `
                    <g transform="translate(4 ${42 + i*38})">
                        <rect width="192" height="32" rx="8" fill="${MOCK_PANEL}" opacity="${0.7 - i*0.07}"/>
                        <rect x="10" y="6" width="14" height="20" rx="2" fill="${i % 2 ? MOCK_ACCENT : MOCK_PRIMARY}"/>
                        <rect x="34" y="9" width="90" height="7" rx="3.5" fill="${MOCK_LINE}"/>
                        <rect x="34" y="20" width="60" height="6" rx="3" fill="${MOCK_LINE}" opacity=".6"/>
                        <rect x="150" y="10" width="32" height="12" rx="6" fill="${i % 2 ? "rgba(56,217,255,.18)" : "rgba(255,255,255,.08)"}"/>
                    </g>`).join("")}
                <rect x="4" y="188" width="192" height="28" rx="10" fill="url(#gradLib)"/>
                <defs>
                    <linearGradient id="gradLib" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stop-color="${MOCK_PRIMARY}"/>
                        <stop offset="1" stop-color="${MOCK_SECONDARY}"/>
                    </linearGradient>
                </defs>
            </svg>`;

        case "calc":
            return `
            <svg viewBox="0 0 200 220" class="mock-svg">
                <rect x="4" y="4" width="192" height="54" rx="10" fill="${MOCK_PANEL}"/>
                <text x="182" y="30" text-anchor="end" fill="${MOCK_MUTED}" font-size="10" font-family="monospace">sin(45)+log(2)</text>
                <text x="182" y="50" text-anchor="end" fill="${MOCK_WHITE}" font-size="18" font-family="monospace">245.71</text>
                ${Array.from({ length: 16 }).map((_, i) => {
                    const col = i % 4, row = Math.floor(i / 4);
                    const isOp = col === 3;
                    const isEquals = i === 15;
                    return `<rect x="${4 + col * 49}" y="${66 + row * 39}" width="42" height="32" rx="8"
                        fill="${isEquals ? "url(#gradCalc)" : isOp ? "rgba(56,217,255,.16)" : "rgba(255,255,255,.06)"}"
                        stroke="${isOp ? "rgba(56,217,255,.35)" : MOCK_LINE}"/>`;
                }).join("")}
                <defs>
                    <linearGradient id="gradCalc" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stop-color="${MOCK_PRIMARY}"/>
                        <stop offset="1" stop-color="${MOCK_SECONDARY}"/>
                    </linearGradient>
                </defs>
            </svg>`;

        case "ecom":
            return `
            <svg viewBox="0 0 200 220" class="mock-svg">
                <rect x="4" y="4" width="150" height="24" rx="12" fill="${MOCK_PANEL}"/>
                <circle cx="176" cy="16" r="14" fill="rgba(56,217,255,.16)" stroke="${MOCK_ACCENT}"/>
                <text x="176" y="20" text-anchor="middle" fill="${MOCK_ACCENT}" font-size="11" font-family="sans-serif">3</text>
                ${[0,1,2,3].map(i => {
                    const col = i % 2, row = Math.floor(i / 2);
                    return `
                    <g transform="translate(${4 + col*98} ${40 + row*88})">
                        <rect width="92" height="60" rx="10" fill="${MOCK_PANEL}"/>
                        <rect x="10" y="10" width="72" height="30" rx="6" fill="${col ? "rgba(56,217,255,.18)" : "rgba(47,111,237,.22)"}"/>
                        <rect x="10" y="46" width="46" height="7" rx="3.5" fill="${MOCK_LINE}"/>
                        <text x="82" y="52" text-anchor="end" fill="${MOCK_ACCENT}" font-size="9" font-family="sans-serif">P${250 + i*40}</text>
                    </g>`;
                }).join("")}
                <rect x="4" y="188" width="192" height="28" rx="10" fill="url(#gradEcom)"/>
                <defs>
                    <linearGradient id="gradEcom" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stop-color="${MOCK_PRIMARY}"/>
                        <stop offset="1" stop-color="${MOCK_SECONDARY}"/>
                    </linearGradient>
                </defs>
            </svg>`;

        case "atm":
            return `
            <svg viewBox="0 0 200 220" class="mock-svg">
                <rect x="60" y="4" width="80" height="10" rx="4" fill="${MOCK_LINE}"/>
                <rect x="4" y="26" width="192" height="52" rx="10" fill="${MOCK_PANEL}"/>
                <text x="100" y="48" text-anchor="middle" fill="${MOCK_MUTED}" font-size="10" font-family="sans-serif">ENTER PIN</text>
                ${[0,1,2,3].map(i => `<circle cx="${76 + i*16}" cy="64" r="5" fill="${i < 3 ? MOCK_ACCENT : "rgba(255,255,255,.15)"}"/>`).join("")}
                ${Array.from({ length: 12 }).map((_, i) => {
                    const col = i % 3, row = Math.floor(i / 3);
                    const label = i < 9 ? String(i + 1) : (i === 9 ? "*" : i === 10 ? "0" : "#");
                    return `
                    <g transform="translate(${8 + col*63} ${90 + row*32})">
                        <rect width="55" height="26" rx="7" fill="rgba(255,255,255,.06)" stroke="${MOCK_LINE}"/>
                        <text x="27" y="17" text-anchor="middle" fill="${MOCK_WHITE}" font-size="11" font-family="monospace">${label}</text>
                    </g>`;
                }).join("")}
                <rect x="4" y="196" width="192" height="20" rx="8" fill="url(#gradAtm)"/>
                <defs>
                    <linearGradient id="gradAtm" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stop-color="${MOCK_PRIMARY}"/>
                        <stop offset="1" stop-color="${MOCK_SECONDARY}"/>
                    </linearGradient>
                </defs>
            </svg>`;

        case "captcha":
            return `
            <svg viewBox="0 0 200 220" class="mock-svg">
                <rect x="10" y="60" width="180" height="52" rx="10" fill="${MOCK_PANEL}" stroke="${MOCK_LINE}"/>
                <rect x="24" y="76" width="20" height="20" rx="5" fill="rgba(56,217,255,.15)" stroke="${MOCK_ACCENT}" stroke-width="2"/>
                <path d="M28 86l4 4 8-8" fill="none" stroke="${MOCK_ACCENT}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
                <text x="54" y="90" fill="${MOCK_WHITE}" font-size="11" font-family="sans-serif">I'm not a robot</text>
                <text x="150" y="99" text-anchor="middle" fill="${MOCK_MUTED}" font-size="6" font-family="sans-serif">reCAPTCHA</text>
                ${Array.from({ length: 9 }).map((_, i) => {
                    const col = i % 3, row = Math.floor(i / 3);
                    return `<rect x="${28 + col*50}" y="${128 + row*22}" width="44" height="18" rx="4" fill="rgba(255,255,255,.05)" stroke="${MOCK_LINE}"/>`;
                }).join("")}
                <circle cx="100" cy="30" r="18" fill="rgba(56,217,255,.1)" stroke="${MOCK_ACCENT}" stroke-width="1.5"/>
                <path d="M100 20l7 3v6c0 5-3 8-7 10-4-2-7-5-7-10v-6z" fill="none" stroke="${MOCK_ACCENT}" stroke-width="1.6"/>
            </svg>`;

        case "realestate":
            return `
            <svg viewBox="0 0 200 220" class="mock-svg">
                <g transform="translate(4 4)">
                    <path d="M6 10l4-4 4 4v8H6z" fill="none" stroke="${MOCK_ACCENT}" stroke-width="1.6"/>
                    <text x="22" y="12" fill="${MOCK_MUTED}" font-size="10" font-family="sans-serif">Gaborone, BW</text>
                </g>
                ${[0,1,2].map(i => `
                    <g transform="translate(4 ${28 + i*62})">
                        <rect width="192" height="54" rx="10" fill="${MOCK_PANEL}"/>
                        <rect x="10" y="10" width="70" height="34" rx="6" fill="${i % 2 ? "rgba(47,111,237,.24)" : "rgba(56,217,255,.18)"}"/>
                        <path d="M35 30l10-9 10 9" transform="translate(0 -6)" fill="none" stroke="${MOCK_ACCENT}" stroke-width="1.6"/>
                        <rect x="90" y="14" width="80" height="7" rx="3.5" fill="${MOCK_LINE}"/>
                        <rect x="90" y="26" width="55" height="6" rx="3" fill="${MOCK_LINE}" opacity=".6"/>
                        <text x="170" y="42" text-anchor="end" fill="${MOCK_ACCENT}" font-size="10" font-family="sans-serif">P${1200 + i*350}k</text>
                    </g>`).join("")}
            </svg>`;

        case "safety":
            return `
            <svg viewBox="0 0 200 220" class="mock-svg">
                <rect x="4" y="4" width="192" height="150" rx="12" fill="${MOCK_PANEL}"/>
                <polygon points="30,120 90,60 150,90 120,140" fill="rgba(255,77,109,.22)" stroke="rgba(255,77,109,.5)"/>
                <path d="M20 130 C 60 90, 100 100, 130 60 S 180 30, 185 20" fill="none" stroke="${MOCK_ACCENT}"
                    stroke-width="2.5" stroke-dasharray="6 5" stroke-linecap="round" opacity=".8"/>
                <circle cx="20" cy="130" r="5" fill="${MOCK_ACCENT}"/>
                <circle cx="185" cy="20" r="5" fill="${MOCK_WHITE}"/>
                <circle cx="90" cy="95" r="4.5" fill="#ff4d6d"/>
                <circle cx="128" cy="72" r="4.5" fill="#ff4d6d"/>
                <circle cx="100" cy="184" r="30" fill="url(#gradSos)" class="mock-sos-pulse"/>
                <circle cx="100" cy="184" r="30" fill="none" stroke="#ff4d6d" stroke-width="2" opacity=".5" class="mock-sos-ring"/>
                <text x="100" y="189" text-anchor="middle" fill="#fff" font-size="13" font-weight="700" font-family="sans-serif">SOS</text>
                <defs>
                    <radialGradient id="gradSos">
                        <stop offset="0" stop-color="#ff4d6d"/>
                        <stop offset="1" stop-color="#8b1531"/>
                    </radialGradient>
                </defs>
            </svg>`;

        default:
            return `<div class="mock-bar w60"></div>`;

    }

}

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
    const radius = 460;
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
                <div class="device-screen">${mockupMarkup(project.mockup)}</div>
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

        const demoBlock = project.demo ? `
            <div class="live-demo">
                <span class="live-demo-label"><i class="ri-flashlight-line"></i> Live interactive demo — try the filters &amp; search</span>
                <div class="live-demo-frame">
                    <div class="device-dots"><span></span><span></span><span></span></div>
                    <iframe src="${project.demo}" title="${project.title} interactive demo" loading="lazy"></iframe>
                </div>
            </div>` : "";

        detail.innerHTML = `
            <h3>${project.title}</h3>
            <span class="role">${project.role}</span>
            <p>${project.desc}</p>
            <div class="tags">${project.tech.map(t => `<span>${t}</span>`).join("")}</div>
            ${demoBlock}
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
