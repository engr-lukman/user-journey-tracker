// Journey tracking step names constants
export const JOURNEY_STEPS = {
  // Home page steps
  HOME_PAGE_VIEWED: "home_page_viewed",
  GET_STARTED_BUTTON_CLICKED: "get_started_button_clicked",

  // Terms page steps
  TERMS_PAGE_VIEWED: "terms_page_viewed",
  TERMS_BACK_BUTTON_CLICKED: "terms_back_button_clicked",
  TERMS_ACCEPTED: "terms_accepted",

  // User form page steps
  USER_FORM_PAGE_VIEWED: "user_form_page_viewed",
  USER_FORM_BACK_BUTTON_CLICKED: "user_form_back_button_clicked",
  USER_FORM_SUBMITTED: "user_form_submitted",

  // Wallet page steps
  WALLET_PAGE_VIEWED: "wallet_page_viewed",
  WALLET_BACK_BUTTON_CLICKED: "wallet_back_button_clicked",
  WALLET_INFO_SUBMITTED: "wallet_info_submitted",

  // OTP page steps
  OTP_PAGE_VIEWED: "otp_page_viewed",
  OTP_VERIFICATION_ATTEMPTED: "otp_verification_attempted",
  OTP_RESEND_REQUESTED: "otp_resend_requested",
  OTP_BACK_BUTTON_CLICKED: "otp_back_button_clicked",

  // Verification page steps
  VERIFICATION_COMPLETED: "verification_completed",
  DATA_DOWNLOAD_REQUESTED: "data_download_requested",
  RESTART_REQUESTED: "restart_requested",
};

// Router step names for page navigation tracking
export const ROUTER_STEPS = {
  HOME_PAGE: "home_page",
  TERMS_PAGE: "terms_page",
  USER_FORM_PAGE: "user_form_page",
  WALLET_PAGE: "wallet_page",
  OTP_PAGE: "otp_page",
  VERIFICATION_PAGE: "verification_page",
};
