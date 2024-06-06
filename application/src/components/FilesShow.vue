<template>
  <div class="container-overall">
    <div v-if="files_list && files_list.length === 0">
      <label>No Result Found</label>
    </div>
    <div
      class="container-img"
      v-for="(items, index) in files_list"
      :key="index"
      @mouseover="showOption = index"
      @mouseleave="showOption = null"
    >
      <img
        class="img-show"
        :src="items.file_url"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        @click="seletedView = items"
      />
      <div class="option">
        <!-- Your ellipsis or overflow menu content here -->
        <!-- For demonstration, displaying three dots -->
        <!-- <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span> -->
        <div>
          <img
            class="show-bin"
            v-if="items.status === 1"
            src="../assets/delete.png"
            @click="MoveBin(items._id)"
          />
        </div>
        <div>
          <img
            class="show-bin"
            v-if="items.status === 2"
            src="../assets/delete.png"
            @click="RemoveBin(items)"
          />
        </div>
        <div>
          <img
            class="show-bin"
            v-if="items.favourite && items.status === 1"
            src="../assets/unfavourite.png"
            @click="favouriteAddRemove(items._id)"
          />
        </div>
        <div>
          <img
            class="show-bin"
            v-if="!items.favourite && items.status === 1"
            src="../assets/favourite.png"
            @click="favouriteAddRemove(items._id)"
          />
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">View Image</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" v-if="seletedView">
            <img class="image-view-modal" :src="seletedView.file_url" />
            <p v-if="seletedView.description">
              {{ seletedView.description }}
            </p>
          </div>
          <div class="modal-body" v-if="!seletedView">
            <label>Details not found</label>
          </div>
          <!-- <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div> -->
        </div>
      </div>
    </div>
  </div>
  <div class="pagination-container">
    <nav aria-label="..." v-if="files_list && files_list.length > 0 && totalItems > limit ">
      <ul class="pagination">
        <li
          class="page-item"
          :class="currentPage === 1 ? 'disabled' : ''"
          @click="prevPage"
        >
          <a class="page-link">Previous</a>
        </li>
        <li
          class="page-item"
          v-for="(pageItems, index) in page_list"
          :key="index"
          :class="pageItems + 1 === currentPage ? 'active' : ''"
        >
          <a class="page-link" href="#" @click="pageSelect(pageItems + 1)">{{
            pageItems + 1
          }}</a>
        </li>
        <!-- <li class="page-item">
          <a class="page-link" href="#" v-if="currentPage != 1">{{
            currentPage - 1
          }}</a>
        </li>
        <li class="page-item active" aria-current="page">
          <a class="page-link" href="#">{{ currentPage }}</a>
        </li>
        <li class="page-item"><a class="page-link" href="#">3</a></li> -->
        <li
          class="page-item"
          :class="currentPage === total_page ? 'disabled' : ''"
          @click="nextPage"
        >
          <a class="page-link" href="#">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>
<style scoped>
.container-overall {
  display: flex;
  gap: 15px;
  width: 100%;
  flex-wrap: wrap;
}
.container-img {
  position: relative; /* Position the container relatively */
  margin: 5px 7px; /* Add margin between the images */
  /* cursor: pointer; */
}
.container-img .img-show {
  width: 150px;
  height: 150px;
  object-fit: contain;
}
.option {
  position: absolute;
  top: 10px;
  right: 10px;
  /* background-color: white;
  border: 1px solid #ccc;
  border-radius: 15px; */
  padding: 5px;
  /* cursor: pointer; */
  display: none;
}

.option .show-bin {
  width: 15px;
  height: 15px;
  cursor: pointer;
}
.option .dot {
  display: block;
  width: 4px;
  height: 4px;
  background-color: black;
  border-radius: 50%;
  margin-bottom: 3px;
}

.container-img:hover .option {
  display: block;
}

.image-view-modal {
  width: 470px;
  min-height: 240px;
  object-fit: contain;
  height: auto;
}
.pagination-container {
  position: absolute;
  bottom: 0;
}
</style>

<script>
import { apiservice , GeneralSettings } from "../service/apiService.js";
import { onMounted } from "vue";
import { apiConfig } from "@/service/apiConfig.js";
import { useRoute } from "vue-router";
import { store } from "@/service/store.js";
export default {
  mounted() {
    let route_det = useRoute().params;
    if (route_det && route_det.name) {
      this.page = route_det.name;
    }
    this.filesListGet();
  },
  created() {
    document
      .getElementById("searchDescription")
      .addEventListener("keyup", (event) => {
        if (event && event.target && event.target.value) {
          this.search = event.target.value;
        } else {
          this.search = "";
        }
        this.filesListGet();
      });
  },
  data() {
    return {
      skip: 0,
      limit: 10,
      search: "",
      files_list: [],
      page: "allphotos",
      showOption: null,
      currentPage: 1,
      totalItems: 0,
      seletedView: null,
      total_page: 0,
      page_list: [],
    };
  },
  methods: {
    pageSelect(page) {
      this.currentPage = page;
      this.skip = this.limit * (this.currentPage - 1);
      this.filesListGet();
    },
    nextPage() {
      if (this.currentPage != this.total_page) {
        this.currentPage += 1;
      }
      this.skip = this.limit * (this.currentPage - 1);
      this.filesListGet();
    },
    prevPage() {
      if (this.currentPage != 1) {
        this.currentPage -= 1;
      }
      this.skip = this.limit * (this.currentPage - 1);
      this.filesListGet();
    },
    async filesListGet() {
      this.page_list = [];
      let data = {
        skip: this.skip,
        limit: this.limit,
        search: this.search,
      };
      switch (this.page) {
        case "allphotos":
          data.status = 1;
          break;

        case "favourite":
          data.status = 1;
          data.favourite = 1;
          break;
        case "bin":
          data.status = 2;
          break;
        default:
          break;
      }
      let filesDetails = await apiservice(
        apiConfig.fileList.path,
        apiConfig.fileList.method,
        data
      );
      if (filesDetails && filesDetails.status) {
        this.files_list = filesDetails.response;
        this.totalItems = filesDetails.counts;
        this.total_page = Math.ceil(this.totalItems / this.limit);
        for (let index = 0; index < this.total_page; index++) {
          this.page_list.push(index);
        }
      }
    },
    async favouriteAddRemove(file_id) {
      if (file_id) {
        let data = {
          file_id: file_id,
        };
        await apiservice(
          apiConfig.favouriteAddRemove.path,
          apiConfig.favouriteAddRemove.method,
          data
        );
        this.filesListGet();
      }
    },
    async MoveBin(file_id) {
      if (file_id) {
        let data = {
          file_id: file_id,
        };
        await apiservice(
          apiConfig.moveToBin.path,
          apiConfig.moveToBin.method,
          data
        );
        this.filesListGet();
      }
    },
    async RemoveBin(items) {
      if (items) {
        let data = {
          file_id: items._id,
          size: items.file_size,
          total_size: store.settings.storage,
        };
        await apiservice(
          apiConfig.removeFromBin.path,
          apiConfig.removeFromBin.method,
          data
        );
        this.filesListGet();
        GeneralSettings();
      }
    },
  },
};
</script>