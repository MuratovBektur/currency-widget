<template>
  <div class="v-currency-widget__currency-card">
    <div class="v-currency-widget__currency-card-input-data" ref="inputData">
      <span class="v-currency-widget__currency-card-input-data-number">
        {{ increaseRate }}
      </span>
      {{ activeCurrency.name }} =
    </div>
    <div
      class="v-currency-widget__currency-card-calculated-data"
      ref="calculatedData"
    >
      <span class="v-currency-widget__currency-card-calculated-data-number">
        {{ calculatedRate[currency.id] }}
      </span>
      {{ currency.name }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({});
</script>

<style scoped></style>
