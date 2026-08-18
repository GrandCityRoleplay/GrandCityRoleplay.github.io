const SUPABASE_URL = "https://vjvgvjdmwtmpefuwxtun.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ev-ZZXUY3oY9rbkMHH65Dw_ashMFtNe";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const form = document.getElementById("login-form");
const message = document.getElementById("login-message");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    message.textContent = "Signing in...";

    const { data, error } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      console.error(error);
      message.textContent = error.message;
      return;
    }

    if (!data.session) {
      message.textContent = "Login failed: no session received.";
      return;
    }

    message.textContent = "Login successful!";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 500);
  });
}

const forgotPassword = document.getElementById("forgot-password");

if (forgotPassword) {
  forgotPassword.addEventListener("click", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    if (!email) {
      message.textContent = "Enter your email first.";
      return;
    }

    message.textContent = "Sending recovery email...";

    const { error } = await supabaseClient.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:
          "https://grandcityroleplay.github.io/reset-password.html"
      }
    );

    if (error) {
      console.error(error);
      message.textContent = error.message;
      return;
    }

    message.textContent =
      "Recovery email sent! Check your inbox.";
  });
}
