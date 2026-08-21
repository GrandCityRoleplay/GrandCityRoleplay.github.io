// GCRP COMPLAINTS MANAGEMENT

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
// LOAD COMPLAINTS
// ==========================================

async function loadComplaints() {

  const container =
    document.getElementById("complaints-list");

  container.innerHTML =
    "<p>Loading complaints...</p>";

  const { data, error } =
    await supabaseClient
      .from("complaints")
      .select("*")
      .order("created_at", {
        ascending: false
      });

  if (error) {

    console.error(
      "Complaint loading error:",
      error
    );

    container.innerHTML =
      "<p>❌ Unable to load complaints.</p>";

    return;
  }


  if (!data || data.length === 0) {

    container.innerHTML =
      "<p>📭 No complaints have been submitted yet.</p>";

    return;
  }


  container.innerHTML =
    data.map(complaint => {

      return `
        <div style="
          margin:20px 0;
          padding:25px;
          border:1px solid rgba(0,191,255,.4);
          border-radius:18px;
        ">

          <h2>
            📋 ${escapeHtml(
              complaint.subject ||
              "No subject"
            )}
          </h2>

          <p>
            ${escapeHtml(
              complaint.message || ""
            )}
          </p>

          <p>
            <strong>Complaint ID:</strong>
            ${complaint.id}
          </p>

          <p>
            <strong>Submitted:</strong>
            ${new Date(
              complaint.created_at
            ).toLocaleString()}
          </p>

          <label>
            <strong>Status:</strong>
          </label>

          <select
            class="complaint-status"
            data-id="${complaint.id}"
            style="
              display:block;
              margin-top:10px;
              padding:10px;
              width:100%;
              max-width:350px;
            "
          >

            <option value="Pending"
              ${complaint.status === "Pending"
                ? "selected"
                : ""}>
              🟡 Pending
            </option>

            <option value="Under Review"
              ${complaint.status === "Under Review"
                ? "selected"
                : ""}>
              🔵 Under Review
            </option>

            <option value="Resolved"
              ${complaint.status === "Resolved"
                ? "selected"
                : ""}>
              🟢 Resolved
            </option>

            <option value="Rejected"
              ${complaint.status === "Rejected"
                ? "selected"
                : ""}>
              🔴 Rejected
            </option>

          </select>

          <button
            class="save-status"
            data-id="${complaint.id}"
            style="
              margin-top:15px;
              padding:10px 18px;
              cursor:pointer;
            "
          >
            💾 Save Status
          </button>

          <p
            id="status-message-${complaint.id}"
          ></p>

        </div>
      `;

    }).join("");
}


// ==========================================
// SAVE COMPLAINT STATUS
// ==========================================

document.addEventListener(
  "click",
  async (event) => {

    const button =
      event.target.closest(".save-status");

    if (!button) return;


    const id = button.dataset.id;

    const select =
      document.querySelector(
        `.complaint-status[data-id="${id}"]`
      );

    const message =
      document.getElementById(
        `status-message-${id}`
      );


    const newStatus =
      select.value;


    button.disabled = true;

    message.textContent =
      "Saving...";


    const { error } =
      await supabaseClient
        .from("complaints")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);


    if (error) {

      console.error(
        "Status update error:",
        error
      );

      message.textContent =
        "❌ Could not update status.";

      button.disabled = false;

      return;
    }


    message.textContent =
      "✅ Status updated successfully.";

    button.disabled = false;

  }
);


// ==========================================
// SECURITY / HTML ESCAPING
// ==========================================

function escapeHtml(value) {

  const div =
    document.createElement("div");

  div.textContent = value;

  return div.innerHTML;
}


// ==========================================
// START
// ==========================================

loadComplaints();
