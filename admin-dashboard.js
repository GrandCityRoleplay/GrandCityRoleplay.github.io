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
// CHECK ADMIN ACCESS
// ==========================================

async function checkAdminAccess() {

  const status =
    document.getElementById("admin-status");

  const welcome =
    document.getElementById("welcome-message");


  try {

    const {
      data: { session },
      error
    } =
      await supabaseClient.auth.getSession();


    if (error || !session) {

      if (status) {

        status.textContent =
          "❌ You must log in to access the Admin Panel.";

      }

      return;
    }


    const user =
      session.user;


    const {
      data: profile,
      error: profileError
    } =
      await supabaseClient
        .from("profiles")
        .select("username, display_name, role")
        .eq("id", user.id)
        .maybeSingle();


    if (profileError) {

      console.error(
        "Profile loading error:",
        profileError
      );

      return;
    }


    const role =
      profile?.role;


    const allowedRoles = [

      "owner",
      "chief_admin",
      "admin"

    ];


    if (!allowedRoles.includes(role)) {

      if (status) {

        status.textContent =
          "❌ You do not have permission to access this panel.";

      }


      if (welcome) {

        welcome.textContent =
          "Access denied.";

      }

      return;
    }


    const name =
      profile?.display_name ||
      profile?.username ||
      "Administrator";


    if (welcome) {

      welcome.textContent =
        `Welcome back, ${name}.`;

    }


    if (status) {

      status.textContent =
        `🟢 Authorized as ${role}.`;

    }


    // LOAD DASHBOARD DATA

    loadDashboardStats();


  } catch (error) {

    console.error(
      "Admin authentication error:",
      error
    );

  }

}


// ==========================================
// LOAD DASHBOARD STATS
// ==========================================

async function loadDashboardStats() {

  try {


    // ACTIVE STAFF

    const {
      count: staffCount
    } =
      await supabaseClient
        .from("staff")
        .select(
          "*",
          {
            count: "exact",
            head: true
          }
        )
        .eq(
          "active",
          true
        );


    // TOTAL COMPLAINTS

    const {
      count: complaintCount
    } =
      await supabaseClient
        .from("complaints")
        .select(
          "*",
          {
            count: "exact",
            head: true
          }
        );


    // PENDING COMPLAINTS

    const {
      count: pendingCount
    } =
      await supabaseClient
        .from("complaints")
        .select(
          "*",
          {
            count: "exact",
            head: true
          }
        )
        .eq(
          "status",
          "pending"
        );


    // SERVER LINKS

    const {
      count: serverCount
    } =
      await supabaseClient
        .from("server_links")
        .select(
          "*",
          {
            count: "exact",
            head: true
          }
        );


    // DISPLAY RESULTS

    document.getElementById(
      "staff-count"
    ).textContent =
      staffCount ?? 0;


    document.getElementById(
      "complaint-count"
    ).textContent =
      complaintCount ?? 0;


    document.getElementById(
      "pending-count"
    ).textContent =
      pendingCount ?? 0;


    document.getElementById(
      "server-count"
    ).textContent =
      serverCount ?? 0;


  } catch (error) {

    console.error(
      "Dashboard statistics error:",
      error
    );

  }

}


// ==========================================
// START ADMIN PANEL
// ==========================================

checkAdminAccess();
