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
      eventOrder: EVENTS?.WELCOME_PAGE?.eventOrder,
      eventName: EVENTS?.WELCOME_PAGE?.eventName,
      eventTitle: EVENTS?.WELCOME_PAGE?.eventTitle,
    },
  },
  {
    path: ROUTES.WALLET_NUMBER.path,
    name: ROUTES.WALLET_NUMBER.name,
    component: () => import("@/pages/WalletNumberPage.vue"),
    meta: {
      eventOrder: EVENTS?.ONBOARDING_START?.eventOrder,
      eventName: EVENTS?.ONBOARDING_START?.eventName,
      eventTitle: EVENTS?.ONBOARDING_START?.eventTitle,
    },
  },
  {
    path: ROUTES.WALLET_OTP.path,
    name: ROUTES.WALLET_OTP.name,
    component: () => import("@/pages/WalletOtpPage.vue"),
    meta: {
      eventOrder: EVENTS?.WALLET_OTP_PAGE?.eventOrder,
      eventName: EVENTS?.WALLET_OTP_PAGE?.eventName,
      eventTitle: EVENTS?.WALLET_OTP_PAGE?.eventTitle,
    },
  },
  {
    path: ROUTES.ACCOUNT_INFO.path,
    name: ROUTES.ACCOUNT_INFO.name,
    component: () => import("@/pages/AccountInfoPage.vue"),
    meta: {
      eventOrder: EVENTS?.ACCOUNT_INFO_PAGE?.eventOrder,
      eventName: EVENTS?.ACCOUNT_INFO_PAGE?.eventName,
      eventTitle: EVENTS?.ACCOUNT_INFO_PAGE?.eventTitle,
    },
  },
  {
    path: ROUTES.EMAIL_OTP.path,
    name: ROUTES.EMAIL_OTP.name,
    component: () => import("@/pages/EmailOtpPage.vue"),
    meta: {
      eventOrder: EVENTS?.EMAIL_OTP_PAGE?.eventOrder,
      eventName: EVENTS?.EMAIL_OTP_PAGE?.eventName,
      eventTitle: EVENTS?.EMAIL_OTP_PAGE?.eventTitle,
    },
  },
  {
    path: ROUTES.PASSWORD.path,
    name: ROUTES.PASSWORD.name,
    component: () => import("@/pages/PasswordPage.vue"),
    meta: {
      eventOrder: EVENTS?.PASSWORD_SETUP_PAGE?.eventOrder,
      eventName: EVENTS?.PASSWORD_SETUP_PAGE?.eventName,
      eventTitle: EVENTS?.PASSWORD_SETUP_PAGE?.eventTitle,
    },
  },
  {
    path: ROUTES.ONBOARDING_COMPLETE.path,
    name: ROUTES.ONBOARDING_COMPLETE.name,
    component: () => import("@/pages/OnboardingCompletePage.vue"),
    meta: {
      eventOrder: EVENTS?.ONBOARDING_COMPLETE?.eventOrder,
      eventName: EVENTS?.ONBOARDING_COMPLETE?.eventName,
      eventTitle: EVENTS?.ONBOARDING_COMPLETE?.eventTitle,
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
