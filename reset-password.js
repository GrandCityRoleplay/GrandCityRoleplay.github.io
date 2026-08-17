const SUPABASE_URL = "https://vjvgvjdmwtmpefuwxtun.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ev-ZZXUY3oY9rbkMHH65Dw_ashMFtNe";

const form = document.getElementById("reset-form");
const message = document.getElementById("reset-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const password = document.getElementById("password").value;
  const confirmPassword =
    document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    message.textContent = "Passwords do not match.";
    return;
  }

  message.textContent = "Updating password...";

  try {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const accessToken = params.get("access_token");

    if (!accessToken) {
      throw new Error("Recovery session not found. Please request a new reset email.");
    }

    const response = await fetch(
      `${SUPABASE_URL}/auth/v1/user`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          password: password
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Password update failed.");
    }

    message.textContent =
      "Password updated successfully! You can now log in.";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);

  } catch (error) {
    console.error(error);
    message.textContent = error.message;
  }
});
