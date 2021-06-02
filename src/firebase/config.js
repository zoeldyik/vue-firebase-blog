import Vue from 'vue'
import { firestorePlugin } from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

Vue.use(firestorePlugin)

const db = firebase
  .initializeApp({ 
    // YOUR FIREBASE CONFIG
})
  .firestore().collection("blog");

const FirebaseAuth = firebase.auth(); 

export { db, FirebaseAuth }