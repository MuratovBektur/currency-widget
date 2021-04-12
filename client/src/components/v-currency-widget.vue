<template>
  <div v-cloak>
    <template v-if="!isFailed">
      <div v-if="isLoaded" class="v-currency-widget">
        <div class="v-currency-widget__header">
          <div class="v-currency-widget__header-title">
            Курс {{ activeCurrency.name }} на {{ date }}
          </div>

          <nav
            class="v-currency-widget__currency-list"
            :class="{
              'v-currency-widget__currency-list_right': activateCurrencyListAnimationToRight,
              'v-currency-widget__currency-list_right_close': activateCurrencyListAnimationToRight,
              'v-currency-widget__currency-list_left': activateCurrencyListAnimationToLeft,
              'v-currency-widget__currency-list_left_close': activateCurrencyListAnimationToLeft,
            }"
          >
            <img
              v-show="showLeftChevron"
              class="v-currency-widget__chevron-btn"
              @click="onPrevPage"
              src="../assets/img/chevron-left.svg"
              alt=""
            />
            <img
              v-show="!showLeftChevron"
              class="v-currency-widget__chevron-btn"
              src="../assets/img/blank.svg"
              alt=""
            />

            <div
              class="v-currency-widget__currency-item"
              :class="{
                'v-currency-widget__currency-item_active':
                  activeCurrency.id === currency.id,
              }"
              @click="changeCurrency(currency)"
              v-for="currency of activeCurrencyList"
              :key="currency.id"
            >
              {{ currency.name }}
            </div>
            <img
              v-show="showRightChevron"
              class="v-currency-widget__chevron-btn"
              @click="onNextPage"
              src="../assets/img/chevron-right.svg"
              alt=""
            />
          </nav>
        </div>
        <div class="v-currency-widget__currency-info">
          <div class="v-currency-widget__calc-input-panel">
            <input
              type="number"
              v-model="increaseRate"
              class="v-currency-widget__calc-input"
            />
            {{ activeCurrency.name }}
          </div>
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
          </div>
          <div class="v-currency-widget__pagination">
            <button
              @click="onPrevCardList"
              class="v-currency-widget__pagination-btn"
              :disabled="!showLeftPaginationBtn"
              :class="{
                'v-currency-widget__pagination-btn_disable': !showLeftPaginationBtn,
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
              @click="onNextCardList"
              :disabled="!showRightPaginationBtn"
              class="v-currency-widget__pagination-btn"
              :class="{
                'v-currency-widget__pagination-btn_disable': !showRightPaginationBtn,
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
        </div>
      </div>
      <div v-else class="v-currency-widget-loading">
        <div class="v-currency-widget-loading__header"></div>
        <div class="v-currency-widget-loading__body">
          <div class="v-currency-widget-loading__spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="v-currency-widget-failed">
      <div class="v-currency-widget-failed__header"></div>
      <div class="v-currency-widget-failed__body">
        <h2 align="center">Что пошло не так попробуйте позже...</h2>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import debounce from "lodash/debounce";
import { DebouncedFunc } from "lodash";

type currencyType = {
  id: number;
  name: string;
  rate: number;
};

interface IState {
  currencyList: Array<currencyType>;
  date: string;

  isLoaded: boolean;
  isFailed: boolean;

  activateCurrencyListAnimationToLeft: boolean;
  activateCurrencyListAnimationToRight: boolean;
  activateCurrencyCardListAnimationToRight: boolean;
  activateCurrencyCardListAnimationToLeft: boolean;

  penultIndex: number;
  penultCardIndex: number;

  currencyPerPage: number;
  currencyCardPerPage: number;

  increaseRate: number;
  activeCurrency: currencyType;
}

export default Vue.extend({
  data(): IState {
    return {
      isFailed: false,
      isLoaded: false,

      increaseRate: 1,
      currencyList: [],
      date: new Date().toLocaleDateString(),
      currencyPerPage: 1,
      currencyCardPerPage: 1,
      penultIndex: 0,
      penultCardIndex: 0,
      activateCurrencyListAnimationToLeft: false,
      activateCurrencyListAnimationToRight: false,
      activateCurrencyCardListAnimationToRight: false,
      activateCurrencyCardListAnimationToLeft: false,
      activeCurrency: {
        id: -1,
        name: "",
        rate: 1,
      },
    };
  },

  async mounted(): Promise<void> {
    window.addEventListener("resize", this.debouncedOnResize());

    await this.fetchCurrencyList();
    this.activeCurrency = this.currencyList[0];
    this.onResize();
  },

  updated(): void {
    this.changeFontSizeOfCalcData();
    this.changeFontSizeOfInputData();
  },
  destroyed(): void {
    window.removeEventListener("resize", this.debouncedOnResize());
  },
  methods: {
    async fetchCurrencyList(): Promise<void> {
      try {
        const apiUrl = "http://localhost:4000/api/currency/all";
        const { data } = await axios.get(apiUrl);
        // this.currencyList = Object.keys(data.currencies).map(
        //   (name, index): currencyType => ({
        //     id: index,
        //     name,
        //     rate: data.rates[name],
        //   })
        // );
        this.currencyList = data.currencies;
        this.date = data.date;
        this.isLoaded = true;
      } catch (e) {
        this.isFailed = true;
        console.error(e);
      }
    },
    changeFontSizeOfInputData() {
      const currencyCardList: any = this.$refs.inputData;
      currencyCardList.forEach((node: HTMLElement) => {
        let height = +window
          .getComputedStyle(node)
          .getPropertyValue("height")
          .slice(0, -2);

        while (height > 30) {
          node.style.fontSize =
            +window
              .getComputedStyle(node)
              .getPropertyValue("font-size")
              .slice(0, -2) -
            1 +
            "px";
          height = +window
            .getComputedStyle(node)
            ["height"] // .getPropertyValue("height")
            .slice(0, -2);
        }

        if (node.innerText.length < 22) {
          let currentFontSize = this.currencyPerPage > 6 ? 24 : 18;
          node.style.fontSize = currentFontSize + "px";
        }
      });
    },
    changeFontSizeOfCalcData() {
      const currencyCardList: any = this.$refs.calculatedData;
      currencyCardList.forEach((node: HTMLElement) => {
        let height = +window
          .getComputedStyle(node)
          .getPropertyValue("height")
          .slice(0, -2);

        while (height > 70) {
          node.style.fontSize =
            +window
              .getComputedStyle(node)
              .getPropertyValue("font-size")
              .slice(0, -2) -
            1 +
            "px";
          height = +window
            .getComputedStyle(node)
            ["height"] // .getPropertyValue("height")
            .slice(0, -2);
        }

        if (node.innerText.length < 13) {
          let currentFontSize = this.currencyPerPage > 6 ? 24 : 18;
          node.style.fontSize = currentFontSize + "px";
        }
      });
    },
    calcDecimalPointsNum(num: number) {
      let numCopy = num;
      let chars = numCopy.toString().split("");
      if (chars[0] !== "0") {
        numCopy = num;
        chars = numCopy.toFixed(20).toString().split("");
      }
      const idx = chars.findIndex(
        (char: string) => char !== "0" && char !== "."
      );
      return +chars.slice(0, idx + 2).join("");
    },
    currencyListAnimation(cb: () => void, direction = "right"): void {
      if (direction === "right") {
        this.activateCurrencyListAnimationToRight = true;
        cb();
        const interval = setTimeout(() => {
          this.activateCurrencyListAnimationToRight = false;
          clearTimeout(interval);
        }, 200);
      } else {
        this.activateCurrencyListAnimationToLeft = true;
        cb();
        const interval = setTimeout(() => {
          this.activateCurrencyListAnimationToLeft = false;
          clearTimeout(interval);
        }, 200);
      }
    },
    currencyCardListAnimation(cb: () => void, direction = "right"): void {
      if (direction === "right") {
        this.activateCurrencyCardListAnimationToRight = true;
        cb();
        const interval = setTimeout(() => {
          this.activateCurrencyCardListAnimationToRight = false;
          clearTimeout(interval);
        }, 200);
      } else {
        this.activateCurrencyCardListAnimationToLeft = true;
        cb();
        const interval = setTimeout(() => {
          this.activateCurrencyCardListAnimationToLeft = false;
          clearTimeout(interval);
        }, 200);
      }
    },
    changeCurrency(currency: currencyType): void {
      this.activeCurrency = currency;
      if (this.showRightChevron) {
        const lastIndex = this.activeCurrencyList[this.currencyPerPage - 1].id;

        if (lastIndex === currency.id) {
          this.currencyListAnimation(
            () => (this.penultIndex += this.currencyPerPage - 2)
          );

          return;
        }
      }
      if (this.showLeftChevron && this.penultIndex > 0) {
        const firstIndex = this.activeCurrencyList[0].id;

        if (firstIndex === currency.id) {
          this.onPrevPage();
        }
      }
    },
    onNextPage(): void {
      this.currencyListAnimation(() => {
        this.penultIndex += this.currencyPerPage - 1;
      });
    },
    onPrevPage(): void {
      this.currencyListAnimation(() => {
        if (this.penultIndex - (this.currencyPerPage - 1) >= 0) {
          this.penultIndex -= this.currencyPerPage - 1;
        } else this.penultIndex = 0;
      }, "left");
    },
    onNextCardList(): void {
      if (this.showRightPaginationBtn) {
        this.currencyCardListAnimation(() => {
          this.penultCardIndex += this.currencyCardPerPage;
        });
      }
    },
    onPrevCardList(): void {
      if (this.showLeftPaginationBtn) {
        this.currencyCardListAnimation(() => {
          this.penultCardIndex -= this.currencyCardPerPage;
        }, "left");
      }
    },
    debouncedOnResize(): DebouncedFunc<any> {
      return debounce(this.onResize, 300);
    },
    onResize(): void {
      const documentBodyWidth = document.body.clientWidth;
      // const documentBodyWidth = window.innerWidth;
      if (documentBodyWidth > 992) {
        this.currencyPerPage = 7;
      } else if (documentBodyWidth > 768) {
        this.currencyPerPage = 6;
      } else {
        this.currencyPerPage = 3;
      }
      this.currencyCardPerPage = this.currencyPerPage > 5 ? 4 : 2;

      if (this.activeCurrency.id != -1) {
        const idx = this.currencyList.findIndex(
          (currency: currencyType) => currency.id === this.activeCurrency.id
        );
        if (idx !== 0) {
          this.penultIndex = idx - 1;
        } else {
          this.penultIndex = idx;
        }
      }
    },
  },

  computed: {
    activeCurrencyList(): currencyType[] {
      return this.currencyList.slice(
        this.penultIndex,
        this.penultIndex + this.currencyPerPage
      );
    },
    activeCurrencyCardList(): currencyType[] {
      return this.currencyList
        .filter((currency) => currency.id !== this.activeCurrency.id)
        .slice(
          this.penultCardIndex,
          this.penultCardIndex + this.currencyCardPerPage
        );
    },
    calculatedRate() {
      const calcRated = (
        increateRate: number,
        activeCurrencyRate: number,
        currencyRate: number
      ) => {
        let result: number | string =
          increateRate * (currencyRate / activeCurrencyRate);

        result =
          result * 100 > 1
            ? result.toFixed(2)
            : this.calcDecimalPointsNum(result);

        return result > 0 ? result : " ";
      };

      let result: number[] | string[] = [];

      Object.values(this.activeCurrencyCardList).forEach(
        (currency: currencyType) => {
          let id = currency.id;
          result[id] = calcRated(
            this.increaseRate,
            this.activeCurrency.rate,
            currency.rate
          );
        }
      );

      return result;
      // return this.activeCurrencyCardList.reduce(
      //   (acc: { number: number | string }, currency: currencyType) => {
      //     return {
      //       ...acc,
      //       [currency.id]: calcRated(
      //         this.increaseRate,
      //         this.activeCurrency.rate,
      //         currency.rate
      //       ),
      //     };
      //   },
      //   {}
      // );
    },
    showRightChevron(): boolean {
      return this.currencyPerPage === this.activeCurrencyList.length;
    },
    showLeftChevron(): boolean {
      return this.penultIndex !== 0;
    },

    showRightPaginationBtn(): boolean {
      // const lastCurrencyId = this.currencyList[this.currencyList.length - 1].id;
      const lastCurrencyId = this.currencyList.length
        ? this.currencyList[this.currencyList.length - 1].id
        : -1;
      // const activeCurrencyCardId = this.activeCurrencyCardList[
      //   this.activeCurrencyCardList.length - 1
      // ].id;
      const activeCurrencyCardId = this.activeCurrencyCardList.length
        ? this.activeCurrencyCardList[this.activeCurrencyCardList.length - 1].id
        : -1;
      return this.activeCurrency.id === lastCurrencyId
        ? lastCurrencyId - 1 !== activeCurrencyCardId
        : lastCurrencyId !== activeCurrencyCardId;
    },
    showLeftPaginationBtn(): boolean {
      return this.penultCardIndex !== 0;
    },
  },
  watch: {
    activeCurrency() {
      this.penultCardIndex = 0;
    },
  },
});
</script>

<style lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}
$animation-duration: 0.8s;
[v-cloak] {
  display: none !important;
}
.v-currency-widget {
  width: 720px;
  font-family: Roboto;
  position: relative;
  overflow: hidden;
  button:focus {
    outline: none;
  }
  .mr-3 {
    display: inline-block;
    margin-right: 10px;
  }
  &__header {
    padding: 30px 17px 0 24px;
    background-color: #ffe782;
  }
  &__header-title {
    font-family: "Roboto";
    font-style: normal;
    font-weight: normal;
    font-size: 21px;
    line-height: 25px;
    /* identical to box height */

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
  &__currency-card:only-of-type {
    margin-bottom: 5px;
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
  &__currency-info {
    padding: 24px;
    // height: 471px;
    background-color: #fff;
  }
  &__calc-input-panel {
    width: 176px;
    margin-left: auto;
    font-size: 18px;
    line-height: 21px;

    color: #b9b9b9;
  }
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
  }
  &__calc-input:focus {
    outline: none;
  }

  &__currency-card-list {
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
  &__currency-card {
    display: inline-flex;
    margin-right: 18px;
    flex-direction: column;
    justify-content: space-between;
    padding: 18px 24px 17px 30px;
    width: 323px;
    height: 138px;
    box-shadow: 0px 3px 6px rgba(157, 157, 157, 0.16);
    border-radius: 12px;
  }
  &__currency-card:nth-child(even) {
    margin-right: 0;
  }
  &__currency-card:nth-child(4n + 3),
  &__currency-card:nth-child(4n + 4) {
    margin-top: 18px;
    margin-bottom: 5px;
  }
  &__currency-card-input-data {
    font-weight: 300;
    font-size: 24px;
    line-height: 28px;
    letter-spacing: 0.0171429px;

    color: #b9b9b9;
  }
  &__currency-card-input-data-number {
    color: #2b2d33;
  }
  &__currency-card-calculated-data {
    font-weight: 300;
    font-size: 24px;
    line-height: 58px;

    letter-spacing: 0.02px;

    color: #2b2d33;
  }
  &__currency-card-calculated-data-number {
    font-weight: 300;
    font-size: 2em;
    line-height: 56px;
    letter-spacing: 0.037px;

    color: #2b2d33;
  }
  &__pagination {
    display: flex;
    justify-content: center;
    margin-top: 51px;
  }
  &__pagination-btn {
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
  }
  &__pagination-btn svg {
    position: relative;
    top: 1px;
  }

  &__pagination-btn:first-child {
    margin-right: 19px;
  }
  &__pagination-btn_disable {
    background: #efefef;
  }
}
@media screen and (max-width: 992px) {
  .v-currency-widget {
    width: 610px;
    &__currency-item {
      padding: 14px 31px 18px;
    }
    &__calc-input-panel {
      width: 156px;
      font-size: 16px;
      line-height: 18px;
    }
    &__calc-input {
      width: 99px;
      font-size: 16px;
      line-height: 18px;
    }
    &__currency-card-list {
      margin-top: 24px;
    }
    &__currency-card {
      margin-right: 14px;
      padding: 23px 24px 19px 30px;
      width: 270px;
      &-input-data {
        font-size: 18px;
        line-height: 21px;
      }
      &-calculated-data {
        font-size: 18px;
        line-height: 21px;
      }
      // &-calculated-data-number {
      //   font-size: 36px;
      //   line-height: 42px;
      // }
    }
  }
}
@media screen and (max-width: 768px) {
  .v-currency-widget {
    width: 320px;
    &__currency-item {
      padding: 14px 26px 18px;
    }
    &__calc-input-panel {
      width: 140px;
      font-size: 14px;
      line-height: 16px;
    }
    &__calc-input {
      width: 99px;
      font-size: 14px;
      line-height: 16px;
    }
    &__currency-card-list {
      margin-top: 23px;
    }
    &__currency-card {
      width: 264px;
      &:nth-child(even) {
        margin-right: 0;
        margin-top: 18px;
        margin-bottom: 5px;
      }
    }
  }
}

.v-currency-widget-failed {
  width: 720px;
  font-family: Roboto;
  &__header {
    background: #ffe782;
    height: 111px;
  }
  &__body {
    background-color: #fff;
    height: 471px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.v-currency-widget-loading {
  width: 720px;
  font-family: Roboto;
  &__header {
    background: #ffe782;
    height: 111px;
  }
  &__body {
    background-color: #fff;
    height: 471px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__spinner {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
    & > div {
      box-sizing: border-box;
      display: block;
      position: absolute;
      width: 40px;
      height: 40px;
      margin: 4px;
      border: 4px solid black;
      border-radius: 50%;
      animation: spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      border-color: black transparent transparent transparent;
    }
    & > div:nth-child(1) {
      animation-delay: -0.45s;
    }
    & > div:nth-child(2) {
      animation-delay: -0.3s;
    }
    & > div:nth-child(3) {
      animation-delay: -0.15s;
    }
    @keyframes spinner {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
}

@media screen and (max-width: 992px) {
  .v-currency-widget-failed,
  .v-currency-widget-loading {
    width: 610px;
  }
}

@media screen and (max-width: 768px) {
  .v-currency-widget-failed,
  .v-currency-widget-loading {
    width: 320px;
  }
}
</style>
