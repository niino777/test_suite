export default {
  namespaced: true,
  state: () => ({
    category: 'all',
    type: 'all',
    search: '',
    sort: 'default'
  }),
  mutations: {
    SET_CATEGORY (state, value) { state.category = value },
    SET_TYPE (state, value) { state.type = value },
    SET_SEARCH (state, value) { state.search = value || '' },
    SET_SORT (state, value) { state.sort = value },
    RESET (state) {
      state.category = 'all'
      state.type = 'all'
      state.search = ''
      state.sort = 'default'
    }
  }
}
