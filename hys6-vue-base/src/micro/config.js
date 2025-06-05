/**
 * 子应用前缀
 */
// export const CHILD_PREFIX = "app";

/**
 * 子应用地址
 */
export const MICRO_APPS = MICRO_LIST.map((item) => {
  return {
    name: item.name,
    url:
      process.env.NODE_ENV === "production"
        ? `http://${window.location.host}/${item.name}/`
        : `http://localhost:${item.port}`,
  };
});

/**
 * 全局资源
 */
export const GLOBAL_ASSETS = {
  js: [],
  css: [],
};
