import microApp from "@micro-zoe/micro-app";
import * as config from "./config";

/**启用 micro */
microApp.start({
  preFetchApps: config.MICRO_APPS,
  globalAssets: config.GLOBAL_ASSETS,
});
