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
      order: EVENTS?.WELCOME_PAGE?.ORDER,
      eventName: EVENTS?.WELCOME_PAGE?.NAME,
      eventTitle: EVENTS?.WELCOME_PAGE?.TITLE,
    },
  },
  {
    path: ROUTES.WALLET_NUMBER.path,
    name: ROUTES.WALLET_NUMBER.name,
    component: () => import("@/pages/WalletNumberPage.vue"),
    meta: {
      order: EVENTS?.ONBOARDING_START?.ORDER,
      eventName: EVENTS?.ONBOARDING_START?.NAME,
      eventTitle: EVENTS?.ONBOARDING_START?.TITLE,
    },
  },
  {
    path: ROUTES.WALLET_OTP.path,
    name: ROUTES.WALLET_OTP.name,
    component: () => import("@/pages/WalletOtpPage.vue"),
    meta: {
      order: EVENTS?.WALLET_OTP_PAGE?.ORDER,
      eventName: EVENTS?.WALLET_OTP_PAGE?.NAME,
      eventTitle: EVENTS?.WALLET_OTP_PAGE?.TITLE,
    },
  },
  {
    path: ROUTES.ACCOUNT_INFO.path,
    name: ROUTES.ACCOUNT_INFO.name,
    component: () => import("@/pages/AccountInfoPage.vue"),
    meta: {
      order: EVENTS?.ACCOUNT_INFO_PAGE?.ORDER,
      eventName: EVENTS?.ACCOUNT_INFO_PAGE?.NAME,
      eventTitle: EVENTS?.ACCOUNT_INFO_PAGE?.TITLE,
    },
  },
  {
    path: ROUTES.EMAIL_OTP.path,
    name: ROUTES.EMAIL_OTP.name,
    component: () => import("@/pages/EmailOtpPage.vue"),
    meta: {
      order: EVENTS?.EMAIL_OTP_PAGE?.ORDER,
      eventName: EVENTS?.EMAIL_OTP_PAGE?.NAME,
      eventTitle: EVENTS?.EMAIL_OTP_PAGE?.TITLE,
    },
  },
  {
    path: ROUTES.PASSWORD.path,
    name: ROUTES.PASSWORD.name,
    component: () => import("@/pages/PasswordPage.vue"),
    meta: {
      order: EVENTS?.PASSWORD_SETUP_PAGE?.ORDER,
      eventName: EVENTS?.PASSWORD_SETUP_PAGE?.NAME,
      eventTitle: EVENTS?.PASSWORD_SETUP_PAGE?.TITLE,
    },
  },
  {
    path: ROUTES.ONBOARDING_COMPLETE.path,
    name: ROUTES.ONBOARDING_COMPLETE.name,
    component: () => import("@/pages/OnboardingCompletePage.vue"),
    meta: {
      order: EVENTS?.ONBOARDING_COMPLETE?.ORDER,
      eventName: EVENTS?.ONBOARDING_COMPLETE?.NAME,
      eventTitle: EVENTS?.ONBOARDING_COMPLETE?.TITLE,
    },
  },
  {
    path: ROUTES.REPORTS.path,
    name: ROUTES.REPORTS.name,
    component: () => import("@/pages/ReportsPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach((toRoute, fromRoute, next) => {
  const { saveEventRecord } = useTracker();

  if (toRoute?.meta?.eventName) {
    saveEventRecord(toRoute.meta.eventName as string, {
      ...toRoute?.meta,
      fromPath: fromRoute.path,
      toPath: toRoute.path,
    });
  }

  next();
});

export default router;
