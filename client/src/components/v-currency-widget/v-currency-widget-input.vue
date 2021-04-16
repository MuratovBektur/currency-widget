<template>
  <div class="v-currency-widget-input">
    <input
      type="number"
      v-model="inputVal"
      class="v-currency-widget-input__calc-input"
    />
    {{ activeCurrencyName }}
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    value: [Number, String],
    activeCurrencyName: String,
  },
  computed: {
    inputVal: {
      get() {
        return this.value;
      },
      set(val: any): void {
        this.$emit("input", val);
      },
    },
  },
});
</script>

<style lang="scss">
.v-currency-widget-input {
  width: 176px;
  margin-left: auto;
  font-size: 18px;
  line-height: 21px;

  color: #b9b9b9;
  &__calc-input {
    font-family: Roboto;
    font-size: 18px;
    line-height: 21px;
    padding: 0 4px 4px 0;
    width: 121px;
    text-align: right;
    margin-right: 4px;
    border: none;
    border-bottom: 1px solid #d9d9d9;
    color: #2b2d33;
    &:focus {
      outline: none;
    }
  }
}
@media screen and (max-width: 992px) {
  .v-currency-widget-input {
    width: 156px;
    font-size: 16px;
    line-height: 18px;
    &__calc-input {
      width: 99px;
      font-size: 16px;
      line-height: 18px;
    }
  }
}
@media screen and (max-width: 768px) {
  .v-currency-widget-input {
    width: 140px;
    font-size: 14px;
    line-height: 16px;

    &__calc-input {
      width: 99px;
      font-size: 14px;
      line-height: 16px;
    }
  }
}
</style>
