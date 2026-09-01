const SUPABASE_URL =
  "https://vjvgvjdmwtmpefuwxtun.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_Ev-ZZXUY3oY9rbkMHH65Dw_ashMFtNe";


const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


const registerForm =
  document.getElementById("register-form");

const registerMessage =
  document.getElementById("register-message");


// ==========================================
// REGISTER ACCOUNT
// ==========================================

registerForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const username =
      document
        .getElementById("username")
        .value
        .trim();


    const displayName =
      document
        .getElementById("display-name")
        .value
        .trim();


    const email =
      document
        .getElementById("email")
        .value
        .trim();


    const password =
      document
        .getElementById("password")
        .value;


    if (!username) {

      registerMessage.textContent =
        "⚠️ Please enter a username.";

      return;

    }


    registerMessage.textContent =
      "Creating your GCRP account...";


    // Create Supabase account
    const {
      data,
      error
    } =
      await supabaseClient.auth.signUp({

        email: email,

        password: password,

        options: {

          data: {

            username: username,

            display_name: displayName

          }

        }

      });


    if (error) {

      console.error(error);

      registerMessage.textContent =
        "❌ " + error.message;

      return;

    }


    // If user was created
    if (data.user) {

      registerMessage.textContent =
        "✅ Account created successfully! Check your email if confirmation is required.";

    }

  }
);
