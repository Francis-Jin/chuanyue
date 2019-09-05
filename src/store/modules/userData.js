// initial state
/* 用户数据存储 */

const state = {
  // 用户数据
  ciphone: localStorage.getItem('identity'),
  unionId: localStorage.getItem('unionId'),
  OID: localStorage.getItem('OID'),

  appId: 'wx1f0fd1dda613fc39' // 测试版本
}

// getters
const getters = {

}

// actions
const actions = {

}

// mutations
const mutations = {
  // 保存用户数据
  saveUserData (state, n) {
    state.identity = n.identity
    state.unionId = n.unionLongId
    state.OID = n.OID

    localStorage.setItem('identity', n.identity)
    localStorage.setItem('unionId', n.unionLongId)
    localStorage.setItem('OID', n.OID)

    localStorage.setItem('userToken', n.passWord)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
