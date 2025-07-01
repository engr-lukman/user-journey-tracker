// Unified journey constants - combining routes and tracking steps
export const JOURNEY = {
  HOME: {
    // Route information
    path: "/",
    name: "Home",
    title: "Welcome",

    // Journey tracking steps
    steps: {
      PAGE_VIEWED: "home_page_viewed",
      GET_STARTED_CLICKED: "get_started_button_clicked",
    },
  },

  TERMS: {
    // Route information
    path: "/terms",
    name: "Terms",
    title: "Terms & Conditions",

    // Journey tracking steps
    steps: {
      PAGE_VIEWED: "terms_page_viewed",
      BACK_CLICKED: "terms_back_button_clicked",
      ACCEPTED: "terms_accepted",
    },
  },

  USER_INFO: {
    // Route information
    path: "/user-info",
    name: "UserInfo",
    title: "Personal Information",

    // Journey tracking steps
    steps: {
      PAGE_VIEWED: "user_form_page_viewed",
      BACK_CLICKED: "user_form_back_button_clicked",
      SUBMITTED: "user_form_submitted",
    },
  },

  WALLET: {
    // Route information
    path: "/wallet",
    name: "Wallet",
    title: "Wallet Setup",

    // Journey tracking steps
    steps: {
      PAGE_VIEWED: "wallet_page_viewed",
      BACK_CLICKED: "wallet_back_button_clicked",
      INFO_SUBMITTED: "wallet_info_submitted",
    },
  },

  OTP: {
    // Route information
    path: "/otp",
    name: "Otp",
    title: "Verify OTP",

    // Journey tracking steps
    steps: {
      PAGE_VIEWED: "otp_page_viewed",
      VERIFICATION_ATTEMPTED: "otp_verification_attempted",
      RESEND_REQUESTED: "otp_resend_requested",
      BACK_CLICKED: "otp_back_button_clicked",
    },
  },

  VERIFICATION: {
    // Route information
    path: "/verification",
    name: "Verification",
    title: "Journey Complete",

    // Journey tracking steps
    steps: {
      COMPLETED: "verification_completed",
      DATA_DOWNLOAD_REQUESTED: "data_download_requested",
      RESTART_REQUESTED: "restart_requested",
    },
  },
};
