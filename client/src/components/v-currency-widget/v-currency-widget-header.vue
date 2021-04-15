<template>
  <div class="v-currency-widget-header">
    <div class="v-currency-widget-header__title">
      Курс {{ activeCurrency.name }} на {{ date }}
    </div>

    <nav
      class="v-currency-widget-header__currency-list"
      :class="{
        'v-currency-widget-header__currency-list_right':
          activateAnimation.activateCurrencyListAnimationToRight,
        'v-currency-widget-header__currency-list_right_close':
          activateAnimation.activateCurrencyListAnimationToRight,
        'v-currency-widget-header__currency-list_left':
          activateAnimation.activateCurrencyListAnimationToLeft,
        'v-currency-widget-header__currency-list_left_close':
          activateAnimation.activateCurrencyListAnimationToLeft,
      }"
    >
      <img
        v-show="showLeftChevron"
        class="v-currency-widget-header__chevron-btn"
        @click="$emit('on-prev-page')"
        src="../../assets/img/chevron-left.svg"
        alt=""
      />
      <img
        v-show="!showLeftChevron"
        class="v-currency-widget-header__chevron-btn"
        src="../../assets/img/blank.svg"
        alt=""
      />

      <div
        class="v-currency-widget-header__currency-item"
        :class="{
          'v-currency-widget-header__currency-item_active':
            activeCurrency.id === currency.id,
        }"
        @click="$emit('change-currency', currency)"
        v-for="currency of activeCurrencyList"
        :key="currency.id"
      >
        {{ currency.name }}
      </div>
      <img
        v-show="showRightChevron"
        class="v-currency-widget-header__chevron-btn"
        @click="$emit('on-next-page')"
        src="../../assets/img/chevron-right.svg"
        alt=""
      />
    </nav>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
type currencyType = {
  id: number;
  name: string;
  rate: number;
};

type activateAnimationType = {
  activateCurrencyListAnimationToRight: boolean;
  activateCurrencyListAnimationToLeft: boolean;
};

export default Vue.extend({
  props: {
    activeCurrencyList: {
      type: Array as () => Array<currencyType>,
      required: true,
    },
    activeCurrency: {
      type: Object as () => currencyType,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    showLeftChevron: Boolean,
    showRightChevron: Boolean,
    activateAnimation: {
      type: Object as () => activateAnimationType,
      required: true,
    },
  },
});
</script>

<style lang="scss">
$animation-duration: 0.8s;
.v-currency-widget-header {
  padding: 30px 17px 0 24px;
  background-color: #ffe782;
  &__title {
    font-size: 21px;
    line-height: 25px;

    color: #2b2d33;
  }
  &__currency-list {
    min-height: 48px;
    margin: 8px 0 0 0px;
    display: flex;
    overflow: hidden;
    &_right {
      transform: translateX(2000px);
      animation: slide-right $animation-duration forwards;
      &_close {
        animation: slide-right-out $animation-duration forwards;
        transform: translateX(0);
      }
    }
    &_left {
      transform: translateX(-2000px);
      animation: slide-left $animation-duration forwards;
      &_close {
        animation: slide-left-out $animation-duration forwards;
        transform: translateX(0);
      }
    }
  }
  @keyframes slide-right {
    100% {
      transform: translateX(0);
    }
  }
  @keyframes slide-right-out {
    100% {
      transform: translateX(-2000px);
    }
  }
  @keyframes slide-left {
    100% {
      transform: translateX(0);
    }
  }
  @keyframes slide-left-out {
    100% {
      transform: translateX(2000px);
    }
  }
  &__currency-item {
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    width: 90px;
    text-align: center;
    padding: 14px 32px 18px;
    color: #ccae68;
    cursor: pointer;
    &::first-child {
      margin-left: 10px;
    }
    &_active {
      background-color: #fff;
      border-radius: 8px 8px 0 0;
      color: #2b2d33;
    }
  }

  &__chevron-btn {
    cursor: pointer;
    position: relative;
    margin: auto 5px;
    bottom: 3px;
  }
}
@media screen and (max-width: 992px) {
  .v-currency-widget-header {
    &__currency-item {
      padding: 14px 31px 18px;
    }
  }
}
@media screen and (max-width: 768px) {
  .v-currency-widget-header {
    &__currency-item {
      padding: 14px 26px 18px;
    }
  }
}
</style>
