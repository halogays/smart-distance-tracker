/* ============================================================
   1) Smooth Scroll dengan Offset Header
   ============================================================ */
const header = document.querySelector(".header");
const navLinks = document.querySelectorAll('.nav a[href^="#"]');

function smoothScrollWithOffset(target) {
  const el = document.querySelector(target);
  if (!el) return;

  const headerH = header ? header.offsetHeight : 0;
  const y = el.getBoundingClientRect().top + window.scrollY - headerH - 12;

  window.scrollTo({ top: y, behavior: "smooth" });
}

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (!id || !id.startsWith("#")) return;

    e.preventDefault();
    smoothScrollWithOffset(id);
    history.pushState(null, "", id);
  });
});

/* ============================================================
   2) Highlight Nav Aktif Saat Scroll
   ============================================================ */
const sections = Array.from(document.querySelectorAll("main section"));

function setActiveNav(id) {
  document.querySelectorAll(".nav a").forEach(a => a.classList.remove("active"));
  const active = document.querySelector(`.nav a[href="${id}"]`);
  if (active) active.classList.add("active");
}

function onScroll() {
  const headerH = (header ? header.offsetHeight : 0) + 30;
  let current = "";

  sections.forEach(sec => {
    const top = sec.offsetTop - headerH;
    const bottom = top + sec.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) current = "#" + sec.id;
  });

  if (current) setActiveNav(current);
}

window.addEventListener("scroll", onScroll);
window.addEventListener("load", () => {
  onScroll();
  if (location.hash) smoothScrollWithOffset(location.hash);
});

/* ============================================================
   3) Lightbox / Preview Gambar (klik gambar = zoom)
   ============================================================ */
const lightbox = document.createElement("div");
lightbox.id = "lightbox";
lightbox.className = "lightbox";
lightbox.innerHTML = `
  <div class="lightbox-inner" role="dialog" aria-modal="true" aria-label="Preview gambar">
    <img id="lightbox-img" src="" alt="preview">
    <p class="lightbox-hint">Klik area gelap untuk menutup (atau tekan ESC)</p>
  </div>
`;
document.body.appendChild(lightbox);

const lightboxImg = document.getElementById("lightbox-img");

document.querySelectorAll("img").forEach(img => {
  img.style.cursor = "zoom-in";
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightbox.classList.add("show");
  });
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove("show");
    lightboxImg.src = "";
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("show")) {
    lightbox.classList.remove("show");
    lightboxImg.src = "";
  }
});