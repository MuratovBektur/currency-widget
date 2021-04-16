<template>
  <div
    class="v-currency-widget-currency-card-list"
    :class="{
      'v-currency-widget-currency-card-list_right':
        activateAnimation.activateCurrencyCardListAnimationToRight,
      'v-currency-widget-currency-card-list_right_close':
        activateAnimation.activateCurrencyCardListAnimationToRight,
      'v-currency-widget-currency-card-list_left':
        activateAnimation.activateCurrencyCardListAnimationToLeft,
      'v-currency-widget-currency-card-list_left_close':
        activateAnimation.activateCurrencyCardListAnimationToLeft,
    }"
  >
    <vCurrencyWidgetCurrencyCard
      v-for="currency of activeCurrencyCardList"
      :key="currency.id"
      :currency="currency"
      :increaseRate="increaseRate"
      :activeCurrencyName="activeCurrencyName"
      :calculatedRate="calculatedRate"
      :currencyPerPage="currencyPerPage"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import vCurrencyWidgetCurrencyCard from "./v-currency-widget-currency-card.vue";
type currencyType = {
  id: number;
  name: string;
  rate: number;
};
type activateAnimationType = {
  activateCurrencyCardListAnimationToRight: boolean;
  activateCurrencyCardListAnimationToLeft: boolean;
};

export default Vue.extend({
  props: {
    activeCurrencyCardList: {
      type: Array as () => Array<currencyType>,
      required: true,
    },
    activateAnimation: {
      type: Object as () => activateAnimationType,
      required: true,
    },
    increaseRate: [Number, String],
    activeCurrencyName: String,
    calculatedRate: Array,
    currencyPerPage: Number,
  },
  components: {
    vCurrencyWidgetCurrencyCard,
  },
});
</script>

<style lang="scss">
$animation-duration: 0.8s;
.v-currency-widget-currency-card-list {
  margin-top: 26px;
  padding: 0 4px;
  overflow: hidden;
  &_right {
    transform: translateX(2000px);
    animation: slide-cards-right $animation-duration forwards;
    &_close {
      animation: slide-cards-right-out $animation-duration forwards;
      transform: translateX(0);
    }
  }
  &_left {
    transform: translateX(-2000px);
    animation: slide-cards-left $animation-duration forwards;
    &_close {
      animation: slide-cards-left-out $animation-duration forwards;
      transform: translateX(0);
    }
  }
}
@media screen and (max-width: 992px) {
  .v-currency-widget-currency-card-list {
    margin-top: 24px;
  }
}
@media screen and (max-width: 768px) {
  .v-currency-widget-currency-card-list {
    margin-top: 23px;
  }
}
@keyframes slide-cards-right {
  100% {
    transform: translateX(0);
  }
}
@keyframes slide-cards-right-out {
  100% {
    transform: translateX(-2000px);
  }
}
@keyframes slide-cards-left {
  100% {
    transform: translateX(0);
  }
}
@keyframes slide-cards-left-out {
  100% {
    transform: translateX(2000px);
  }
}
</style>
