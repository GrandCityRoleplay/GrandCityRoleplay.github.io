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
// ESCAPE HTML
// ==========================================

function escapeHtml(value) {

  const div =
    document.createElement("div");

  div.textContent =
    value ?? "";

  return div.innerHTML;
}


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
    } =
      await supabaseClient
        .from("profiles")
        .select(
          "id, username, display_name"
        )
        .order(
          "username",
          {
            ascending: true
          }
        );


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
        '<option value="">No registered users found</option>';

      return;
    }


    select.innerHTML =
      '<option value="">Select a user</option>';


    users.forEach(user => {

      const option =
        document.createElement("option");


      option.value =
        user.id;


      const name =
        user.display_name ||
        user.username ||
        "Unknown User";


      option.textContent =
        `${name} (@${user.username || "unknown"})`;


      select.appendChild(option);

    });


  } catch (error) {

    console.error(
      "User loading failed:",
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
    document.getElementById(
      "user-select"
    );


  const message =
    document.getElementById(
      "staff-management-message"
    );


  const button =
    document.getElementById(
      "add-staff-button"
    );


  if (
    !userSelect ||
    !message ||
    !button
  ) return;


  const userId =
    userSelect.value;


  if (!userId) {

    message.textContent =
      "⚠️ Please select a registered user.";

    return;

  }


  button.disabled =
    true;


  message.textContent =
    "Adding staff member...";


  try {

    const {
      data: {
        user
      },
      error: userError
    } =
      await supabaseClient
        .auth
        .getUser();


    if (
      userError ||
      !user
    ) {

      message.textContent =
        "❌ You must be logged in.";

      button.disabled =
        false;

      return;

    }


    // Check if already staff

    const {
      data: existingStaff,
      error: checkError
    } =
      await supabaseClient
        .from("staff")
        .select(
          "user_id"
        )
        .eq(
          "user_id",
          userId
        )
        .maybeSingle();


    if (checkError) {

      console.error(
        checkError
      );


      message.textContent =
        "❌ Could not check staff records.";

      button.disabled =
        false;

      return;

    }


    if (existingStaff) {

      message.textContent =
        "⚠️ This user is already a staff member.";

      button.disabled =
        false;

      return;

    }


    // Add staff

    const {
      error: insertError
    } =
      await supabaseClient
        .from("staff")
        .insert({

          user_id:
            userId,

          position:
            "Moderator",

          assigned_by:
            user.id,

          active:
            true

        });


    if (insertError) {

      console.error(
        "Staff insertion error:",
        insertError
      );


      message.textContent =
        "❌ Could not add staff member.";

      button.disabled =
        false;

      return;

    }


    message.textContent =
      "✅ Staff member added successfully as Moderator.";


    userSelect.value =
      "";


    await loadStaffManagement();


  } catch (error) {

    console.error(
      "Add staff error:",
      error
    );


    message.textContent =
      "❌ Something went wrong.";

  }


  button.disabled =
    false;

}


// ==========================================
// TOGGLE STAFF STATUS
// ==========================================

async function toggleStaffStatus(
  userId,
  currentStatus
) {

  const newStatus =
    !currentStatus;


  const {
    error
  } =
    await supabaseClient
      .from("staff")
      .update({

        active:
          newStatus

      })
      .eq(
        "user_id",
        userId
      );


  if (error) {

    console.error(
      error
    );


    alert(
      "❌ Could not update staff status."
    );

    return;

  }


  await loadStaffManagement();

}


// ==========================================
// REMOVE STAFF
// ==========================================

async function removeStaff(
  userId
) {

  const confirmed =
    confirm(
      "Are you sure you want to remove this staff member?"
    );


  if (!confirmed)
    return;


  const {
    error
  } =
    await supabaseClient
      .from("staff")
      .delete()
      .eq(
        "user_id",
        userId
      );


  if (error) {

    console.error(
      error
    );


    alert(
      "❌ Could not remove staff member."
    );

    return;

  }


  await loadStaffManagement();

}


// ==========================================
// LOAD CURRENT STAFF
// ==========================================

async function loadStaffManagement() {

  const container =
    document.getElementById(
      "staff-management-list"
    );


  if (!container)
    return;


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
          "user_id, position, active, created_at"
        )
        .order(
          "created_at",
          {
            ascending:
              true
          }
        );


    if (staffError) {

      console.error(
        "Staff loading error:",
        staffError
      );


      container.innerHTML =
        "<p>❌ Unable to load staff members.</p>";

      return;

    }


    if (
      !staff ||
      staff.length === 0
    ) {

      container.innerHTML =
        "<p>📭 No staff members found.</p>";

      return;

    }


    const userIds =
      staff.map(
        member =>
          member.user_id
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
        .in(
          "id",
          userIds
        );


    if (profileError) {

      console.error(
        "Profile loading error:",
        profileError
      );

    }


    const profileMap =
      {};


    (profiles || []).forEach(
      profile => {

        profileMap[
          profile.id
        ] =
          profile;

      }
    );


    container.innerHTML =
      staff.map(
        member => {

          const profile =
            profileMap[
              member.user_id
            ];


          const name =
            profile?.display_name ||
            profile?.username ||
            "Unknown Staff";


          const username =
            profile?.username ||
            "Unknown";


          const active =
            member.active ===
            true;


          const isOwner =
            member.position ===
            "Owner";


          const date =
            member.created_at
              ? new Date(
                  member.created_at
                ).toLocaleDateString()
              : "Unknown";


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
      member.position ||
      "No position"
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
    <strong>Added:</strong>
    ${escapeHtml(date)}
  </p>


  ${
    isOwner
      ? `

        <p>
          👑 Owner account protected.
        </p>

      `

      : `

<div style="
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  margin-top:20px;
">

<button
  onclick='toggleStaffStatus(
    "${member.user_id}",
    ${active}
  )'
>

${
  active
    ? "🔴 Deactivate"
    : "🟢 Activate"
}

</button>


<button
  onclick='removeStaff(
    "${member.user_id}"
  )'
>

🗑️ Remove

</button>

</div>

      `
  }

</div>

          `;

        }
      )
      .join("");


  } catch (error) {

    console.error(
      "Staff management error:",
      error
    );


    container.innerHTML =
      "<p>❌ Something went wrong while loading staff.</p>";

  }

}


// ==========================================
// EVENT LISTENER
// ==========================================

const addStaffButton =
  document.getElementById(
    "add-staff-button"
  );


if (addStaffButton) {

  addStaffButton.addEventListener(
    "click",
    addStaffMember
  );

}


// ==========================================
// START
// ==========================================

loadUsers();

loadStaffManagement();
