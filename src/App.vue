<template>
  <div id="app">
    <div v-if="blogs.length">
      <nav-bar></nav-bar>
      <router-view :blogs="blogs" />
    </div>

    <app-loading v-if="!blogs.length"></app-loading>
  </div>
</template>

<script>
import { db } from "./firebase/config";
import navbar from "./components/navbar";
import loading from "./components/loading";

export default {
  components: {
    "nav-bar": navbar,
    "app-loading": loading,
  },
  data() {
    return {
      blogs: [],
    };
  },
  firestore: {
    blogs: db.orderBy("time", "desc"),
  },
};
</script>

<style>
#app {
  background: #f7f7f7;
  color: #2c3e50;
  min-height: 100vh;
}

@media (min-width: 769px) {
  .custom-container {
    margin: 0 10px;
  }
}

@media (min-width: 1024px) {
  .custom-container {
    margin: 0 40px;
  }
}
</style>
