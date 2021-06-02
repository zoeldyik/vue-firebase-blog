<template>
  <div class="app-navbar">
    <div class="custom-container">
      <b-navbar>
        <template #brand>
          <b-navbar-item @click="goHome">
            <p class="is-size-4 has-text-primary is-family-code">
              <b-icon icon="bookshelf" type="is-primary"></b-icon>MY<span
                class="has-text-weight-bold"
                >NOTE</span
              >
            </p>
          </b-navbar-item>
        </template>

        <template #end v-if="!isLoginPage">
          <b-navbar-item tag="div">
            <div class="buttons">
              <b-button
                class="is-small is-dark"
                rounded
                icon-right="github"
                tag="a"
                href="https://github.com/zoeldyik/vue-firebase-blog"
              >
                CODE
              </b-button>
              <b-button
                class="is-small is-primary"
                rounded
                icon-right="login"
                tag="router-link"
                to="/login"
                v-if="!isLogin"
              >
                LOGIN
              </b-button>
              <b-button
                class="is-small is-primary"
                rounded
                icon-right="pencil-plus"
                @click="openModal"
                v-if="isLogin"
              >
                CREATE
              </b-button>
              <b-button
                class="is-small is-light"
                rounded
                icon-right="logout"
                @click="logout"
                v-if="isLogin"
              >
                LOGOUT
              </b-button>
            </div>
          </b-navbar-item>
        </template>
      </b-navbar>
    </div>
  </div>
</template>

<script>
import { FirebaseAuth } from "../firebase/config";
import bus from "../bus";

export default {
  name: "navbar",
  methods: {
    openModal() {
      this.$store.commit("openModal");
    },
    logout() {
      FirebaseAuth.signOut().then(() => {
        this.$store.commit("setIsLogin", false);
        console.log("success logout");
      });
    },
    goHome() {
      if (this.$router.currentRoute.name === "Home") {
        bus.$emit("reset-kategori");
      } else {
        this.$router.push({ name: "Home" });
      }
    },
  },
  computed: {
    isLoginPage() {
      return this.$store.state.loginPage;
    },
    isLogin() {
      return this.$store.state.isLogin;
    },
  },
};
</script>

<style scoped>
.app-navbar {
  background-color: white;
}
</style>
