// Grand City Roleplay website configuration.
const GCRP = {
  links: {
    game: "#game-coming-soon",
    globalDiscord: "https://discord.gg/ZrdcWg6J5",
    candidate1: "https://discord.gg/BDyeXWt4S",
    candidate2: "https://discord.gg/FUmSkeZR9",
    org1: "https://discord.gg/bdNXmpEkX",
    org2: "https://discord.gg/XnPeKCuRh",
  },

  supabase: {
    url: "https://vjvgvjdmwtmpefuwxtun.supabase.co",
    key: "sb_publishable_Ev-ZZXUY3oY9rbkMHH65Dw_ashMFtNe"
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
const revealItems = document.querySelectorAll(
  ".feature-grid article,.server-card,.org-card,.rules-grid article,.news-card"
);

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
  el.style.transition =
    "opacity .6s ease, transform .6s ease, border-color .3s ease";
  observer.observe(el);
});

// ==========================================
// GCRP STAFF — SUPABASE
// ==========================================

async function loadGCRPStaff() {
  const container = document.querySelector("#staff-list");

  if (!container) return;

  try {
    const response = await fetch(
      `${GCRP.supabase.url}/rest/v1/staff?select=position,active,profiles(username,display_name)&active=eq.true&order=created_at.asc`,
      {
        headers: {
          "apikey": GCRP.supabase.key,
          "Authorization": `Bearer ${GCRP.supabase.key}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`);
    }

    const staff = await response.json();

    if (staff.length === 0) {
      container.innerHTML = "<p>No active staff members found.</p>";
      return;
    }

    container.innerHTML = staff.map(member => {
      const name =
        member.profiles?.display_name ||
        member.profiles?.username ||
        "GCRP Staff";

      return `
  <div class="staff-card"
       data-name="${name}"
       data-position="${member.position}">
    <h3>${name}</h3>
    <p>${member.position}</p>
    <span>🟢 Active</span>
  </div>
`;
    }).join("");

  } catch (error) {
    console.error("GCRP Staff loading failed:", error);
    container.innerHTML =
      "<p>Unable to load staff information.</p>";
  }
}

loadGCRPStaff();

document.addEventListener("click", (event) => {
  const card = event.target.closest(".staff-card");
  const profile = document.querySelector("#staff-profile");
  const content = document.querySelector("#staff-profile-content");

  if (!card || !profile || !content) return;

  content.innerHTML = `
    <h2>${card.dataset.name}</h2>
    <p><strong>Position:</strong> ${card.dataset.position}</p>
    <p><strong>Status:</strong> 🟢 Active</p>
  `;

  profile.hidden = false;
});

document.addEventListener("click", (event) => {
  if (event.target.id === "close-staff-profile") {
    const profile = document.querySelector("#staff-profile");

    if (profile) {
      profile.hidden = true;
    }
  }
});
async function checkGCRPAdmin() {
  const token = localStorage.getItem("gcrp_access_token");
  const adminLink = document.querySelector("#admin-link");

  if (!token || !adminLink) return;

  try {
    const response = await fetch(
      `${GCRP.supabase.url}/auth/v1/user`,
      {
        headers: {
          "apikey": GCRP.supabase.key,
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
  alert("GCRP DEBUG: Auth token is not being accepted.");
  return;
    }

    const user = await response.json();

    const profileResponse = await fetch(
      `${GCRP.supabase.url}/rest/v1/profiles?id=eq.${user.id}&select=role`,
      {
        headers: {
          "apikey": GCRP.supabase.key,
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!profileResponse.ok) {
  alert("GCRP DEBUG: Profile request failed.");
  return;
    }

    const profiles = await profileResponse.json();
    const role = profiles[0]?.role;
    alert("GCRP DEBUG: Your profile role is: " + role);

    if (["owner", "chief_admin", "admin"].includes(role)) {
      adminLink.style.display = "";
    }

  } catch (error) {
    console.error("GCRP admin check failed:", error);
  }
}

checkGCRPAdmin();
