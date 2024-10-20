import Vue from 'vue';
import Vuex from 'vuex';
import appStore from '@/store/modules/app';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app: appStore,
  },
});

export default store;
