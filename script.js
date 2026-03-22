/* ----------- NAV ACTIVE HIGHLIGHT ----------- */
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(sec => {
        const sectionTop = sec.offsetTop - 200;
        if (window.scrollY >= sectionTop) current = sec.getAttribute("id");
    });

    navLinks.forEach(a => {
        a.classList.remove("active");
        if (a.getAttribute("href") === `#${current}`) {
            a.classList.add("active");
        }
    });
});

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

/* ----------- CONTACT FORM (Simple Handler) ----------- */
document.getElementById("contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been sent.");
});

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
