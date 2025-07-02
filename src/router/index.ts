import { createRouter, createWebHistory } from "vue-router";
import { useJourneyTracker } from "@/composables/useJourneyTracker";
import { JOURNEY } from "@/constants/journey";

const journeyRoutes = [
  {
    path: JOURNEY.WELCOME_PAGE.path,
    name: JOURNEY.WELCOME_PAGE.name,
    component: () => import("@/pages/HomePage.vue"),
    meta: {
      stepName: JOURNEY.WELCOME_PAGE.steps.PAGE_VIEWED,
      title: JOURNEY.WELCOME_PAGE.title,
    },
  },
  {
    path: JOURNEY.TERMS_CONDITIONS.path,
    name: JOURNEY.TERMS_CONDITIONS.name,
    component: () => import("@/pages/TermsPage.vue"),
    meta: {
      stepName: JOURNEY.TERMS_CONDITIONS.steps.PAGE_VIEWED,
      title: JOURNEY.TERMS_CONDITIONS.title,
    },
  },
  {
    path: JOURNEY.PERSONAL_INFORMATION.path,
    name: JOURNEY.PERSONAL_INFORMATION.name,
    component: () => import("@/pages/UserFormPage.vue"),
    meta: {
      stepName: JOURNEY.PERSONAL_INFORMATION.steps.PAGE_VIEWED,
      title: JOURNEY.PERSONAL_INFORMATION.title,
    },
  },
  {
    path: JOURNEY.WALLET_SETUP.path,
    name: JOURNEY.WALLET_SETUP.name,
    component: () => import("@/pages/WalletPage.vue"),
    meta: {
      stepName: JOURNEY.WALLET_SETUP.steps.PAGE_VIEWED,
      title: JOURNEY.WALLET_SETUP.title,
    },
  },
  {
    path: JOURNEY.OTP_VERIFICATION.path,
    name: JOURNEY.OTP_VERIFICATION.name,
    component: () => import("@/pages/OtpPage.vue"),
    meta: {
      stepName: JOURNEY.OTP_VERIFICATION.steps.PAGE_VIEWED,
      title: JOURNEY.OTP_VERIFICATION.title,
    },
  },
  {
    path: JOURNEY.JOURNEY_COMPLETE.path,
    name: JOURNEY.JOURNEY_COMPLETE.name,
    component: () => import("@/pages/VerificationPage.vue"),
    meta: {
      stepName: JOURNEY.JOURNEY_COMPLETE.steps.JOURNEY_COMPLETED,
      title: JOURNEY.JOURNEY_COMPLETE.title,
    },
  },
];

const journeyRouter = createRouter({
  history: createWebHistory(),
  routes: journeyRoutes,
});

journeyRouter.beforeEach((toRoute, fromRoute, next) => {
  const { recordJourneyStep } = useJourneyTracker();

  if (toRoute.meta?.stepName) {
    recordJourneyStep(toRoute.meta.stepName as string, {
      fromPath: fromRoute.path,
      toPath: toRoute.path,
      navigationMethod: "router",
    });
  }

  next();
});

export default journeyRouter;
