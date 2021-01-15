import { ActionTree, MutationTree } from 'vuex';
import { $axios } from '~/utils/api';
import url from '~/utils/url';

export const state = () => ({
  data: {},
  index: false
});

// eslint-disable-next-line no-undef
export type RootState = ReturnType<typeof state>;

export const mutations: MutationTree<RootState> = {
  data(state, data: any) {
    state.data = data;
  },
  isIndex(state) {
    state.index = true;
  }
};

export const actions: ActionTree<RootState, RootState> = {
  // 默认加载信息
  async nuxtServerInit({ commit }) {
    const res = await $axios.get(url.info);
    commit('data', res.data.body);
  }
};
