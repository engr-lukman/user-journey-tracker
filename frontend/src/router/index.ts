import { createRouter, createWebHistory } from "vue-router";

import { useTracker } from "@/composables/useTracker";
import { EVENTS } from "@/constants/events";
import { ROUTES } from "@/constants/routes";

const routes = [
  {
    path: ROUTES.WELCOME_PAGE.path,
    name: ROUTES.WELCOME_PAGE.name,
    component: () => import("@/pages/WelcomePage.vue"),
    meta: {
      sl: EVENTS?.WELCOME_PAGE?.SL,
      eventName: EVENTS?.WELCOME_PAGE?.NAME,
      title: EVENTS?.WELCOME_PAGE?.TITLE,
    },
  },
  {
    path: ROUTES.WALLET_NUMBER.path,
    name: ROUTES.WALLET_NUMBER.name,
    component: () => import("@/pages/WalletNumberPage.vue"),
    meta: {
      sl: EVENTS?.ONBOARDING_START?.SL,
      eventName: EVENTS?.ONBOARDING_START?.NAME,
      title: EVENTS?.ONBOARDING_START?.TITLE,
    },
  },
  {
    path: ROUTES.WALLET_OTP.path,
    name: ROUTES.WALLET_OTP.name,
    component: () => import("@/pages/WalletOtpPage.vue"),
    meta: {
      sl: EVENTS?.WALLET_OTP_PAGE?.SL,
      eventName: EVENTS?.WALLET_OTP_PAGE?.NAME,
      title: EVENTS?.WALLET_OTP_PAGE?.TITLE,
    },
  },
  {
    path: ROUTES.ACCOUNT_INFO.path,
    name: ROUTES.ACCOUNT_INFO.name,
    component: () => import("@/pages/AccountInfoPage.vue"),
    meta: {
      sl: EVENTS?.ACCOUNT_INFO_PAGE?.SL,
      eventName: EVENTS?.ACCOUNT_INFO_PAGE?.NAME,
      title: EVENTS?.ACCOUNT_INFO_PAGE?.TITLE,
    },
  },
  {
    path: ROUTES.EMAIL_OTP.path,
    name: ROUTES.EMAIL_OTP.name,
    component: () => import("@/pages/EmailOtpPage.vue"),
    meta: {
      sl: EVENTS?.EMAIL_OTP_PAGE?.SL,
      eventName: EVENTS?.EMAIL_OTP_PAGE?.NAME,
      title: EVENTS?.EMAIL_OTP_PAGE?.TITLE,
    },
  },
  {
    path: ROUTES.PASSWORD.path,
    name: ROUTES.PASSWORD.name,
    component: () => import("@/pages/PasswordPage.vue"),
    meta: {
      sl: EVENTS?.PASSWORD_SETUP_PAGE?.SL,
      eventName: EVENTS?.PASSWORD_SETUP_PAGE?.NAME,
      title: EVENTS?.PASSWORD_SETUP_PAGE?.TITLE,
    },
  },
  {
    path: ROUTES.ONBOARDING_COMPLETE.path,
    name: ROUTES.ONBOARDING_COMPLETE.name,
    component: () => import("@/pages/OnboardingCompletePage.vue"),
    meta: {
      sl: EVENTS?.ONBOARDING_COMPLETE?.SL,
      eventName: EVENTS?.ONBOARDING_COMPLETE?.NAME,
      title: EVENTS?.ONBOARDING_COMPLETE?.TITLE,
    },
  },
  {
    path: ROUTES.REPORTS.path,
    name: ROUTES.REPORTS.name,
    component: () => import("@/pages/ReportsPage.vue"),
    meta: {
      sl: EVENTS?.REPORTS_PAGE?.SL,
      eventName: EVENTS?.REPORTS_PAGE?.NAME,
      title: EVENTS?.REPORTS_PAGE?.TITLE,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach((toRoute, fromRoute, next) => {
  const { saveEventRecord } = useTracker();

  if (toRoute.meta?.eventName) {
    saveEventRecord(toRoute.meta.eventName as string, {
      ...toRoute?.meta,
      fromPath: fromRoute.path,
      toPath: toRoute.path,
    });
  }

  next();
});

export default router;
