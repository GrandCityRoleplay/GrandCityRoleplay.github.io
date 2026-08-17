const SUPABASE_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
const SUPABASE_KEY = "sb_publishable_Ev-ZZXUY3oY9rbkMHH65Dw_ashMFtNe";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const form = document.getElementById("complaint-form");
const statusMessage = document.getElementById("complaint-status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  statusMessage.textContent = "Submitting complaint...";

  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!subject || !message) {
    statusMessage.textContent = "Please complete both fields.";
    return;
  }

  try {
    const {
      data: { user },
      error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      statusMessage.textContent =
        "Please log in before submitting a complaint.";
      return;
    }

    const { error } = await supabaseClient
      .from("complaints")
      .insert({
        citizen_id: user.id,
        subject: subject,
        message: message,
        status: "pending"
      });

    if (error) {
      console.error(error);
      statusMessage.textContent =
        "Unable to submit complaint. Please try again.";
      return;
    }

    statusMessage.textContent =
      "✅ Complaint submitted successfully!";

    form.reset();

  } catch (error) {
    console.error(error);
    statusMessage.textContent =
      "Something went wrong. Please try again.";
  }
});
