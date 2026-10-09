/* ----------- NAV ACTIVE HIGHLIGHT ----------- */
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

function updateActiveNav() {
    let current = "";

    sections.forEach(sec => {
        const sectionTop = sec.offsetTop - 200;
        if (window.scrollY >= sectionTop) current = sec.getAttribute("id");
    });

    // The last section is too short to scroll its top near the nav,
    // so treat reaching the bottom of the page as being in it
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) current = sections[sections.length - 1].getAttribute("id");

    navLinks.forEach(a => {
        a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
}

window.addEventListener("scroll", updateActiveNav);
window.addEventListener("resize", updateActiveNav);
updateActiveNav();

/* ----------- FADE-IN ON SCROLL ----------- */
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // fade in once, then leave it be
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach(el => revealObserver.observe(el));
} else {
    revealEls.forEach(el => el.classList.add("visible"));
}

/* ----------- TIMELINE DRAWS ITSELF ON SCROLL ----------- */
const timeline = document.querySelector(".timeline");
const timelineLine = document.querySelector(".timeline-line");
const timelineItems = document.querySelectorAll(".timeline-item");
let timelineTicking = false;

function updateTimeline() {
    timelineTicking = false;

    // the line fills down to a point 60% of the way down the screen
    const drawTo = window.innerHeight * 0.6;
    const lineRect = timelineLine.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (drawTo - lineRect.top) / lineRect.height));
    timeline.style.setProperty("--progress", progress);
    timeline.classList.toggle("complete", progress >= 1);

    // light up each year's dot once the line reaches it
    const filledTo = lineRect.top + progress * lineRect.height;
    timelineItems.forEach(item => {
        const dot = item.querySelector(".timeline-circle").getBoundingClientRect();
        item.classList.toggle("reached", dot.top + dot.height / 2 <= filledTo + 1);
    });
}

function requestTimelineUpdate() {
    if (!timelineTicking) {
        timelineTicking = true;
        requestAnimationFrame(updateTimeline);
    }
}

window.addEventListener("scroll", requestTimelineUpdate, { passive: true });
window.addEventListener("resize", requestTimelineUpdate);
updateTimeline();

/* ----------- FOOTER YEAR ----------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ----------- TYPING ANIMATION ----------- */
const skillElement = document.getElementById("typed-skill");

const skills = [

    { word: "Canva", color: "#00c4cc" },
    { word: "CSS", color: "#264de4" },
    { word: "Excel", color: "#0f6b32" },
    { word: "Figma", color: "#8323ff" },
    { word: "HTML", color: "#e44d26" },
    { word: "JavaScript", color: "#e4c21a" },
    { word: "PowerPoint", color: "#d14423" },
    { word: "Python", color: "#366fb3" },
    { word: "SQL", color: "#8f9dff" },
    { word: "Tableau", color: "#4aa3ff" },

];

let skillIndex = 0;
let letterIndex = 0;
let deleting = false;

// Timing constants for smooth typing
const TYPING_DELAY = 150; // ms per character when typing
const DELETING_DELAY = 60; // ms per character when deleting
const FULL_WORD_PAUSE = 1500; // pause on full word before deleting

function typeEffect() {
    const current = skills[skillIndex];
    skillElement.style.color = current.color;
    if (!deleting) {
        skillElement.textContent = current.word.substring(0, letterIndex + 1);
        letterIndex++;

        if (letterIndex === current.word.length) {
            // pause on full word before deleting
            deleting = true;
            setTimeout(typeEffect, FULL_WORD_PAUSE);
            return;
        }
    } else {
        skillElement.textContent = current.word.substring(0, letterIndex - 1);
        letterIndex--;

        if (letterIndex === 0) {
            deleting = false;
            skillIndex = (skillIndex + 1) % skills.length;
        }
    }

    // use fixed delays for smooth, consistent timing
    const delay = deleting ? DELETING_DELAY : TYPING_DELAY;
    setTimeout(typeEffect, delay);
}

typeEffect();

/* ----------- EXPERIENCE TIMELINE POPOUTS ----------- */
document.querySelectorAll('.ticker').forEach(ticker => {
    ticker.addEventListener('click', () => {
        const experience = ticker.getAttribute('data-experience');
        const modal = document.getElementById(`popout-${experience}`);
        modal.classList.add('show');
    });
});

document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const experience = btn.getAttribute('data-close');
        const modal = document.getElementById(`popout-${experience}`);
        modal.classList.remove('show');
    });
});

// Close modal when clicking outside
document.querySelectorAll('.popout-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});
