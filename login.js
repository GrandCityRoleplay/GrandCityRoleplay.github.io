const SUPABASE_URL = "https://vjvgvjdmwtmpefuwxtun.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ev-ZZXUY3oY9rbkMHH65Dw_ashMFtNe";

const form = document.getElementById("login-form");
const message = document.getElementById("login-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  message.textContent = "Signing in...";

  try {
    const response = await fetch(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error_description || "Login failed.");
    }

    localStorage.setItem("gcrp_access_token", data.access_token);

    message.textContent = "Login successful!";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 500);

  } catch (error) {
    console.error(error);
    message.textContent = error.message;
  }
});
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

    try {
      const response = await fetch(
        `${SUPABASE_URL}/auth/v1/recover`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY
          },
          body: JSON.stringify({
            email,
            redirect_to:
              "https://grandcityroleplay.github.io/reset-password.html"
          })
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || data.message || "Could not send recovery email.");
      }

      message.textContent =
        "Recovery email sent! Check your inbox.";
    } catch (error) {
      console.error(error);
      message.textContent = error.message;
    }
  });
}
