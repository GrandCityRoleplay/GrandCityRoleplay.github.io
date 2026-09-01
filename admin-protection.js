const SUPABASE_URL =
  "https://vjvgvjdmwtmpefuwxtun.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_Ev-ZZXUY3oY9rbkMHH65Dw_ashMFtNe";


const adminSupabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


// ==========================================
// PROTECT MANAGEMENT PAGES
// ==========================================

async function protectAdminPage() {

  try {

    const {
      data: { session },
      error: sessionError
    } =
      await adminSupabaseClient.auth.getSession();


    // Not logged in

    if (sessionError || !session) {

      window.location.href =
        "index.html";

      return;
    }


    const {
      data: profile,
      error: profileError
    } =
      await adminSupabaseClient
        .from("profiles")
        .select("role")
        .eq(
          "id",
          session.user.id
        )
        .maybeSingle();


    // Profile problem

    if (profileError || !profile) {

      console.error(
        "Admin protection profile error:",
        profileError
      );

      window.location.href =
        "index.html";

      return;
    }


    // Allowed roles

    const allowedRoles = [

      "owner",

      "chief_admin",

      "admin"

    ];


    // Unauthorized user

    if (
      !allowedRoles.includes(
        profile.role
      )
    ) {

      window.location.href =
        "index.html";

      return;
    }


    console.log(
      "Management page access granted:",
      profile.role
    );

  } catch (error) {

    console.error(
      "Admin protection error:",
      error
    );

    window.location.href =
      "index.html";
  }

}


// ==========================================
// START PROTECTION
// ==========================================

protectAdminPage();
