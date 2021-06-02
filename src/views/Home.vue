<template>
  <div class="home custom-container py-3">
    <app-modal
      @blog-created="blogCreated"
      @blog-updated="blogUpdated"
    ></app-modal>

    <!-- <confirm-delete></confirm-delete> -->

    <div class="columns m-0 is-multiline">
      <div class="column is-8">
        <!-- search bar -->
        <b-field label="SEARCH BY TITLE ..." label-position="on-border">
          <b-input
            v-model="search"
            placeholder="TYPE HERE"
            icon="magnify"
            icon-right="close-circle"
            icon-right-clickable
            @icon-right-click="search = ''"
          >
          </b-input>
        </b-field>
      </div>

      <div class="column is-8">
        <!-- alert  -->
        <b-notification
          :type="notification.type"
          aria-close-label="Close notification"
          size="is-small"
          v-model="notification.isActive"
        >
          <p class="is-size-6">
            {{ notification.text }}
          </p>
        </b-notification>
        <!-- end alert -->

        <!-- post -->
        <div class="post">
          <b-collapse
            class="card mb-1"
            animation="slide"
            v-for="(blog, index) of displayBlogs"
            :key="index"
            :open="isOpen == index"
            @open="isOpen = index"
          >
            <template #trigger="props">
              <div class="card-header" role="button">
                <p
                  class="card-header-title has-text-weight-medium is-uppercase"
                >
                  {{ blog.title }}
                </p>
                <a class="card-header-icon">
                  <b-icon :icon="props.open ? 'menu-down' : 'menu-up'">
                  </b-icon>
                </a>
              </div>
            </template>
            <div class="card-content">
              <div class="content">
                <div class="post-body" v-html="blog.body"></div>
                <p
                  class="post-kategori is-size-7 has-text-weight-semi-bold has-text-right mt-5"
                >
                  #{{ blog.kategori }}
                </p>

                <div class="buttons mt-2" v-if="isLogin">
                  <b-button
                    size="is-small"
                    rounded
                    icon-left="delete"
                    type="is-light"
                    @click="
                      openConfirmDelete({ id: blog.id, title: blog.title })
                    "
                  >
                    DELETE
                  </b-button>
                  <b-button
                    size="is-small"
                    rounded
                    icon-left="circle-edit-outline"
                    type="is-primary"
                    @click="openModal(blog)"
                  >
                    EDIT
                  </b-button>
                </div>
              </div>
            </div>
          </b-collapse>
        </div>
        <!-- end post -->

        <!-- pagination -->
        <b-pagination
          class="mt-2"
          :total="jumlahBlogs"
          v-model="pagination.currentPage"
          order="is-left"
          size="is-small"
          :range-after="2"
          :range-before="2"
          :per-page="pagination.perPage"
          aria-next-label="Next page"
          aria-previous-label="Previous page"
          aria-page-label="Page"
          aria-current-label="Current page"
        >
        </b-pagination>

        <!-- display when search not found -->
        <h1
          v-if="!filteredBlogs.length"
          class="is-size-3 is-size-3-tablet has-text-centered has-text-weight-bold has-text-grey mb-4"
        >
          POST NOT FOUND
        </h1>
      </div>

      <!-- kategori column -->
      <div class="column is-4">
        <div class="card p-3">
          <p class="mb-3 has-text-weight-semibold">KATEGORI</p>
          <div class="buttons">
            <b-button
              type="is-primary"
              class="is-small"
              v-for="(kat, index) in kategori"
              :icon-left="kategoriActive === kat ? 'star' : ''"
              :key="index"
              @click="filterBykategori(kat)"
            >
              {{ kat.toUpperCase() }}
            </b-button>
          </div>
        </div>
      </div>
      <!-- end categori column -->
    </div>
  </div>
</template>

<script>
import { db } from "../firebase/config";
import modal from "./modal";
import bus from "../bus";

export default {
  name: "Home",
  props: ["blogs"],
  components: {
    "app-modal": modal,
  },
  data() {
    return {
      allBlogs: null,
      search: "",
      isOpen: null,
      pagination: {
        currentPage: 1,
        perPage: 8,
      },
      kategoriActive: "ALL",
      notification: {
        type: "",
        isActive: false,
        text: "",
      },
    };
  },
  methods: {
    filterBykategori(kategori) {
      this.kategoriActive = kategori;
      this.search = "";

      if (kategori === "ALL") {
        this.allBlogs = this.blogs;
      } else {
        // jika kategori !== ALL maka filter allBlogs sesuai parameter kategori
        this.allBlogs = this.blogs.filter((blog) => blog.kategori === kategori);
      }
    },

    openModal(blog) {
      bus.$emit("update", blog);
      this.$store.commit("openModal", true);
    },

    openConfirmDelete(blog) {
      this.$buefy.dialog.confirm({
        "trap-focus": false,
        title: "DELETE BLOG",
        message: `<h1>delete blog berjudul <b>${blog.title}</b></h1>`,
        onConfirm: () => this.deleteBlog(blog.id),
      });
    },

    deleteBlog(id) {
      db.doc(id)
        .delete()
        .then(() => {
          this.notification.type = "is-warning";
          this.notification.isActive = true;
          this.notification.text = "1 blog deleted !";
        })
        .finally(() => {
          this.isOpen = null;
        });
    },

    blogCreated() {
      this.chooseKategori(this.kategoriActive);
      this.notification.type = "is-success";
      this.notification.isActive = true;
      this.notification.text = "1 blog added !";
    },

    blogUpdated() {
      this.notification.type = "is-primary";
      this.notification.isActive = true;
      this.notification.text = "1 blog updated !";
    },
  },

  computed: {
    filteredBlogs() {
      return this.allBlogs.filter((blog) => blog.title.includes(this.search));
    },

    displayBlogs() {
      // pagination setting
      let start = (this.pagination.currentPage - 1) * this.pagination.perPage;
      let limit = this.pagination.currentPage * this.pagination.perPage;
      return this.filteredBlogs.slice(start, limit);
    },

    jumlahBlogs() {
      return this.filteredBlogs.length;
    },

    kategori() {
      const allKategori = this.blogs.map((blog) => blog.kategori);
      // remove duplicate kategori
      const kategori = [];

      allKategori.forEach((el) => {
        if (!kategori.includes(el)) {
          kategori.push(el);
        }
      });

      kategori.unshift("ALL");

      return kategori;
    },
    isLogin() {
      return this.$store.state.isLogin;
    },
  },

  created() {
    this.allBlogs = this.blogs;
    bus.$on("reset-kategori", () => {
      this.filterBykategori("ALL");
      this.isOpen = null;
    });
  },
};
</script>

<style scoped>
.home >>> .pagination-next,
.home >>> .pagination-previous {
  display: none;
}

.home >>> .pagination-link {
  background-color: white;
}

.home >>> .is-current {
  background-color: #7957d5;
}
</style>
