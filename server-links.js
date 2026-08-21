const SUPABASE_URL = "https://vjvgvjdmwtmpefuwxtun.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ev-ZZXUY3oY9rbkMHH65Dw_ashMFtNe";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const linksList = document.getElementById("links-list");
const nameInput = document.getElementById("link-name");
const urlInput = document.getElementById("link-url");
const saveButton = document.getElementById("save-link");
const message = document.getElementById("links-message");

async function loadLinks() {

  linksList.innerHTML = "<p>Loading server links...</p>";

  const { data, error } = await supabaseClient
    .from("server_links")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error(error);

    linksList.innerHTML =
      "<p>❌ Unable to load server links.</p>";

    return;
  }

  if (!data || data.length === 0) {
    linksList.innerHTML =
      "<p>📭 No server links have been added yet.</p>";

    return;
  }

  linksList.innerHTML = data.map(link => `
    <div style="
      margin:20px 0;
      padding:25px;
      border:1px solid rgba(0,191,255,.4);
      border-radius:18px;
    ">

      <h2>🔗 ${escapeHtml(link.name || "Unnamed Link")}</h2>

      <p>
        ${escapeHtml(link.url || "")}
      </p>

      <a
        href="${escapeAttribute(link.url || "#")}"
        target="_blank"
        rel="noopener"
      >
        Open Link →
      </a>

    </div>
  `).join("");
}


async function saveLink() {

  const name = nameInput.value.trim();
  const url = urlInput.value.trim();

  if (!name) {
    message.textContent =
      "⚠️ Enter a link name.";

    return;
  }

  if (!url) {
    message.textContent =
      "⚠️ Enter a link URL.";

    return;
  }

  saveButton.disabled = true;
  message.textContent = "Saving...";

  const { error } = await supabaseClient
    .from("server_links")
    .insert({
      name: name,
      url: url
    });

  if (error) {

    console.error(error);

    message.textContent =
      "❌ Could not save the link.";

    saveButton.disabled = false;

    return;
  }

  message.textContent =
    "✅ Server link saved successfully.";

  nameInput.value = "";
  urlInput.value = "";

  await loadLinks();

  saveButton.disabled = false;
}


function escapeHtml(value) {

  const div = document.createElement("div");

  div.textContent = value;

  return div.innerHTML;
}


function escapeAttribute(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


if (saveButton) {

  saveButton.addEventListener(
    "click",
    saveLink
  );

}


loadLinks();
