<template>
        
          <div
            class="v-currency-widget__currency-card-list"
            :class="{
              'v-currency-widget__currency-card-list_right': activateCurrencyCardListAnimationToRight,
              'v-currency-widget__currency-card-list_right_close': activateCurrencyCardListAnimationToRight,
              'v-currency-widget__currency-card-list_left': activateCurrencyCardListAnimationToLeft,
              'v-currency-widget__currency-card-list_left_close': activateCurrencyCardListAnimationToLeft,
            }"
          >
            <div
              v-for="currency of activeCurrencyCardList"
              :key="currency.id"
              class="v-currency-widget__currency-card"
            >
              <div
                class="v-currency-widget__currency-card-input-data"
                ref="inputData"
              >
                <span
                  class="v-currency-widget__currency-card-input-data-number"
                >
                  {{ increaseRate }}
                </span>
                {{ activeCurrency.name }} =
              </div>
              <div
                class="v-currency-widget__currency-card-calculated-data"
                ref="calculatedData"
              >
                <span
                  class="v-currency-widget__currency-card-calculated-data-number"
                >
                  {{ calculatedRate[currency.id] }}
                </span>
                {{ currency.name }}
              </div>
            </div>
         
</template>

<script lang="ts">
    import Vue from 'vue'

    export default Vue.extend({
        
    })
</script>

<style scoped>

</style>