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
