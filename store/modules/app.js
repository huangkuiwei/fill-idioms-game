const appStore = {
  namespaced: true,

  state: {
    wordsList: [],
    wordsList1: [],
    wordsList2: []
  },

  mutations: {
    _setWordsList(state, payload) {
      state.wordsList = payload
    },

    _setWordsList1(state, payload) {
      state.wordsList1 = payload
    },

    _setWordsList2(state, payload) {
      state.wordsList2 = payload
    }
  },

  actions: {},
};

export default appStore;
