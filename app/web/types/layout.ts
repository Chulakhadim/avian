export default {
  "bot-only": () => import("../src/base/layout/bot-only"),
  default: () => import("../src/base/layout/default"),
  "top-only": () => import("../src/base/layout/top-only"),
};
