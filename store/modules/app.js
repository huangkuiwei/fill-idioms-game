const appStore = {
  namespaced: true,

  state: {
    // TODO h5测试数据
    deviceUuid: '123456789',
    wordsList: [],
    wordsList1: [],
    wordsList2: [],
    receiveRecode: []
  },

  mutations: {
    _setDeviceUuid(state, payload) {
      state.deviceUuid = payload
    },

    _setWordsList(state, payload) {
      state.wordsList = payload
    },

    _setWordsList1(state, payload) {
      state.wordsList1 = payload
    },

    _setWordsList2(state, payload) {
      state.wordsList2 = payload
    },

    _setReceiveRecode(state, payload) {
      state.receiveRecode = payload
    }
  },

  actions: {},
};

export default appStore;
