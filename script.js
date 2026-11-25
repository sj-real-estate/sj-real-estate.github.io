const WHATSAPP_NUMBER = "923214250289";
const EMAIL_ADDRESS = "sharjeelayub.sa@gmail.com";

const header = document.getElementById("header");
const nav = document.getElementById("nav");
const menuToggle = document.getElementById("menuToggle");

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 30);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el, index) => {
  el.style.transitionDelay = `${(index % 4) * 80}ms`;
  revealObserver.observe(el);
});

const sectionLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = `#${entry.target.id}`;
        sectionLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === id);
        });
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

function validateRequired(form, errorEl) {
  let valid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    const empty = field.value.trim() === "";
    field.classList.toggle("invalid", empty);
    if (empty) valid = false;
  });
  errorEl.textContent = valid ? "" : "Please fill in all required fields.";
  return valid;
}

function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

const enquiryForm = document.getElementById("enquiryForm");
const enquiryError = document.getElementById("enquiryError");

enquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateRequired(enquiryForm, enquiryError)) return;

  const data = new FormData(enquiryForm);
  const lines = [
    "Hello SJ Real Estate & Builders,",
    "",
    `Name: ${data.get("name").trim()}`,
    `Looking for: ${data.get("need")}`,
  ];
  if (data.get("area").trim()) lines.push(`Preferred area: ${data.get("area").trim()}`);
  if (data.get("budget").trim()) lines.push(`Budget: PKR ${data.get("budget").trim()}`);

  openWhatsApp(lines.join("\n"));
  enquiryForm.reset();
});

const contactForm = document.getElementById("contactForm");
const contactError = document.getElementById("contactError");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateRequired(contactForm, contactError)) return;

  const data = new FormData(contactForm);
  const name = data.get("name").trim();
  const phone = data.get("phone").trim();
  const subject = data.get("subject");
  const message = data.get("message").trim();
  const channel = event.submitter ? event.submitter.dataset.channel : "whatsapp";

  const body = `Name: ${name}\nPhone: ${phone}\nSubject: ${subject}\n\n${message}`;

  if (channel === "email") {
    const mailto = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  } else {
    openWhatsApp(`Hello SJ Real Estate & Builders,\n\n${body}`);
  }

  contactForm.reset();
});

document.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => field.classList.remove("invalid"));
});

document.getElementById("year").textContent = new Date().getFullYear();
