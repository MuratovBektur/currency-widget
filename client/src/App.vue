<template>
  <div id="app">
    <div class="container">
      <div class="block-center"><vCurrencyWidget /></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

// import vCurrencyWidget from ;
export default Vue.extend({
  components: {
    vCurrencyWidget: () => import("./components/v-currency-widget/index.vue"),
  },
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap");
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
#app {
  min-height: 100vh;
  padding-top: 60px;
  background-color: #f2f2f2;
}
.container {
  max-width: 1146px;
  width: 90%;
  margin: 0 auto;
}
.block-center {
  display: flex;
  justify-content: center;
}
</style>
