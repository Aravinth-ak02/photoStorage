<script setup>
import { onMounted } from "vue";
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";
import { apiConfig } from "./service/apiConfig";
import { apiservice  , GeneralSettings} from "./service/apiService";
import { store } from "./service/store.js";
onMounted(async () => {
  GeneralSettings()
});
</script>

<template>
  <!-- <div> -->
  <!-- <header> -->
  <Header />
  <!-- </header> -->
  <!-- <div class=""> -->
  <!-- </div> -->
  <div class="row">
    <div class="col-lg-3">
      <Sidebar />
    </div>
    <div class="col-lg-9">
      <router-view></router-view>
    </div>
  </div>
  <!-- <main> -->

  <!-- </main> -->
  <!-- </div> -->
</template>

<style scoped>
.sidebar-show {
  width: 25vh;
  height: 80vh;
}
</style>
