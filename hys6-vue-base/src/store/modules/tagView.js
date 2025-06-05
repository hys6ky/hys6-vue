const state = {
  tagViews: [],
};
const mutations = {
  ADD_VISITED_VIEW: (state, view) => {
    if (state.tagViews.some((v) => v.name === view.name)) return;
    state.tagViews.push(Object.assign({}, view));
  },
  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    state.tagViews = state.tagViews.filter((v) => {
      return v.path === view.path;
    });
  },
  DEL_ALL_VISITED_VIEWS: (state) => {
    state.tagViews = [];
  },
  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.tagViews.entries()) {
      if (v.path === view.path) {
        state.tagViews.splice(i, 1);
        break;
      }
    }
  },
};
const actions = {
  delView({ dispatch, state }, view) {
    return new Promise((resolve) => {
      dispatch("delVisitedView", view);
      resolve({
        tagViews: [...state.tagViews],
      });
    });
  },
  delVisitedView({ commit, state }, view) {
    return new Promise((resolve) => {
      commit("DEL_VISITED_VIEW", view);
      resolve([...state.tagViews]);
    });
  },
};
export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
