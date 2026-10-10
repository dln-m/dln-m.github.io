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
// Blocks still waiting to fade in. Checked on every scroll frame (see onScrollFrame),
// so jumping straight to the bottom (nav link, restored scroll position) still reveals them.
const pendingReveals = Array.from(document.querySelectorAll(".reveal"));

function revealInView() {
    const limit = window.innerHeight - 40; // start fading just before a block is fully on screen
    for (let i = pendingReveals.length - 1; i >= 0; i--) {
        const rect = pendingReveals[i].getBoundingClientRect();
        if (rect.top < limit && rect.bottom > 0) {
            pendingReveals[i].classList.add("visible"); // fade in once, then leave it be
            pendingReveals.splice(i, 1);
        }
    }
}

/* ----------- TIMELINE DRAWS ITSELF ON SCROLL ----------- */
const timeline = document.querySelector(".timeline");
const timelineLine = document.querySelector(".timeline-line");
const timelineItems = document.querySelectorAll(".timeline-item");

function updateTimeline() {
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

/* ----------- SHARED SCROLL HANDLER ----------- */
// At most one update per animation frame, however fast scroll events arrive
let scrollTicking = false;

function onScrollFrame() {
    scrollTicking = false;
    revealInView();
    updateTimeline();
}

function requestScrollUpdate() {
    if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(onScrollFrame);
    }
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
window.addEventListener("load", requestScrollUpdate); // re-check once images have loaded and the layout is final
onScrollFrame();

/* ----------- SHARE THIS WEBSITE ----------- */
const shareButton = document.getElementById("share-site");
const shareStatus = document.getElementById("share-status");
const shareDefaultText = shareStatus.textContent;
// share the public address (the canonical link), not a local file path
const shareUrl = document.querySelector('link[rel="canonical"]')?.href || window.location.href;

function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }
    // fallback for older browsers / non-https pages
    return new Promise((resolve, reject) => {
        const field = document.createElement("textarea");
        field.value = text;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        const ok = document.execCommand("copy");
        field.remove();
        ok ? resolve() : reject(new Error("copy failed"));
    });
}

let shareResetTimer;
function showShareStatus(message, copied) {
    shareStatus.textContent = message;
    shareButton.classList.toggle("copied", copied);
    clearTimeout(shareResetTimer);
    shareResetTimer = setTimeout(() => {
        shareStatus.textContent = shareDefaultText;
        shareButton.classList.remove("copied");
    }, 2500);
}

shareButton.addEventListener("click", async () => {
    // phones (and some desktop browsers) have a native share sheet: Messages, email, LinkedIn, etc.
    if (navigator.share) {
        try {
            await navigator.share({ title: "Dolan Ma", text: "Check out Dolan Ma's website", url: shareUrl });
            return;
        } catch (e) {
            if (e.name === "AbortError") return; // user closed the share sheet
            // any other failure: fall through to copying the link
        }
    }
    try {
        await copyText(shareUrl);
        showShareStatus("Link copied ✓", true);
    } catch (e) {
        showShareStatus(shareUrl, false); // last resort: show the link so it can be copied by hand
    }
});

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
document.querySelectorAll('.exp-entry').forEach(entry => {
    entry.addEventListener('click', () => {
        const experience = entry.getAttribute('data-experience');
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

// Close any open modal with Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.popout-modal.show').forEach(modal => modal.classList.remove('show'));
    }
});
