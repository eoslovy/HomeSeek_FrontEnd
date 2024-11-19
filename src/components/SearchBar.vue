<template>
  <div class="search-input-container">
    <input
      type="text"
      class="search-input"
      placeholder="아파트, 지역, 지하철역으로 검색"
      v-model="searchKeyword"
      @keyup.enter="searchHouses"
    />
    <button class="search-button" @click="searchHouses">
      <i class="bi bi-search"></i>
    </button>
    <button class="filter-button" @click="toggleFilter">
      <i class="bi bi-sliders"></i>
    </button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SearchBar",
  data() {
    return {
      searchKeyword: "",
    };
  },
  methods: {
    toggleFilter() {
      this.$emit("toggle-filter");
    },
    async searchHouses() {
      if (!this.searchKeyword.trim()) return;

      try {
        const response = await axios.get(
          `http://localhost:8080/map/getEstateByName`,
          {
            params: {
              keyword: this.searchKeyword,
            },
          }
        );

        this.$store.commit("house/setHouses", response.data);
      } catch (error) {
        console.error("검색 중 오류 발생:", error);
      }
    },
  },
};
</script>
