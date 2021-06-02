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
import { db } from "../firebase/config";
import { VueEditor } from "vue2-editor";
import bus from "../bus";

export default {
  components: {
    "vue-editor": VueEditor,
  },
  data() {
    return {
      form: {
        id: "",
        title: "",
        kategori: "",
        body: "",
      },
      customToolbar: [
        [{ header: [3, false] }],
        ["bold", "italic", "underline"],
        ["link", "code-block"],
      ],
      disabled: false,
    };
  },
  methods: {
    closeModal() {
      this.$store.commit("closeModal");
      // clear form
      for (const key in this.form) {
        this.form[key] = "";
      }
    },
    createBlog() {
      const checkInput = this.checkInput();
      // disable button
      this.disabled = true;

      // check if form not empty
      if (checkInput) {
        db.add({
          title: this.form.title,
          kategori: this.form.kategori,
          body: this.form.body,
          time: Date.now(),
        })
          .then(() => {
            // close modal
            this.closeModal();
            this.$emit("blog-created");
          })
          .finally(() => {
            this.disabled = false;
          });
      } else {
        // form is empty
        // alert("field tidak boleh kosong");
        this.disabled = false;
      }
    },
    updateBlog() {
      const checkInput = this.checkInput();

      // disable button
      this.disabled = true;

      if (checkInput) {
        const payload = { ...this.form };
        delete payload.id;

        // update blog
        db.doc(this.form.id)
          .update(payload)
          .then(() => {
            // close modal
            this.closeModal();
            this.$emit("blog-updated");
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            // enable button
            this.disabled = false;
          });
      } else {
        this.disabled = false;
      }
    },
    checkInput() {
      const title = this.form.title.trim();
      const kategori = this.form.kategori.trim();
      const body = this.form.body;

      return title.length && kategori.length && body.length ? true : false;
    },
  },
  computed: {
    isOpen() {
      return this.$store.getters.isModalActive;
    },
    title() {
      return this.$store.getters.modalTitle;
    },
    isUpdateMode() {
      return this.$store.state.updateMode;
    },
    isModalActive() {
      return this.$tore.state.openModal;
    },
  },
  created() {
    bus.$on("update", (blog) => {
      console.log("listen from event bus 'update'");
      const { id, title, kategori, body } = blog;

      // set form value
      this.form.id = id;
      this.form.title = title;
      this.form.kategori = kategori;
      this.form.body = body;
    });
  },
};
</script>

<style></style>
