import { createRouter, createWebHistory } from "vue-router";
import { useJourneyTracker } from "@/composables/useJourneyTracker";
import { JOURNEY } from "@/constants/journey";

const journeyRoutes = [
  {
    path: JOURNEY.HOME.path,
    name: JOURNEY.HOME.name,
    component: () => import("@/pages/HomePage.vue"),
    meta: {
      stepName: JOURNEY.HOME.steps.PAGE_VIEWED,
      title: JOURNEY.HOME.title,
    },
  },
  {
    path: JOURNEY.TERMS.path,
    name: JOURNEY.TERMS.name,
    component: () => import("@/pages/TermsPage.vue"),
    meta: {
      stepName: JOURNEY.TERMS.steps.PAGE_VIEWED,
      title: JOURNEY.TERMS.title,
    },
  },
  {
    path: JOURNEY.USER_INFO.path,
    name: JOURNEY.USER_INFO.name,
    component: () => import("@/pages/UserFormPage.vue"),
    meta: {
      stepName: JOURNEY.USER_INFO.steps.PAGE_VIEWED,
      title: JOURNEY.USER_INFO.title,
    },
  },
  {
    path: JOURNEY.WALLET.path,
    name: JOURNEY.WALLET.name,
    component: () => import("@/pages/WalletPage.vue"),
    meta: {
      stepName: JOURNEY.WALLET.steps.PAGE_VIEWED,
      title: JOURNEY.WALLET.title,
    },
  },
  {
    path: JOURNEY.OTP.path,
    name: JOURNEY.OTP.name,
    component: () => import("@/pages/OtpPage.vue"),
    meta: { stepName: JOURNEY.OTP.steps.PAGE_VIEWED, title: JOURNEY.OTP.title },
  },
  {
    path: JOURNEY.VERIFICATION.path,
    name: JOURNEY.VERIFICATION.name,
    component: () => import("@/pages/VerificationPage.vue"),
    meta: {
      stepName: JOURNEY.VERIFICATION.steps.COMPLETED,
      title: JOURNEY.VERIFICATION.title,
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
    recordJourneyStep(toRoute.meta.stepName, {
      fromPath: fromRoute.path,
      toPath: toRoute.path,
      navigationMethod: "router",
    });
  }

  next();
});

export default journeyRouter;
