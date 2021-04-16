<template>
  <div v-cloak>
    <template v-if="!isFailed">
      <div v-if="isLoaded" class="v-currency-widget">
        <vCurrencyWidgetHeader
          :date="date"
          :activeCurrency="activeCurrency"
          :activeCurrencyList="activeCurrencyList"
          :showLeftChevron="showLeftChevron"
          :showRightChevron="showRightChevron"
          @change-currency="changeCurrency"
          @on-prev-page="onPrevPage"
          @on-next-page="onNextPage"
          :activateAnimation="{
            activateCurrencyListAnimationToRight,
            activateCurrencyListAnimationToLeft,
          }"
        />
        <div class="v-currency-widget__currency-info">
          <vCurrencyWidgetInput
            v-model="increaseRate"
            :activeCurrencyName="activeCurrency.name"
          />

          <vCurrencyWidgetCurrencyCardList
            :activeCurrencyCardList="activeCurrencyCardList"
            :activateAnimation="{
              activateCurrencyCardListAnimationToRight,
              activateCurrencyCardListAnimationToLeft,
            }"
            :currencyPerPage="currencyPerPage"
            :increaseRate="increaseRate"
            :activeCurrencyName="activeCurrency.name"
            :calculatedRate="calculatedRate"
          />
          <vCurrencyWidgetPagination
            :showLeftPaginationBtn="showLeftPaginationBtn"
            :showRightPaginationBtn="showRightPaginationBtn"
            @on-prev-card-list="onPrevCardList"
            @on-next-card-list="onNextCardList"
          />
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
import {
  vCurrencyWidgetHeader,
  vCurrencyWidgetInput,
  vCurrencyWidgetCurrencyCardList,
  vCurrencyWidgetPagination,
} from "./index";

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
      currencyPerPage: 11,
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

  components: {
    vCurrencyWidgetHeader,
    vCurrencyWidgetInput,
    vCurrencyWidgetCurrencyCardList,
    vCurrencyWidgetPagination,
  },

  async mounted(): Promise<void> {
    window.addEventListener("resize", this.debouncedOnResize());

    await this.fetchCurrencyList();
    this.activeCurrency = this.currencyList[0];
    this.onResize();
  },
  destroyed(): void {
    window.removeEventListener("resize", this.debouncedOnResize());
  },
  methods: {
    async fetchCurrencyList(): Promise<void> {
      try {
        const apiUrl = "http://localhost:4000/api/currency/all";
        const { data } = await axios.get(apiUrl);
        this.currencyList = data.currencies;
        console.log(this.currencyList);
        this.date = data.date;
        this.isLoaded = true;
      } catch (e) {
        this.isFailed = true;
        console.error(e);
      }
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
      console.log("currency", currency);
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
  &__currency-info {
    padding: 24px;
    background-color: #fff;
  }
}
@media screen and (max-width: 992px) {
  .v-currency-widget {
    width: 610px;
  }
}
@media screen and (max-width: 768px) {
  .v-currency-widget {
    width: 320px;
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
