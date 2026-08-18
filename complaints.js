const SUPABASE_URL = "https://vjvgvjdmwtmpefuwxtun.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ev-ZZXUY3oY9rbkMHH65Dw_ashMFtNe";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function loadComplaints() {
  const container = document.getElementById("complaints-list");

  const { data, error } = await supabaseClient
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    container.innerHTML = `
      <p>❌ Unable to load complaints.</p>
      <p>${escapeHtml(error.message)}</p>
    `;
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML =
      "<p>📭 No complaints have been submitted yet.</p>";
    return;
  }

  container.innerHTML = data.map(complaint => `
    <div style="
      margin:20px 0;
      padding:25px;
      border:1px solid rgba(0,191,255,.4);
      border-radius:18px;
    ">
      <h2>📋 ${escapeHtml(complaint.subject || "No subject")}</h2>

      <p>${escapeHtml(complaint.message || "")}</p>

      <p>
        <strong>Status:</strong>
        ${escapeHtml(complaint.status || "Pending")}
      </p>

      <p>
        <strong>Complaint ID:</strong>
        ${complaint.id}
      </p>

      <p>
        <strong>Submitted:</strong>
        ${new Date(complaint.created_at).toLocaleString()}
      </p>
    </div>
  `).join("");
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

loadComplaints();
