import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import {FirebaseAuth} from "../firebase/config"
import store from "../store"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to,from,next)=>{
  const user = FirebaseAuth.currentUser;

  if(to.path === "/login"){
    if(user){
      router.push("/")
    }else{
      store.commit('setLoginPage', true);
      next();
    }
  }else if(to.path === "/"){
    if(user){
      store.commit('setIsLogin',true);
    }
    
    store.commit('setLoginPage', false);
    next();
  }
})

export default router
