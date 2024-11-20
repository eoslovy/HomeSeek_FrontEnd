<template>
  <div class="filter-panel" v-if="show">
    <!-- 상단 네비게이션 -->
    <div class="region-navigation">
      <span class="nav-item" @click="backToSido">
        {{ selectedSido ? selectedSido.name : "지역을 선택해주세요" }}
      </span>
      <span v-if="selectedGugun">
        >
        <span class="nav-item" @click="backToGugun">
          {{ selectedGugun.name }}
        </span>
      </span>
      <span v-if="selectedDong">
        >
        <span class="nav-item" @click="backToDong">
          {{ selectedDong.name }}
        </span>
      </span>
    </div>

    <!-- 시/도 선택 -->
    <div v-if="!selectedSido" class="region-grid">
      <div
        v-for="sido in sidoList"
        :key="sido.code"
        class="region-item"
        @click="selectSido(sido)"
      >
        {{ sido.name }}
      </div>
    </div>

    <!-- 구/군 선택 -->
    <div v-else-if="!selectedGugun" class="region-grid">
      <div
        v-for="gugun in gugunList"
        :key="gugun.code"
        class="region-item"
        @click="selectGugun(gugun)"
      >
        {{ gugun.name }}
      </div>
    </div>

    <!-- 동 선택 -->
    <div v-else class="region-grid">
      <div
        v-for="dong in dongList"
        :key="dong.code"
        class="region-item"
        @click="selectDong(dong)"
      >
        {{ dong.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { fetchDongNames, fetchGuNames } from "../api/region";

export default {
  name: "RegionFilter",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedSido: null,
      selectedGugun: null,
      selectedDong: null,
      showDongList: false,
    };
  },
  computed: {
    ...mapState({
      sidoList: (state) => state.region.sidoList,
      gugunList: (state) => state.region.gugunList,
      dongList: (state) => state.region.dongList,
    }),
  },
  methods: {
    ...mapActions({
      fetchSidoList: "region/fetchSidoList",
    }),
    async selectSido(sido) {
      this.selectedSido = sido;
      try {
        const response = await fetchGuNames(sido.name);
        const formattedGuList = response.data.map((gu) => ({
          code: gu.guCode,
          name: gu.guName,
        }));
        this.$store.commit("region/setGugunList", formattedGuList);
      } catch (error) {
        console.error("구/군 목록 조회 중 오류 발생:", error);
      }
    },
    async selectGugun(gugun) {
      this.selectedGugun = gugun;
      try {
        const response = await fetchDongNames(
          this.selectedSido.name,
          gugun.name
        );
        const formattedDongList = response.data.map((dong) => ({
          code: dong.dongCode,
          name: dong.dongName,
        }));
        this.$store.commit("region/setDongList", formattedDongList);
      } catch (error) {
        console.error("동 목록 조회 중 오류 발생:", error);
      }
    },
    selectDong(dong) {
      this.selectedDong = dong;
      this.$store.commit("region/setDongList", []); // 동 목록 초기화
    },
    backToSido() {
      this.selectedSido = null;
      this.selectedGugun = null;
      this.selectedDong = null;
      this.showDongList = false;
    },
    backToGugun() {
      this.selectedGugun = null;
      this.selectedDong = null;
      this.showDongList = false;
    },
    backToDong() {
      this.selectedDong = null;
      if (this.selectedGugun) {
        this.selectGugun(this.selectedGugun); // 현재 선택된 구/군의 동 목록을 다시 불러옴
      }
    },
    resetSelection() {
      this.selectedSido = null;
      this.selectedGugun = null;
      this.selectedDong = null;
      this.showDongList = false;
    },
  },
  watch: {
    show: {
      immediate: true,
      handler(newVal) {
        if (newVal && this.sidoList && !this.sidoList.length) {
          this.fetchSidoList();
        }
      },
    },
  },
};
</script>

<style scoped>
.filter-panel {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.region-navigation {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
  color: #2c3e50;
  font-weight: bold;
}

.region-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.region-item {
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.region-item:hover {
  background-color: #f8f9fa;
  border-color: #2c3e50;
}

.nav-item {
  cursor: pointer;
  color: #2c3e50;
}

.nav-item:hover {
  color: #42b983;
  text-decoration: underline;
}
</style>
