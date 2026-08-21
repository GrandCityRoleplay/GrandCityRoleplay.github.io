const SUPABASE_URL = "https://vjvgvjdmwtmpefuwxtun.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ev-ZZXUY3oY9rbkMHH65Dw_ashMFtNe";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const staffSelect = document.getElementById("staff-select");
const positionSelect = document.getElementById("position-select");
const saveButton = document.getElementById("save-position");
const message = document.getElementById("permissions-message");


async function loadStaff() {

  if (!staffSelect) return;

  staffSelect.innerHTML =
    '<option value="">Loading staff...</option>';

  const { data, error } = await supabaseClient
    .from("staff")
    .select("id,user_id,position,active")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load staff:", error);

    staffSelect.innerHTML =
      '<option value="">Unable to load staff</option>';

    return;
  }

  if (!data || data.length === 0) {
    staffSelect.innerHTML =
      '<option value="">No staff members found</option>';

    return;
  }

  staffSelect.innerHTML =
    '<option value="">Select a staff member</option>';

  data.forEach(staff => {

    const option = document.createElement("option");

    option.value = staff.id;

    option.textContent =
      `${staff.user_id} — ${staff.position || "No position"}${
        staff.active ? "" : " (Inactive)"
      }`;

    staffSelect.appendChild(option);
  });
}


async function savePosition() {

  const staffId = staffSelect.value;
  const newPosition = positionSelect.value;

  if (!staffId) {
    message.textContent =
      "⚠️ Please select a staff member.";
    return;
  }

  if (!newPosition) {
    message.textContent =
      "⚠️ Please select a position.";
    return;
  }

  saveButton.disabled = true;
  message.textContent = "Saving...";

  const { error } = await supabaseClient
    .from("staff")
    .update({
      position: newPosition
    })
    .eq("id", staffId);

  if (error) {

    console.error("Position update failed:", error);

    message.textContent =
      "❌ Could not update the position. Check Supabase permissions.";

    saveButton.disabled = false;
    return;
  }

  message.textContent =
    `✅ Position changed to ${newPosition}.`;

  await loadStaff();

  saveButton.disabled = false;
}


if (saveButton) {
  saveButton.addEventListener(
    "click",
    savePosition
  );
}


loadStaff();
