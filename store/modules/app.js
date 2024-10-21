const appStore = {
  namespaced: true,

  state: {
    wordsList: [],
    wordsList1: []
  },

  mutations: {
    _setWordsList(state, payload) {
      state.wordsList = payload
    },

    _setWordsList1(state, payload) {
      state.wordsList1 = payload
    }
  },

  actions: {},
};

export default appStore;
