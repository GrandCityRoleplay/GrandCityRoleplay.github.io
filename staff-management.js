const SUPABASE_URL = "https://vjvgvjdmwtmpefuwxtun.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ev-ZZXUY3oY9rbkMHH65Dw_ashMFtNe";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// ==========================================
// AVAILABLE STAFF POSITIONS
// ==========================================

const STAFF_POSITIONS = [
  "Moderator",
  "Admin",
  "Chief Administrator",
  "Owner"
];


// ==========================================
// LOAD STAFF
// ==========================================

async function loadStaffManagement() {

  const container =
    document.getElementById("staff-management-list");

  if (!container) return;

  container.innerHTML =
    "<p>Loading staff members...</p>";

  try {

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
      console.error(staffError);
      container.innerHTML =
        "<p>❌ Unable to load staff members.</p>";
      return;
    }

    if (!staff || staff.length === 0) {
      container.innerHTML =
        "<p>📭 No staff members found.</p>";
      return;
    }


    // Get profiles
    const userIds =
      staff.map(member => member.user_id);

    const {
      data: profiles
    } = await supabaseClient
      .from("profiles")
      .select("id, username, display_name")
      .in("id", userIds);


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

      const username =
        profile?.username ||
        "Unknown";

      const active =
        member.active === true;


      const positionOptions =
        STAFF_POSITIONS.map(position => `
          <option
            value="${escapeHtml(position)}"
            ${member.position === position ? "selected" : ""}
          >
            ${escapeHtml(position)}
          </option>
        `).join("");


      return `
        <div style="
          margin:20px 0;
          padding:25px;
          border:1px solid rgba(0,191,255,.
