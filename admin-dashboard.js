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
      error: sessionError
    } =
      await supabaseClient.auth.getSession();


    // USER IS NOT LOGGED IN

    if (sessionError || !session) {

      console.log(
        "Admin access denied: No active session."
      );

      window.location.href =
        "index.html";

      return;
    }


    const user =
      session.user;


    // LOAD USER PROFILE

    const {
      data: profile,
      error: profileError
    } =
      await supabaseClient
        .from("profiles")
        .select(
          "username, display_name, role"
        )
        .eq(
          "id",
          user.id
        )
        .maybeSingle();


    if (profileError || !profile) {

      console.error(
        "Profile loading error:",
        profileError
      );

      window.location.href =
        "index.html";

      return;
    }


    const role =
      profile.role;


    // ==========================================
    // ALLOWED ADMIN ROLES
    // ==========================================

    const allowedRoles = [

      "owner",

      "chief_admin",

      "admin"

    ];


    // ACCESS DENIED

    if (
      !allowedRoles.includes(role)
    ) {

      console.log(
        "Admin access denied for role:",
        role
      );

      window.location.href =
        "index.html";

      return;
    }


    // ==========================================
    // ACCESS GRANTED
    // ==========================================

    const name =
      profile.display_name ||
      profile.username ||
      "Administrator";


    if (welcome) {

      welcome.textContent =
        `Welcome back, ${name}.`;
    }


    if (status) {

      status.textContent =
        `👑 Management access granted — ${role}.`;
    }


    console.log(
      "Admin access granted:",
      name,
      role
    );


    // LOAD DASHBOARD STATISTICS

    await loadDashboardStats();


  } catch (error) {

    console.error(
      "Admin authentication error:",
      error
    );

    window.location.href =
      "index.html";
  }

}


// ==========================================
// LOAD DASHBOARD STATS
// ==========================================

async function loadDashboardStats() {

  try {


    // ACTIVE STAFF

    const {
      count: staffCount,
      error: staffError
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
      count: complaintCount,
      error: complaintError
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
      count: pendingCount,
      error: pendingError
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
      count: serverCount,
      error: serverError
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


    // LOG ANY DATABASE ERRORS

    if (staffError) {
      console.error(
        "Staff count error:",
        staffError
      );
    }

    if (complaintError) {
      console.error(
        "Complaint count error:",
        complaintError
      );
    }

    if (pendingError) {
      console.error(
        "Pending count error:",
        pendingError
      );
    }

    if (serverError) {
      console.error(
        "Server links count error:",
        serverError
      );
    }


    // ==========================================
    // DISPLAY RESULTS
    // ==========================================

    const staffElement =
      document.getElementById(
        "staff-count"
      );

    const complaintElement =
      document.getElementById(
        "complaint-count"
      );

    const pendingElement =
      document.getElementById(
        "pending-count"
      );

    const serverElement =
      document.getElementById(
        "server-count"
      );


    if (staffElement) {

      staffElement.textContent =
        staffCount ?? 0;
    }


    if (complaintElement) {

      complaintElement.textContent =
        complaintCount ?? 0;
    }


    if (pendingElement) {

      pendingElement.textContent =
        pendingCount ?? 0;
    }


    if (serverElement) {

      serverElement.textContent =
        serverCount ?? 0;
    }


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
