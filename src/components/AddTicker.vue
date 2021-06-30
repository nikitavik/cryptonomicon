<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
        >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
              v-model="ticker"
              @keydown.enter="add"
              @input="valid = true; predictCoin();"
              @click="valid = true"
              type="text"
              name="wallet"
              id="wallet"
              class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
              placeholder="Например DOGE"
          />
        </div>
        <div v-if="prediction.length > 0 && ticker.trim().length > 0"
             class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
            <span
                @click="predictionClickHandler(predictedCoin.Symbol)"
                v-for="predictedCoin in prediction"
                :key="predictedCoin.id"
                class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
                {{ predictedCoin.Symbol }}
            </span>
        </div>

        <div
            v-if="!valid"
            class="text-sm text-red-600">
            Такой тикер уже добавлен
        </div>
      </div>
    </div>
    <add-button @click="add"
                type="button"
                class="my-4"
    />
  </section>
</template>

<script>
import AddButton from "./AddButton"
import {fetchCoinList} from "@/api";

export default {
 name: "AddTicker",
  components: {
   AddButton
  },
  data(){
   return {
      ticker: "",
      prediction: [],
      valid: true,
      coins: {},
      loaded: false,
   }
  },
  created() {
   this.fetchCoinList()
  },
  methods: {
    add() {
      this.$emit("add-ticker", this.ticker)
      this.ticker = ""
    },
    // Prediction System
    predictCoin(){
      const target = this.ticker
      const predict = []
      for (let coin in this.coins) {
        if (
            this.coins[coin]?.FullName.toLowerCase().includes(target.toLowerCase())
            ||
            this[coin]?.Symbol.toUpperCase().includes(target.toUpperCase()))
        {
          predict.push(this.coins[coin])
        }
      }
      this.prediction = predict.reverse().slice(0, 5)
    },
    // Prediction click
    predictionClickHandler(coin) {
      this.ticker = coin
      this.add()
    },

    // Prediction Data
    async fetchCoinList() {
      fetchCoinList()
          .then((data)=> {
            this.loaded = true
            this.$emit("load-page", this.loaded)
            this.coins = data;
          })
    },
  }
}
</script>

<style scoped>

</style>
