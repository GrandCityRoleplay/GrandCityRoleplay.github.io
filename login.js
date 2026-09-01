const SUPABASE_URL =
  "https://vjvgvjdmwtmpefuwxtun.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_Ev-ZZXUY3oY9rbkMHH65Dw_ashMFtNe";


const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


const loginForm =
  document.getElementById("login-form");

const loginMessage =
  document.getElementById("login-message");

const forgotPassword =
  document.getElementById("forgot-password");


// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const email =
      document
        .getElementById("email")
        .value
        .trim();


    const password =
      document
        .getElementById("password")
        .value;


    loginMessage.textContent =
      "Logging in...";


    const {
      data,
      error
    } =
      await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
      });


    if (error) {

      console.error(error);

      loginMessage.textContent =
        "❌ " + error.message;

      return;

    }


    loginMessage.textContent =
      "✅ Login successful! Redirecting...";


    // Check user's role
    const user =
      data.user;


    const {
      data: profile,
      error: profileError
    } =
      await supabaseClient
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();


    if (profileError) {

      console.error(profileError);

      window.location.href =
        "index.html";

      return;

    }


    const adminRoles = [
      "owner",
      "chief_admin",
      "admin"
    ];


    // Redirect administrators
    if (
      adminRoles.includes(profile?.role)
    ) {

      window.location.href =
        "admin.html";

    } else {

      // Normal users
      window.location.href =
        "index.html";

    }

  }
);


// ==========================================
// FORGOT PASSWORD
// ==========================================

forgotPassword.addEventListener(
  "click",
  async (event) => {

    event.preventDefault();


    const email =
      document
        .getElementById("email")
        .value
        .trim();


    if (!email) {

      loginMessage.textContent =
        "⚠️ Enter your email first.";

      return;

    }


    loginMessage.textContent =
      "Sending password reset email...";


    const {
      error
    } =
      await supabaseClient.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            window.location.origin +
            "/reset-password.html"
        }
      );


    if (error) {

      console.error(error);

      loginMessage.textContent =
        "❌ " + error.message;

      return;

    }


    loginMessage.textContent =
      "📧 Password reset email sent.";

  }
);
