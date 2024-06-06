<template>
  <div class="sidebar-show">
    <div
      class="sidebar-item"
      :class="selected_tap === 'allphotos' ? 'active' : ''"
    >
      <a href="/allphotos" @click="selected_tap = 'all_photos'">Photos</a>
      <!-- All Photos -->
    </div>
    <div
      class="sidebar-item"
      :class="selected_tap === 'favourite' ? 'active' : ''"
    >
      <a href="/favourite" @click="selected_tap = 'favourite'">Favourite</a>
      <!-- Favourite -->
    </div>
    <div class="sidebar-item" :class="selected_tap === 'bin' ? 'active' : ''">
      <a href="/bin" @click="selected_tap = 'bin'">Bin</a>
      <!-- Bin -->
    </div>
    <div class="storage-container">
      <label
        ><span style="font-weight: 600">Storage</span> {{ this.store.settings.storage && this.store.settings.storage ? (this.store.settings.storage / 1000000).toFixed(2) : 0 }}MB/100MB</label
      >
      <div
        class="progress"
        role="progressbar"
        aria-label="Basic example"
        aria-valuenow="0"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          class="progress-bar"
          :style="{
            width:
              (store && store.settings
                ? (store.settings.storage / (100*1000000)) * 100
                : 0) + '%',
          }"
        ></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.sidebar-item {
  text-align: center;
  font-size: 16px;
  font-weight: 300;
  margin-top: 20px;
  background: #fff;
  padding: 5px 23px;
  cursor: pointer;
}
.sidebar-item.active {
  border: 0.5px solid #ddd;
  border-radius: 11px;
}
.sidebar-show {
  width: 25vh;
  height: 80vh;
}
.storage-container {
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  position: absolute;
  bottom: 0;
}
</style>
<script>
import { store } from "@/service/store";
export default {
  data() {
    return {
      selected_tap: "allphotos",
      store: store,
      size: 0,
    };
  },
  mounted() {
    let route_det = window.location.pathname.split("/")[1];
    if (route_det) {
      this.selected_tap = route_det;
    }
    console.log(route_det);
  },
};
</script>
