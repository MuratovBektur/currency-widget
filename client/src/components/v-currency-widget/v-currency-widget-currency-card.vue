<template>
  <div class="v-currency-widget-currency-card">
    <div class="v-currency-widget-currency-card__input-data" ref="inputData">
      <span class="v-currency-widget-currency-card__input-data-number">
        {{ increaseRate }}
      </span>
      {{ activeCurrencyName }} =
    </div>
    <div
      class="v-currency-widget-currency-card__calculated-data"
      ref="calculatedData"
      :id="currency.id"
    >
      <span class="v-currency-widget-currency-card__calculated-data-number">
        {{ calculatedRate[currency.id] }}
      </span>
      {{ currency.name }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

type currencyType = {
  id: number;
  name: string;
  rate: number;
};

export default Vue.extend({
  props: {
    increaseRate: [Number, String],
    activeCurrencyName: String,
    currency: Object as () => currencyType,
    calculatedRate: Array,
    currencyPerPage: Number,
  },
  updated() {
    this.changeFontSizeOfCalcData();
    this.changeFontSizeOfInputData();
    console.log("updated");
  },
  methods: {
    getStyle(node: HTMLElement, styleProp: string): number {
      return +window
        .getComputedStyle(node)
        .getPropertyValue(styleProp)
        .slice(0, -2);
    },
    changeFontSizeOfCalcData() {
      this.$nextTick(function () {
        const currencyCardNode: any = this.$refs.calculatedData;
        let height = this.getStyle(currencyCardNode, "height");

        const minHeigth = this.currencyPerPage > 5 ? 70 : 42;
        console.log("______________");
        console.log("______________");
        console.log("______________");
        console.log("______________");
        console.log("______________");
        console.log("height", height);
        console.log("minHeigth", minHeigth);

        let start = 0;
        while (height > minHeigth && start < 30) {
          start++;
          currencyCardNode.style.fontSize =
            this.getStyle(currencyCardNode, "font-size") - 1 + "px";
          height = this.getStyle(currencyCardNode, "height");
          console.log("height in", height);
          console.log("font-size in", currencyCardNode.style.fontSize);
        }

        if (currencyCardNode.innerText.length < 13) {
          let currentFontSize = this.currencyPerPage > 6 ? 24 : 18;
          currencyCardNode.style.fontSize = currentFontSize + "px";
        }
      });
    },
    changeFontSizeOfInputData() {
      this.$nextTick(function () {
        const currencyCardNode: any = this.$refs.inputData;
        // console.log("test", currencyCardNode);
        let height = +window
          .getComputedStyle(currencyCardNode)
          .getPropertyValue("height")
          .slice(0, -2);
        // currencyCardNode

        const minHeigth = this.currencyPerPage > 6 ? 50 : 40;
        // console.log("height", height, minHeigth);
        // console.log("another one", currencyCardNode.offsetHeight);
        let start = 0;
        while (height > minHeigth && start < 30) {
          start++;
          currencyCardNode.style.fontSize =
            +window
              .getComputedStyle(currencyCardNode)
              .getPropertyValue("font-size")
              .slice(0, -2) -
            1 +
            "px";
          height = +window
            .getComputedStyle(currencyCardNode)
            ["height"] // .getPropertyValue("height")
            .slice(0, -2);
          // console.log("height", height, currencyCardNode.style.fontSize);
        }

        if (currencyCardNode.innerText.length < 22) {
          let currentFontSize = this.currencyPerPage > 6 ? 24 : 18;
          currencyCardNode.style.fontSize = currentFontSize + "px";
        }
      });
    },
  },
  mounted() {
    this.changeFontSizeOfCalcData();
    this.changeFontSizeOfInputData();
  },
  watch: {
    // calculatedRate() {
    //   this.changeFontSizeOfCalcData();
    // },
    // increaseRate() {
    //   this.changeFontSizeOfInputData();
    // },
    currencyPerPage(val) {
      console.log("currencyPerPage in card", val);
      this.changeFontSizeOfCalcData();
      this.changeFontSizeOfInputData();
    },
  },
});
</script>

<style lang="scss">
.v-currency-widget-currency-card {
  display: inline-flex;
  margin-right: 18px;
  flex-direction: column;
  justify-content: space-between;
  padding: 18px 24px 17px 30px;
  width: 323px;
  height: 138px;
  box-shadow: 0px 3px 6px rgba(157, 157, 157, 0.16);
  border-radius: 12px;
  &:nth-child(even) {
    margin-right: 0;
  }
  &:nth-child(4n + 3),
  &:nth-child(4n + 4) {
    margin-top: 18px;
    margin-bottom: 5px;
  }
  &__input-data {
    font-weight: 300;
    font-size: 24px;
    line-height: 28px;
    letter-spacing: 0.0171429px;

    color: #b9b9b9;
    &-number {
      color: #2b2d33;
    }
  }
  &__calculated-data {
    font-weight: 300;
    font-size: 24px;
    line-height: 58px;

    letter-spacing: 0.02px;

    color: #2b2d33;
    &-number {
      font-size: 2em;
      letter-spacing: 0.037px;
    }
  }
}
@media screen and (max-width: 992px) {
  .v-currency-widget-currency-card {
    margin-right: 14px;
    padding: 23px 24px 19px 30px;
    width: 270px;
    &__input-data {
      font-size: 18px;
      line-height: 21px;
    }
    &__calculated-data {
      font-size: 18px;
      line-height: 21px;
    }
  }
}
@media screen and (max-width: 768px) {
  .v-currency-widget-currency-card {
    width: 264px;
    &:nth-child(even) {
      margin-right: 0;
      margin-top: 18px;
      margin-bottom: 5px;
    }
  }
}
</style>
