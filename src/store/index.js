import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginPage:false,
    isLogin:false,
    updateMode:false,
    modalActive:false
  },
  getters:{
    modalTitle(state){
      return state.updateMode ? "UPDATE POST" : "CREATE POST";
    },
    isModalActive(state){
      return state.modalActive;
    }
  },
  mutations: {
    closeModal(state){
      state.modalActive = false;
    },
    openModal(state, value = false){
      state.updateMode = value;
      state.modalActive = true;
    },
    setIsLogin(state,value){
      state.isLogin = value;
    },
    setLoginPage(state,value){
      state.loginPage = value;
    }
  },
  actions: {
  },
})
