// Current year in the footer
document.getElementById("year").textContent = new Date().getFullYear();

// Dark / light mode, remembered in the browser
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try { localStorage.setItem("theme", theme); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
setTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
document.getElementById("themeToggle").addEventListener("click", () => {
  setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

// Mobile menu
const navLinks = document.getElementById("navLinks");
document.getElementById("menuBtn").addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

// ===== Intro: the collage spreads out and the story appears as you scroll =====
const intro = document.getElementById("intro");
const stage = intro.querySelector(".stage");
const pieces = [...intro.querySelectorAll(".piece")];
const beats = [...intro.querySelectorAll(".beat")];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Scroll windows for each beat, as fractions of the intro's scroll length
const windows = [[0, 0.2], [0.2, 0.45], [0.45, 0.68], [0.68, 1]];
const FADE = 0.07;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => t * t * (3 - 2 * t);

let offsets = [];
function measure() {
  const w = stage.clientWidth, h = stage.clientHeight;
  offsets = pieces.map((p) => {
    const cx = p.offsetLeft + p.offsetWidth / 2;
    const cy = p.offsetTop + p.offsetHeight / 2 + 64;
    return { dx: (cx - w / 2) * 0.75, dy: (cy - h / 2) * 0.6, d: parseFloat(p.style.getPropertyValue("--d")) || 1 };
  });
}

let mx = 0, my = 0, ticking = false;

function render() {
  ticking = false;
  const total = intro.offsetHeight - innerHeight;
  const p = clamp(-intro.getBoundingClientRect().top / total);

  const spread = ease(clamp((p - 0.12) / 0.6));
  const fade = 1 - 0.78 * ease(clamp((p - 0.5) / 0.25));
  pieces.forEach((el, i) => {
    const o = offsets[i];
    if (!o) return;
    const x = o.dx * spread + mx * o.d * 18;
    const y = o.dy * spread + my * o.d * 18;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    el.style.opacity = fade;
  });

  beats.forEach((el, i) => {
    const [a, b] = windows[i];
    let o = 1;
    if (i > 0) o = Math.min(o, (p - a) / FADE);
    if (i < beats.length - 1) o = Math.min(o, (b - p) / FADE);
    o = clamp(o);
    el.style.opacity = o;
    el.style.transform = `translateY(${(1 - o) * 18}px)`;
    el.classList.toggle("active", o > 0.5);
  });
}

function request() {
  if (!ticking) { ticking = true; requestAnimationFrame(render); }
}

addEventListener("scroll", request, { passive: true });
addEventListener("resize", () => { measure(); request(); });
if (!reduceMotion) {
  stage.addEventListener("mousemove", (e) => {
    mx = e.clientX / innerWidth - 0.5;
    my = e.clientY / innerHeight - 0.5;
    request();
  });
}
addEventListener("load", () => { measure(); request(); });
measure();
render();

// ===== Fade-up for content blocks =====
const revealTargets = document.querySelectorAll(
  ".section-title, .section-intro, .about-grid, .project, .skill-group, .contact-buttons"
);
revealTargets.forEach((el) => el.classList.add("reveal"));
const observer = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
  }),
  { threshold: 0.12 }
);
revealTargets.forEach((el) => observer.observe(el));

// ===== Project modal: the tile's sketch on top, the full write-up below =====
const modal = document.getElementById("projectModal");
const modalArt = modal.querySelector(".modal-art");
const modalBody = modal.querySelector(".modal-body");
document.querySelectorAll(".project .tile").forEach((tile) =>
  tile.addEventListener("click", () => {
    const project = tile.closest(".project");
    modalArt.innerHTML = tile.querySelector(".tile-art").innerHTML;
    modalBody.innerHTML = project.querySelector(".project-body").innerHTML;
    modalBody.classList.toggle("ai", project.classList.contains("ai"));
    modal.showModal();
    modal.scrollTop = 0;
    document.documentElement.style.overflow = "hidden";
  })
);
modal.querySelector(".modal-close").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
modal.addEventListener("close", () => { document.documentElement.style.overflow = ""; });
// In-page links inside the modal (like "Let's talk") close it before scrolling
modalBody.addEventListener("click", (e) => {
  if (e.target.closest('a[href^="#"]')) modal.close();
});

// ===== Project rails: sideways scrolling with arrow buttons =====
document.querySelectorAll(".projects-grid").forEach((grid) => {
  const rail = document.createElement("div");
  rail.className = "rail";
  grid.before(rail);
  rail.append(grid);

  const makeBtn = (dir, label, text) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `rail-btn ${dir}`;
    b.setAttribute("aria-label", label);
    b.textContent = text;
    b.addEventListener("click", () =>
      grid.scrollBy({ left: (dir === "prev" ? -1 : 1) * grid.clientWidth * 0.8 })
    );
    rail.append(b);
    return b;
  };
  const prev = makeBtn("prev", "Previous projects", "←");
  const next = makeBtn("next", "More projects", "→");

  const update = () => {
    // Center the arrows on the sketches
    const art = grid.querySelector(".tile-art");
    if (art) rail.style.setProperty("--art-h", `${art.offsetHeight / 2}px`);
    prev.hidden = grid.scrollLeft < 4;
    next.hidden = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 4;
    rail.classList.toggle("can-prev", !prev.hidden);
    rail.classList.toggle("can-next", !next.hidden);
  };
  grid.addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
  addEventListener("load", update);
  update();
});
