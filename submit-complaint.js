const SUPABASE_URL =
  "https://vjvgvjdmwtmpefuwxtun.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_Ev-ZZXUY3oY9rbkMHH65Dw_ashMFtNe";


const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


const form =
  document.getElementById("complaint-form");

const statusMessage =
  document.getElementById("complaint-status");


if (form) {

  form.addEventListener("submit", async (event) => {

    event.preventDefault();

    statusMessage.textContent =
      "Submitting complaint...";


    const subject =
      document.getElementById("subject")
        .value
        .trim();

    const message =
      document.getElementById("message")
        .value
        .trim();


    if (!subject || !message) {

      statusMessage.textContent =
        "Please complete both fields.";

      return;
    }


    try {

      const {
        data: { user },
        error: userError
      } =
        await supabaseClient.auth.getUser();


      if (userError || !user) {

        statusMessage.textContent =
          "Please log in before submitting a complaint.";

        return;
      }


      const {
        error: insertError
      } =
        await supabaseClient
          .from("complaints")
          .insert({
            citizen_id: user.id,
            subject: subject,
            message: message,
            status: "pending"
          });


      if (insertError) {

        console.error(
          "Complaint submission error:",
          insertError
        );

        statusMessage.textContent =
          "❌ Unable to submit complaint.";

        return;
      }


      statusMessage.textContent =
        "✅ Complaint submitted successfully!";


      form.reset();


    } catch (error) {

      console.error(
        "Complaint error:",
        error
      );

      statusMessage.textContent =
        "❌ Something went wrong. Please try again.";
    }

  });

    }
