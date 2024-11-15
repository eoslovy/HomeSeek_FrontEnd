import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import NewsView from "@/components/navbar/NewsView.vue";
import PolicyView from "@/components/navbar/PolicyView.vue";
import LoanView from "@/components/navbar/LoanView.vue";
import AnalysisView from "@/components/navbar/AnalysisView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/news",
    name: "news",
    component: NewsView,
  },
  {
    path: "/policy",
    name: "policy",
    component: PolicyView,
  },
  {
    path: "/loan",
    name: "loan",
    component: LoanView,
  },
  {
    path: "/analysis",
    name: "analysis",
    component: AnalysisView,
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

export default router;
