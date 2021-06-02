import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {FirebaseAuth} from "./firebase/config"
import {Input, Collapse, Icon, Modal, Button, Navbar, Pagination, Field, Notification, Dialog} from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Input)
Vue.use(Collapse)
Vue.use(Icon)
Vue.use(Modal)
Vue.use(Button)
Vue.use(Navbar)
Vue.use(Pagination)
Vue.use(Field)
Vue.use(Notification)
Vue.use(Dialog)

Vue.config.productionTip = false

let app;

FirebaseAuth.onAuthStateChanged(()=>{
  if(!app){
    app = new Vue({
          router,
          store,
          render: h => h(App)
        }).$mount('#app')
  }
})
