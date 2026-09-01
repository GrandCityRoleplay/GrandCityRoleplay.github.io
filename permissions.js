const SUPABASE_URL =
  "https://vjvgvjdmwtmpefuwxtun.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_Ev-ZZXUY3oY9rbkMHH65Dw_ashMFtNe";


const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


const staffSelect =
  document.getElementById("staff-select");

const positionSelect =
  document.getElementById("position-select");

const saveButton =
  document.getElementById("save-position");

const message =
  document.getElementById("permissions-message");


// ==========================================
// LOAD STAFF
// ==========================================

async function loadStaff() {

  if (!staffSelect) return;

  staffSelect.innerHTML =
    '<option value="">Loading staff...</option>';


  const {
    data: staff,
    error
  } =
    await supabaseClient
      .from("staff")
      .select(
        "user_id, position, active"
      )
      .order(
        "created_at",
        {
          ascending: true
        }
      );


  if (error) {

    console.error(error);

    staffSelect.innerHTML =
      '<option value="">Unable to load staff</option>';

    return;

  }


  if (!staff || staff.length === 0) {

    staffSelect.innerHTML =
      '<option value="">No staff members found</option>';

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
      profileError
    );

  }


  const profileMap = {};


  (profiles || []).forEach(
    profile => {

      profileMap[
        profile.id
      ] =
        profile;

    }
  );


  staffSelect.innerHTML =
    '<option value="">Select a staff member</option>';


  staff.forEach(
    member => {

      const profile =
        profileMap[
          member.user_id
        ];


      const name =
        profile?.display_name ||
        profile?.username ||
        "Unknown Staff";


      const option =
        document.createElement(
          "option"
        );


      option.value =
        member.user_id;


      option.textContent =
        `${name} — ${member.position || "No Position"}`;


      staffSelect.appendChild(
        option
      );

    }
  );

}


// ==========================================
// CHANGE STAFF POSITION
// ==========================================

async function changePosition() {

  const userId =
    staffSelect?.value;

  const position =
    positionSelect?.value;


  if (!userId) {

    message.textContent =
      "⚠️ Select a staff member.";

    return;

  }


  if (!position) {

    message.textContent =
      "⚠️ Select a new position.";

    return;

  }


  saveButton.disabled =
    true;


  message.textContent =
    "Updating staff position...";


  try {

    const {
      error
    } =
      await supabaseClient
        .from("staff")
        .update({

          position:
            position

        })
        .eq(
          "user_id",
          userId
        );


    if (error) {

      console.error(error);

      message.textContent =
        "❌ Could not update position.";

      saveButton.disabled =
        false;

      return;

    }


    message.textContent =
      `✅ Position changed to ${position}.`;


    positionSelect.value =
      "";


    await loadStaff();


  } catch (error) {

    console.error(error);

    message.textContent =
      "❌ Something went wrong.";

  }


  saveButton.disabled =
    false;

}


// ==========================================
// EVENT LISTENER
// ==========================================

if (saveButton) {

  saveButton.addEventListener(
    "click",
    changePosition
  );

}


// ==========================================
// START
// ==========================================

loadStaff();
