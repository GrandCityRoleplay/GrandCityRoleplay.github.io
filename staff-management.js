const SUPABASE_URL = "https://vjvgvjdmwtmpefuwxtun.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ev-ZZXUY3oY9rbkMHH65Dw_ashMFtNe";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// ==========================================
// LOAD STAFF
// ==========================================

async function loadStaffManagement() {

  const container = document.getElementById(
    "staff-management-list"
  );

  if (!container) return;

  container.innerHTML =
    "<p>Loading staff members...</p>";

  try {

    // Get staff records
    const {
      data: staff,
      error: staffError
    } = await supabaseClient
      .from("staff")
      .select(
        "user_id, position, assigned_by, active, created_at"
      )
      .order("created_at", {
        ascending: true
      });


    if (staffError) {

      console.error(
        "Staff loading error:",
        staffError
      );

      container.innerHTML =
        "<p>❌ Unable to load staff members.</p>";

      return;
    }


    if (!staff || staff.length === 0) {

      container.innerHTML =
        "<p>📭 No staff members found.</p>";

      return;
    }


    // Get profile IDs
    const userIds = staff.map(
      member => member.user_id
    );


    // Get profile information
    const {
      data: profiles,
      error: profileError
    } = await supabaseClient
      .from("profiles")
      .select(
        "id, username, display_name"
      )
      .in("id", userIds);


    if (profileError) {

      console.error(
        "Profile loading error:",
        profileError
      );
    }


    // Create profile lookup
    const profileMap = {};

    (profiles || []).forEach(profile => {

      profileMap[profile.id] = profile;

    });


    // Display staff
    container.innerHTML = staff.map(member => {

      const profile =
        profileMap[member.user_id];

      const name =
        profile?.display_name ||
        profile?.username ||
        "Unknown Staff";


      const position =
        member.position ||
        "No position";


      const active =
        member.active === true;


      return `
        <div style="
          margin:20px 0;
          padding:25px;
          border:1px solid rgba(0,191,255,.4);
          border-radius:18px;
        ">

          <h2>
            👤 ${escapeHtml(name)}
          </h2>

          <p>
            <strong>Username:</strong>
            ${escapeHtml(
              profile?.username || "Unknown"
            )}
          </p>

          <p>
            <strong>Position:</strong>
            ${escapeHtml(position)}
          </p>

          <p>
            <strong>Status:</strong>
            ${
              active
                ? "🟢 Active"
                : "🔴 Inactive"
            }
          </p>

          <p>
            <strong>User ID:</strong>
            ${escapeHtml(member.user_id)}
          </p>

          <p>
            <strong>Added:</strong>
            ${
              member.created_at
                ? new Date(
                    member.created_at
                  ).toLocaleString()
                : "Unknown"
            }
          </p>

          <button
            onclick="toggleStaffStatus('${member.user_id}', ${active})"
            style="
              padding:12px 20px;
              margin-top:10px;
              cursor:pointer;
              border-radius:8px;
            "
          >
            ${
              active
                ? "🔴 Deactivate Staff"
                : "🟢 Activate Staff"
            }
          </button>

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


// ==========================================
// ACTIVATE / DEACTIVATE STAFF
// ==========================================

async function toggleStaffStatus(
  userId,
  currentStatus
) {

  const newStatus =
    !currentStatus;


  const {
    error
  } = await supabaseClient
    .from("staff")
    .update({
      active: newStatus
    })
    .eq("user_id", userId);


  if (error) {

    console.error(
      "Staff status update error:",
      error
    );

    alert(
      "❌ Could not update staff status."
    );

    return;
  }


  alert(
    newStatus
      ? "✅ Staff member activated."
      : "🔴 Staff member deactivated."
  );


  loadStaffManagement();
}


// ==========================================
// HTML SECURITY
// ==========================================

function escapeHtml(value) {

  const div =
    document.createElement("div");

  div.textContent =
    value ?? "";

  return div.innerHTML;
}


// ==========================================
// START
// ==========================================

loadStaffManagement();
