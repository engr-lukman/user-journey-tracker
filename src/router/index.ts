import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/pages/HomePage.vue";
import TermsPage from "@/pages/TermsPage.vue";
import UserFormPage from "@/pages/UserFormPage.vue";
import WalletPage from "@/pages/WalletPage.vue";
import OtpPage from "@/pages/OtpPage.vue";
import VerificationPage from "@/pages/VerificationPage.vue";
import { useJourneyTracker } from "@/composables/useJourneyTracker.js";
import { JOURNEY } from "@/constants/journey.js";

const journeyRoutes = [
  {
    path: JOURNEY.HOME.path,
    name: JOURNEY.HOME.name,
    component: HomePage,
    meta: {
      stepName: JOURNEY.HOME.steps.PAGE_VIEWED,
      title: JOURNEY.HOME.title,
    },
  },
  {
    path: JOURNEY.TERMS.path,
    name: JOURNEY.TERMS.name,
    component: TermsPage,
    meta: {
      stepName: JOURNEY.TERMS.steps.PAGE_VIEWED,
      title: JOURNEY.TERMS.title,
    },
  },
  {
    path: JOURNEY.USER_INFO.path,
    name: JOURNEY.USER_INFO.name,
    component: UserFormPage,
    meta: {
      stepName: JOURNEY.USER_INFO.steps.PAGE_VIEWED,
      title: JOURNEY.USER_INFO.title,
    },
  },
  {
    path: JOURNEY.WALLET.path,
    name: JOURNEY.WALLET.name,
    component: WalletPage,
    meta: {
      stepName: JOURNEY.WALLET.steps.PAGE_VIEWED,
      title: JOURNEY.WALLET.title,
    },
  },
  {
    path: JOURNEY.OTP.path,
    name: JOURNEY.OTP.name,
    component: OtpPage,
    meta: { stepName: JOURNEY.OTP.steps.PAGE_VIEWED, title: JOURNEY.OTP.title },
  },
  {
    path: JOURNEY.VERIFICATION.path,
    name: JOURNEY.VERIFICATION.name,
    component: VerificationPage,
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
