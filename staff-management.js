const SUPABASE_URL =
  "https://vjvgvjdmwtmpefuwxtun.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_Ev-ZZXUY3oY9rbkMHH65Dw_ashMFtNe";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


// ==========================================
// LOAD REGISTERED USERS
// ==========================================

async function loadUsers() {

  const select =
    document.getElementById("user-select");

  if (!select) return;

  select.innerHTML =
    '<option value="">Loading users...</option>';

  try {

    const {
      data: users,
      error
    } = await supabaseClient
      .from("profiles")
      .select("id, username, display_name")
      .order("username", {
        ascending: true
      });

    if (error) {

      console.error(
        "User loading error:",
        error
      );

      select.innerHTML =
        '<option value="">Unable to load users</option>';

      return;
    }

    if (!users || users.length === 0) {

      select.innerHTML =
        '<option value="">No registered users</option>';

      return;
    }

    select.innerHTML =
      '<option value="">Select a user</option>';

    users.forEach(user => {

      const option =
        document.createElement("option");

      option.value = user.id;

      option.textContent =
        `${user.display_name || user.username} (@${user.username})`;

      select.appendChild(option);

    });

  } catch (error) {

    console.error(
      "GCRP user loading failed:",
      error
    );

    select.innerHTML =
      '<option value="">Unable to load users</option>';
  }
}


// ==========================================
// ADD STAFF MEMBER
// ==========================================

async function addStaffMember() {

  const userSelect =
    document.getElementById("user-select");

  const message =
    document.getElementById(
      "staff-management-message"
    );

  const button =
    document.getElementById(
      "add-staff-button"
    );

  if (!userSelect || !message) return;

  const userId =
    userSelect.value;

  if (!userId) {

    message.textContent =
      "⚠️ Please select a user.";

    return;
  }

  button.disabled = true;

  message.textContent =
    "Adding staff member...";

  try {

    const {
      data: { user },
      error: userError
    } =
      await supabaseClient.auth.getUser();

    if (userError || !user) {

      message.textContent =
        "❌ You must be logged in.";

      button.disabled = false;

      return;
    }


    const {
      data: existingStaff,
      error: existingError
    } =
      await supabaseClient
        .from("staff")
        .select("user_id, position, active")
        .eq("user_id", userId);


    if (existingError) {

      console.error(existingError);

      message.textContent =
        "❌ Could not check existing staff.";

      button.disabled = false;

      return;
    }


    if (
      existingStaff &&
      existingStaff.length > 0
    ) {

      message.textContent =
        "⚠️ This user is already a staff member.";

      button.disabled = false;

      return;
    }


    const {
      error: insertError
    } =
      await supabaseClient
        .from("staff")
        .insert({
          user_id: userId,
          position: "Moderator",
          assigned_by: user.id,
          active: true
        });


    if (insertError) {

      console.error(
        "Staff insertion error:",
        insertError
      );

      message.textContent =
        "❌ Could not add staff member. Check Supabase permissions.";

      button.disabled = false;

      return;
    }


    message.textContent =
      "✅ Staff member added as Moderator.";

    userSelect.value = "";

    await loadStaffManagement();

  } catch (error) {

    console.error(
      "GCRP Add Staff error:",
      error
    );

    message.textContent =
      "❌ Something went wrong.";

  }

  button.disabled = false;
}


// ==========================================
// LOAD CURRENT STAFF
// ==========================================

async function loadStaffManagement() {

  const container =
    document.getElementById(
      "staff-management-list"
    );

  if (!container) return;

  container.innerHTML =
    "<p>Loading staff members...</p>";


  try {

    const {
      data: staff,
      error: staffError
    } =
      await supabaseClient
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


    const userIds =
      staff.map(
        member => member.user_id
      );


    const {
      data: profiles,
      error: profileError
    } =
      await supabaseClient
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


    const profileMap = {};


    (profiles || []).forEach(profile => {

      profileMap[profile.id] =
        profile;

    });


    container.innerHTML =
      staff.map(member => {

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


        // Owner protection
        const isOwner =
          member.position === "Owner";


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
              ${escapeHtml(username)}
            </p>

            <p>
              <strong>Position:</strong>
              ${escapeHtml(
                member.position || "No position"
              )}
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
