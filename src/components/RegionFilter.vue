<script>
import { mapState, mapActions } from "vuex";
import { houseApi } from "../api/house";

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
      fetchGugunList: "region/fetchGugunList",
      fetchDongList: "region/fetchDongList",
    }),
    async selectSido(sido) {
      try {
        this.selectedSido = sido;
        this.selectedGugun = null;
        this.selectedDong = null;
        
        await this.fetchGugunList(sido.siName);

        const response = await houseApi.searchByToggleWithSi(sido.dongCode);
          
        const mapRef = this.$parent.$refs.map;
        if (mapRef) {
          mapRef.setMapOptions(9, sido.latitude, sido.longitude);
          mapRef.showMarkers(response.data, 'si');
        }
      } catch (error) {
        console.error('시도 선택 중 오류 발생:', error);
      }
    },
    async selectGugun(gugun) {
      try {
        this.selectedGugun = gugun;
        this.selectedDong = null;
        
        await this.fetchDongList({
          si: this.selectedSido.siName,
          gu: gugun.guName,
        });

        const response = await houseApi.searchByToggleWithGu(gugun.dongCode);
          
        const mapRef = this.$parent.$refs.map;
        if (mapRef) {
          mapRef.setMapOptions(6, gugun.latitude, gugun.longitude);
          mapRef.showMarkers(response.data, 'gu');
        }
      } catch (error) {
        console.error('구/군 선택 중 오류:', error);
      }
    },
    async selectDong(dong) {
      this.selectedDong = dong;
      this.$store.commit("region/setDongList", []);
      this.$emit("select-region", {
        sido: this.selectedSido.siName,
        gugun: this.selectedGugun.guName,
        dong: dong.dongName
      });

        const response = await houseApi.searchByToggleWithDong(dong.dongCode);
          
        const mapRef = this.$parent.$refs.map;
        if (mapRef) {
          mapRef.setMapOptions(6, dong.latitude, dong.longitude);
          mapRef.showMarkers(response.data, 'dong');
        }
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
        this.selectGugun(this.selectedGugun);
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
        if (newVal && (!this.sidoList || !this.sidoList.length)) {
          this.fetchSidoList();
        }
      },
    },
  },
};
</script>

<template>
  <div class="filter-panel" v-if="show">
    <!-- 상단 네비게이션 -->
    <div class="region-navigation">
      <span class="nav-item" @click="backToSido">
        {{ selectedSido ? selectedSido.siName : "지역을 선택해주세요" }}
      </span>
      <span v-if="selectedGugun">
        >
        <span class="nav-item" @click="backToGugun">
          {{ selectedGugun.guName }}
        </span>
      </span>
      <span v-if="selectedDong">
        >
        <span class="nav-item" @click="backToDong">
          {{ selectedDong.dongName }}
        </span>
      </span>
    </div>

    <!-- 시/도 선택 -->
    <div v-if="!selectedSido" class="region-grid">
      <div
        v-for="sido in sidoList"
        :key="sido.dongCode"
        class="region-item"
        @click="selectSido(sido)"
      >
        {{ sido.siName }}
      </div>
    </div>

    <!-- 구/군 선택 -->
    <div v-else-if="!selectedGugun" class="region-grid">
      <div
        v-for="gugun in gugunList"
        :key="gugun.dongCode"
        class="region-item"
        @click="selectGugun(gugun)"
      >
        {{ gugun.guName }}
      </div>
    </div>

    <!-- 동 선택 -->
    <div v-else class="region-grid">
      <div
        v-for="dong in dongList"
        :key="dong.dongCode"
        class="region-item"
        @click="selectDong(dong)"
      >
        {{ dong.dongName }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-panel {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-top: 10px;
}

.region-navigation {
  padding: 10px 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.nav-item {
  color: #0a362f;
  cursor: pointer;
  font-weight: 500;
}

.nav-item:hover {
  color: #1a5f54;
}

.region-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 10px 0;
}

.region-item {
  padding: 12px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #eee;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.region-item:hover {
  background-color: #f5f5f5;
  border-color: #ddd;
}
</style>