<template>
  <div class="v-currency-widget-pagination">
    <button
      @click="$emit('on-prev-card-list')"
      class="v-currency-widget-pagination__btn"
      :disabled="!showLeftPaginationBtn"
      :class="{
        'v-currency-widget-pagination__btn_disable': !showLeftPaginationBtn,
      }"
    >
      <div class="mr-3">
        <svg
          width="8"
          height="12"
          viewBox="0 0 8 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.40991 10.58L2.82991 6L7.40991 1.41L5.99991 0L-8.7738e-05 6L5.99991 12L7.40991 10.58Z"
            :fill="showLeftPaginationBtn ? '#282828' : '#787878'"
          />
        </svg>
      </div>
      <span>Назад</span>
    </button>
    <button
      @click="$emit('on-next-card-list')"
      :disabled="!showRightPaginationBtn"
      class="v-currency-widget-pagination__btn"
      :class="{
        'v-currency-widget-pagination__btn_disable': !showRightPaginationBtn,
      }"
    >
      <div class="mr-3">Далее</div>

      <svg
        width="8"
        height="12"
        viewBox="0 0 8 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 10.58L4.58 6L0 1.41L1.41 0L7.41 6L1.41 12L0 10.58Z"
          :fill="showRightPaginationBtn ? '#282828' : '#787878'"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    showLeftPaginationBtn: Boolean,
    showRightPaginationBtn: Boolean,
  },
});
</script>

<style lang="scss">
.mr-3 {
  display: inline-block;
  margin-right: 10px;
}
.v-currency-widget-pagination {
  display: flex;
  justify-content: center;
  margin-top: 51px;
  &__btn {
    padding: 10px 18px 8px 25px;
    border: none;
    font-weight: 300;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 1px;
    text-transform: uppercase;
    background: #ffffff;
    box-shadow: 0px 5px 6px rgba(157, 157, 157, 0.16);
    border-radius: 8px;
    cursor: pointer;

    color: #787878;
    & svg {
      position: relative;
      top: 1px;
    }
    &:first-child {
      margin-right: 19px;
    }
    &_disable {
      background: #efefef;
    }
  }
}
</style>
