import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/pages/HomePage.vue";
import TermsPage from "@/pages/TermsPage.vue";
import UserFormPage from "@/pages/UserFormPage.vue";
import WalletPage from "@/pages/WalletPage.vue";
import OtpPage from "@/pages/OtpPage.vue";
import VerificationPage from "@/pages/VerificationPage.vue";
import { useJourneyTracker } from "@/composables/useJourneyTracker.js";
import { ROUTES } from "@/constants/routes.js";
import { ROUTER_STEPS } from "@/constants/journeySteps.js";

const journeyRoutes = [
  {
    path: ROUTES.HOME.path,
    name: ROUTES.HOME.name,
    component: HomePage,
    meta: { stepName: ROUTER_STEPS.HOME_PAGE, title: ROUTES.HOME.title },
  },
  {
    path: ROUTES.TERMS.path,
    name: ROUTES.TERMS.name,
    component: TermsPage,
    meta: { stepName: ROUTER_STEPS.TERMS_PAGE, title: ROUTES.TERMS.title },
  },
  {
    path: ROUTES.USER_INFO.path,
    name: ROUTES.USER_INFO.name,
    component: UserFormPage,
    meta: {
      stepName: ROUTER_STEPS.USER_FORM_PAGE,
      title: ROUTES.USER_INFO.title,
    },
  },
  {
    path: ROUTES.WALLET.path,
    name: ROUTES.WALLET.name,
    component: WalletPage,
    meta: { stepName: ROUTER_STEPS.WALLET_PAGE, title: ROUTES.WALLET.title },
  },
  {
    path: ROUTES.OTP.path,
    name: ROUTES.OTP.name,
    component: OtpPage,
    meta: { stepName: ROUTER_STEPS.OTP_PAGE, title: ROUTES.OTP.title },
  },
  {
    path: ROUTES.VERIFICATION.path,
    name: ROUTES.VERIFICATION.name,
    component: VerificationPage,
    meta: {
      stepName: ROUTER_STEPS.VERIFICATION_PAGE,
      title: ROUTES.VERIFICATION.title,
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
