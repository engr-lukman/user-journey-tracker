export const JOURNEY = {
  WELCOME_PAGE: {
    path: "/",
    name: "Home",
    title: "Welcome",
    displayName: "Welcome Page",
    steps: {
      PAGE_VIEWED: "welcome_page_viewed",
      GET_STARTED_CLICKED: "welcome_get_started_clicked",
    },
  },

  TERMS_CONDITIONS: {
    path: "/terms",
    name: "Terms",
    title: "Terms & Conditions",
    displayName: "Terms & Conditions",
    steps: {
      PAGE_VIEWED: "terms_conditions_page_viewed",
      BACK_CLICKED: "terms_conditions_back_clicked",
      ACCEPTED: "terms_conditions_accepted",
    },
  },

  PERSONAL_INFORMATION: {
    path: "/user-info",
    name: "UserInfo",
    title: "Personal Information",
    displayName: "Personal Information Form",
    steps: {
      PAGE_VIEWED: "personal_information_page_viewed",
      BACK_CLICKED: "personal_information_back_clicked",
      FORM_SUBMITTED: "personal_information_form_submitted",
    },
  },

  WALLET_SETUP: {
    path: "/wallet",
    name: "Wallet",
    title: "Wallet Setup",
    displayName: "Mobile Wallet Setup",
    steps: {
      PAGE_VIEWED: "wallet_setup_page_viewed",
      BACK_CLICKED: "wallet_setup_back_clicked",
      MOBILE_NUMBER_SUBMITTED: "wallet_setup_mobile_number_submitted",
    },
  },

  OTP_VERIFICATION: {
    path: "/otp",
    name: "Otp",
    title: "Verify OTP",
    displayName: "OTP Verification",
    steps: {
      PAGE_VIEWED: "otp_verification_page_viewed",
      CODE_ENTERED: "otp_verification_code_entered",
      RESEND_REQUESTED: "otp_verification_resend_requested",
      BACK_CLICKED: "otp_verification_back_clicked",
    },
  },

  JOURNEY_COMPLETE: {
    path: "/verification",
    name: "Verification",
    title: "Journey Complete",
    displayName: "Journey Completion",
    steps: {
      JOURNEY_COMPLETED: "journey_completion_success",
      DATA_EXPORT_REQUESTED: "journey_data_export_requested",
      RESTART_JOURNEY: "journey_restart_requested",
    },
  },
};
