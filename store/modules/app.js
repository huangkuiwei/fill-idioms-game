const appStore = {
  namespaced: true,

  state: {
    wordsList: [],
  },

  mutations: {
    _setWordsList(state, payload) {
      state.wordsList = payload
    }
  },

  actions: {},
};

export default appStore;
