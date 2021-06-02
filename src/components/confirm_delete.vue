<template>
  <div class="app-modal">
    <div class="modal" :class="isOpen ? 'is-active' : ''">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ title }}</p>
          <button
            class="delete"
            aria-label="close"
            @click="closeModal"
          ></button>
        </header>
        <section class="modal-card-body">
          <form id="form" action="">
            <b-field label="TITLE">
              <b-input v-model="form.title" required></b-input>
            </b-field>
            <b-field label="KATEGORI">
              <b-input v-model="form.kategori" required></b-input>
            </b-field>
            <b-field label="CONTENT">
              <vue-editor
                v-model="form.body"
                :editorToolbar="customToolbar"
              ></vue-editor>
            </b-field>

            <b-button
              type="is-success"
              :rounded="true"
              :expanded="true"
              :disabled="disabled"
              v-if="isUpdateMode"
              @click="updateBlog"
            >
              UPDATE
            </b-button>
            <b-button
              type="is-primary"
              :rounded="true"
              :expanded="true"
              :disabled="disabled"
              v-else
              @click="createBlog"
            >
              CREATE
            </b-button>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    closeModal() {
      this.$store.commit("closeModal");
    },
  },
};
</script>

<style></style>
