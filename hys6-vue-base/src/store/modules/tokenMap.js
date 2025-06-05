export default {
  state: {
    headerKey: "headerKey", // hreader key的cookies存储名称
    headervalue: "headervalue", // hreader 值的cookies存储名称
    menuList: [], // 菜单列表
    defaultMenu: [], //默认菜单
  },
  /**
   * 定义取值的方法区
   * 使用方式: this.$store.getters.方法名
   */
  getters: {
    // 获取toKen
    getToken(state) {
      return sessionStorage.getItem(state.headervalue);
    },
    // hreader key的cookies存储名称
    getHeaderKey(state) {
      return sessionStorage.getItem(state.headerKey);
    },
    // hreader 值的cookies存储名称
    getHeadervalue(state) {
      return state.headervalue;
    },
    // 获取菜单列表
    getMenuList(state) {
      return sessionStorage.getItem(JSON.parse("menuList"));
    },
    // 获取默认菜单
    getDefaultMenu(state) {
      return sessionStorage.getItem("defaultMenu");
    },
  },
  /**
   * 当指定actions.dispatch(方法时),该区域会被执行
   */
  mutations: {
    /**
     * 设置Token信息
     * @param {Object} state 数据
     * @param {JSON} response 需要的数据信息
     */
    SET_TOKEN(state, response) {
      sessionStorage.setItem(state.headerKey, response.data.tokenHeaderKeyName);
      sessionStorage.setItem(state.headervalue, response.data.accessToken);
    },
    // 登出
    LOG_OUT(state) {
      sessionStorage.removeItem(state.headerKey);
      sessionStorage.removeItem(state.headervalue);
    },
    //设置菜单列表
    SET_MENU_LIST(state, menuList) {
      state.menuList = menuList;
      sessionStorage.setItem("menuList", JSON.stringify(menuList));
    },
    //设置默认菜单
    SET_DEFAULT_MENU(state, defaultMenu) {
      state.defaultMenu = defaultMenu.defaultMenu;
      sessionStorage.setItem("defaultMenu", defaultMenu.defaultMenu);
    },
  },
  actions: {
    /**
     * 加载Token数据
     * @param {Store} commit Store对象中的方法, 等价于 context.commit
     * @param {JSON} response 响应的数据
     * 使用方式: this.$store.dispatch(actions下的方法名称, 响应数据);
     */
    loadToken({ commit }, response) {
      commit("SET_TOKEN", response);
    },
    /**
     * 用户退出, 清除Token信息
     * @param {Store} commit Store对象中的方法,等价于 context.commit
     * 使用方式: this.$store.dispatch(actions下的方法名称);
     */
    logOut({ commit }) {
      commit("LOG_OUT");
    },
  },
};
