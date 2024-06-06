<template>
  <div class="header-container">
    <lable>Photos</lable>
    <input
      type="text"
      class="search-header form-control"
      placeholder="search"
      id="searchDescription"
    />
    <div class="custom-file-upload">
      <input
        type="file"
        id="file-upload"
        multiple
        accept="image/*"
        @change="fileChange"
      />
      <label for="file-upload">Upload</label>
      <div
        id="fileUploadModal"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      ></div>
    </div>
  </div>
  <div
    class="modal fade"
    id="staticBackdrop"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">Add File</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="(files_list = []), (total_size = 0)"
          ></button>
        </div>
        <div class="modal-body">
          <div class="modal-upload">
            <div
              class="image-container"
              v-for="(item, index) in files_list"
              :key="index"
              @click="showRemoveIcon(index)"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-title="Click to remove"
            >
              <img :src="item.file_url" class="img-modal" />
              <div class="remove-icon" v-if="hoverIndex === index">
                Click to remove
              </div>
            </div>
          </div>
          <textarea
            class="form-control description-view"
            @input="updateMessage"
            placeholder="add description"
          ></textarea>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="(files_list = []), (total_size = 0)"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="fileSubmit">
            Upload
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.header-container {
  gap: 17%;
  display: flex;
  margin: 2% 1%;
  border-bottom: 1px solid;
  padding-bottom: 20px;
}
.header-container .search-header {
  width: 53%;
}
.custom-file-upload {
  position: relative;
  display: inline-block;
  overflow: hidden;
  margin-right: 10px; /* adjust spacing as needed */
}

.custom-file-upload input[type="file"] {
  position: absolute;
  font-size: 100px;
  opacity: 0;
  right: 0;
  top: 0;
}

.custom-file-upload label {
  background-color: #fff;
  color: #000000dd;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  background: border-box;
  border: 1px solid #000;
  border-radius: 10px;
}

.custom-file-upload label:hover {
  background-color: #0056b3;
}

.img-modal {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

.modal-upload {
  display: flex;
  gap: 15px;
  width: 500px;
  flex-wrap: wrap;
}
.remove-icon {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 5px;
  cursor: pointer;
}
.image-container {
  position: relative; /* Position the container relatively */
  margin: 5px; /* Add margin between the images */
  cursor: pointer;
}
.remove-icon {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 5px;
  cursor: pointer;
  display: none;
}

.image-container:hover .remove-icon {
  display: block;
}

.description-view {
  margin: 10px 3px;
}
</style>
<script>
import { apiservice , GeneralSettings } from "@/service/apiService";
import { apiConfig } from "@/service/apiConfig";
import { store } from "../service/store.js";
import eventBus from "../service/eventBus.js";
export default {
  data() {
    return {
      files_list: [],
      total_size: 0,
      description: "",
      settings: store.settings
    };
  },
  mounted(){
    
  },
  methods: {
    showRemoveIcon(index) {
      this.files_list.splice(index, 1);
    },
    hideRemoveIcon() {
      this.hoverIndex = null;
    },
    updateMessage(event) {
      if (event && event.target && event.target.value) {
        this.description = event.target.value;
      }
    },
    fileChange(event) {
      if (event && event.target && event.target.files.length > 0) {
        for (let index = 0; index < event.target.files.length; index++) {
          let type_split = event.target.files[index].type.split("/");
          if (type_split[0] != "image") {
            this.files_list = [];
            this.total_size = 0;
            alert("Please select image");
            break;
          }
          this.files_list.push({
            file_size: event.target.files[index].size,
          });
          this.readFileAsBase64(event.target.files[index], index);
          this.total_size += event.target.files[index].size;
        }
        document.getElementById("fileUploadModal").click();
      }
    },
    readFileAsBase64(file, index) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result;
        this.files_list[index].file_url = base64String;
        // Your logic with base64String
      };

      reader.onerror = (error) => {
        console.error("File reading error:", error);
        // Handle error
      };

      reader.readAsDataURL(file);
    },
    fileSubmit() {
      if (
        this.files_list &&
        Array.isArray(this.files_list) &&
        this.files_list.length > 0
      ) {
        let tot_size = (store.settings.storage+this.total_size)/1000000;
        if(tot_size > 100){
          alert("Not enough store! Please try again")
          return
        }
        let data = {
          file_list: this.files_list,
          size: this.total_size,
        };
        if (this.description) {
          data.description = this.description;
        }
        apiservice(
          apiConfig.fileUpload.path,
          apiConfig.fileUpload.method,
          data
        ).then((result) => {
          document.getElementById("fileUploadModal").click();
          if (result) {
            // GeneralSettings();
            this.files_list = [];
            this.total_size = 0;
            this.description = "";
            alert(result.message);
            setTimeout(() => {
              window.location.reload()
            }, 0);
            return
          }
        });
      }
    },
  },
};
</script>