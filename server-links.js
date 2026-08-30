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


// ==========================================
// CURRENT LINK BEING EDITED
// ==========================================

let editingLinkId = null;


// ==========================================
// LOAD LINKS
// ==========================================

async function loadLinks() {

  linksList.innerHTML =
    "<p>Loading server links...</p>";

  const { data, error } = await supabaseClient
    .from("server_links")
    .select("*")
    .order("id", {
      ascending: true
    });

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

      <h2>
        🔗 ${escapeHtml(
          link.name || "Unnamed Link"
        )}
      </h2>


      <p>
        ${escapeHtml(link.url || "")}
      </p>


      <a
        href="${escapeAttribute(
          link.url || "#"
        )}"
        target="_blank"
        rel="noopener"
      >
        Open Link →
      </a>


      <div style="
        margin-top:20px;
        display:flex;
        gap:10px;
        flex-wrap:wrap;
      ">

        <button
          onclick="editLink(
            '${escapeJs(link.id)}',
            '${escapeJs(link.name || "")}',
            '${escapeJs(link.url || "")}'
          )"
          style="
            padding:10px 18px;
            border:none;
            border-radius:8px;
            cursor:pointer;
          "
        >
          ✏️ Edit
        </button>


        <button
          onclick="deleteLink(
            '${escapeJs(link.id)}'
          )"
          style="
            padding:10px 18px;
            border:none;
            border-radius:8px;
            cursor:pointer;
          "
        >
          🗑️ Delete
        </button>

      </div>

    </div>

  `).join("");
}


// ==========================================
// SAVE OR UPDATE LINK
// ==========================================

async function saveLink() {

  const name =
    nameInput.value.trim();

  const url =
    urlInput.value.trim();


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

  message.textContent =
    editingLinkId
      ? "Updating link..."
      : "Saving link...";


  let error;


  // UPDATE EXISTING LINK

  if (editingLinkId) {

    const result =
      await supabaseClient
        .from("server_links")
        .update({
          name: name,
          url: url
        })
        .eq("id", editingLinkId);

    error = result.error;

  }


  // ADD NEW LINK

  else {

    const result =
      await supabaseClient
        .from("server_links")
        .insert({
          name: name,
          url: url
        });

    error = result.error;

  }


  if (error) {

    console.error(error);

    message.textContent =
      "❌ Could not save the link.";

    saveButton.disabled = false;

    return;
  }


  message.textContent =
    editingLinkId
      ? "✅ Server link updated successfully."
      : "✅ Server link saved successfully.";


  // RESET FORM

  editingLinkId = null;

  nameInput.value = "";

  urlInput.value = "";

  saveButton.textContent =
    "💾 Save Link";


  await loadLinks();


  saveButton.disabled = false;
}


// ==========================================
// EDIT LINK
// ==========================================

function editLink(id, name, url) {

  editingLinkId = id;

  nameInput.value = name;

  urlInput.value = url;

  saveButton.textContent =
    "💾 Update Link";


  message.textContent =
    "✏️ You are editing this server link.";


  nameInput.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


// ==========================================
// DELETE LINK
// ==========================================

async function deleteLink(id) {

  const confirmed =
    confirm(
      "Are you sure you want to delete this server link?"
    );


  if (!confirmed) return;


  message.textContent =
    "Deleting...";


  const { error } =
    await supabaseClient
      .from("server_links")
      .delete()
      .eq("id", id);


  if (error) {

    console.error(error);

    message.textContent =
      "❌ Could not delete the link.";

    return;
  }


  message.textContent =
    "🗑️ Server link deleted successfully.";


  // IF DELETED LINK WAS BEING EDITED

  if (editingLinkId === id) {

    editingLinkId = null;

    nameInput.value = "";

    urlInput.value = "";

    saveButton.textContent =
      "💾 Save Link";
  }


  await loadLinks();
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHtml(value) {

  const div =
    document.createElement("div");

  div.textContent = value;

  return div.innerHTML;
}


// ==========================================
// ESCAPE HTML ATTRIBUTE
// ==========================================

function escapeAttribute(value) {

  return String(value)

    .replace(/&/g, "&amp;")

    .replace(/"/g, "&quot;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;");
}


// ==========================================
// ESCAPE JAVASCRIPT
// ==========================================

function escapeJs(value) {

  return String(value)

    .replace(/\\/g, "\\\\")

    .replace(/'/g, "\\'")

    .replace(/\n/g, "\\n")

    .replace(/\r/g, "\\r");
}


// ==========================================
// BUTTON EVENT
// ==========================================

if (saveButton) {

  saveButton.addEventListener(
    "click",
    saveLink
  );
}


// ==========================================
// LOAD LINKS
// ==========================================

loadLinks();
