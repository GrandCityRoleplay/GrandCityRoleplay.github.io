const SUPABASE_URL = "https://vjvgvjdmwtmpefuwxtun.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ev-ZZXUY3oY9rbkMHH65Dw_ashMFtNe";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function loadStaffManagement() {

  const container = document.getElementById(
    "staff-management-list"
  );

  if (!container) return;

  container.innerHTML = "<p>Loading staff members...</p>";

  try {

    const { data, error } = await supabaseClient
      .from("staff")
      .select("*")
      .order("created_at", {
        ascending: true
      });

    if (error) {
      console.error("Staff loading error:", error);

      container.innerHTML =
        "<p>❌ Unable to load staff members.</p>";

      return;
    }

    if (!data || data.length === 0) {

      container.innerHTML =
        "<p>📭 No staff members found.</p>";

      return;
    }

    container.innerHTML = data.map(staff => {

      const position =
        staff.position || "No position";

      const active =
        staff.active === true;

      return `
        <div style="
          margin:20px 0;
          padding:25px;
          border:1px solid rgba(0,191,255,.4);
          border-radius:18px;
        ">

          <h2>
            👤 ${escapeHtml(staff.user_id || "Unknown Staff")}
          </h2>

          <p>
            <strong>Position:</strong>
            ${escapeHtml(position)}
          </p>

          <p>
            <strong>Status:</strong>
            ${active ? "🟢 Active" : "🔴 Inactive"}
          </p>

          <p>
            <strong>Staff ID:</strong>
            ${escapeHtml(String(staff.id || ""))}
          </p>

          <p>
            <strong>Created:</strong>
            ${
              staff.created_at
                ? new Date(staff.created_at).toLocaleString()
                : "Unknown"
            }
          </p>

        </div>
      `;

    }).join("");

  } catch (error) {

    console.error(
      "GCRP Staff Management error:",
      error
    );

    container.innerHTML =
      "<p>❌ Something went wrong while loading staff.</p>";
  }
}


function escapeHtml(value) {

  const div = document.createElement("div");

  div.textContent = value;

  return div.innerHTML;
}


loadStaffManagement();
