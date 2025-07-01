import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/pages/HomePage.vue";
import TermsPage from "@/pages/TermsPage.vue";
import UserFormPage from "@/pages/UserFormPage.vue";
import WalletPage from "@/pages/WalletPage.vue";
import OtpPage from "@/pages/OtpPage.vue";
import VerificationPage from "@/pages/VerificationPage.vue";
import DebugPage from "@/pages/DebugPage.vue";
import { useJourneyTracker } from "@/composables/useJourneyTracker.js";

const journeyRoutes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
    meta: { stepName: "home_page" },
  },
  {
    path: "/terms",
    name: "Terms",
    component: TermsPage,
    meta: { stepName: "terms_page" },
  },
  {
    path: "/user-info",
    name: "UserInfo",
    component: UserFormPage,
    meta: { stepName: "user_form_page" },
  },
  {
    path: "/wallet",
    name: "Wallet",
    component: WalletPage,
    meta: { stepName: "wallet_page" },
  },
  {
    path: "/otp",
    name: "Otp",
    component: OtpPage,
    meta: { stepName: "otp_page" },
  },
  {
    path: "/verification",
    name: "Verification",
    component: VerificationPage,
    meta: { stepName: "verification_page" },
  },
  {
    path: "/debug",
    name: "Debug",
    component: DebugPage,
    meta: { stepName: "debug_page" },
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
