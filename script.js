// Grand City Roleplay website configuration.
// Replace the placeholder URLs below with your real links.
// Keep each URL as a normal https:// link.
const GCRP = {
  links: {
    game: "#game-coming-soon",
    globalDiscord: "https://discord.gg/ZrdcWg6J5",
    candidate1: "https://discord.gg/BDyeXWt4S",
    candidate2: "https://discord.gg/FUmSkeZR9",
    org1: "https://discord.gg/bdNXmpEkX",
    org2: "https://discord.gg/XnPeKCuRh",
  }
};

document.querySelectorAll("[data-link]").forEach((el) => {
  const key = el.dataset.link;
  if (GCRP.links[key]) el.href = GCRP.links[key];
});

// Mobile navigation
const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");
if (menu) {
  menu.addEventListener("click", () => {
    const open = nav.style.display === "flex";
    nav.style.display = open ? "" : "flex";
    nav.style.flexDirection = "column";
    nav.style.position = "absolute";
    nav.style.top = "66px";
    nav.style.right = "0";
    nav.style.padding = "18px 24px";
    nav.style.background = "rgba(5,7,11,.96)";
    nav.style.border = "1px solid rgba(255,255,255,.1)";
    nav.style.borderRadius = "0 0 0 12px";
  });
}

// Small reveal animation
const revealItems = document.querySelectorAll(".feature-grid article,.server-card,.org-card,.rules-grid article,.news-card");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

revealItems.forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(16px)";
  el.style.transition = "opacity .6s ease, transform .6s ease, border-color .3s ease";
  observer.observe(el);
});
