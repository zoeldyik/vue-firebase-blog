<template>
  <div class="login container pt-6">
    <div class="columns m-0">
      <div class="column is-4 is-offset-4">
        <div class="box">
          <p class="mb-3 is-size-5 has-text-weight-semi-bold">LOGIN</p>

          <!-- alert -->
          <b-notification
            type="is-warning"
            aria-close-label="Close notification"
            size="is-small"
            v-model="loginFailed"
          >
            <p class="is-size-7 has-text-weight-bold is-uppercase">
              invalid email or password !
            </p>
          </b-notification>
          <!-- end alert -->

          <form action="" @submit.prevent="login">
            <b-field label="email">
              <b-input placeholder="email" v-model="email" required></b-input>
            </b-field>
            <b-field label="password">
              <b-input
                type="password"
                placeholder="password"
                v-model="password"
                required
              ></b-input>
            </b-field>

            <b-button
              native-type="submit"
              type="is-primary"
              rounded
              :expanded="true"
              :disabled="disabled"
            >
              LOGIN
            </b-button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FirebaseAuth } from "../firebase/config";

export default {
  data() {
    return {
      email: "test@test.com",
      password: "123456",
      loginFailed: false,
      disabled: false,
    };
  },
  methods: {
    login() {
      this.disabled = true;
      FirebaseAuth.signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$store.commit("setIsLogin", true);
          this.$router.replace("/");
        })
        .catch(() => {
          this.loginFailed = true;
        })
        .finally(() => {
          this.disabled = false;
        });
    },
  },
};
</script>

<style></style>
