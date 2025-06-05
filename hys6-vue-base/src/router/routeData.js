import { MICRO_APPS } from "@/micro/config.js";

let microAppRoutes = [];
MICRO_APPS.forEach((item) => {
  microAppRoutes.push({
    path: `/${item.name}/*`,
    name: item.name,
    component: () => import("@/components/childView.vue"),
  });
});
export { microAppRoutes };
