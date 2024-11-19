<template>
  <div class="home">
    <TheMap ref="map" />

    <div id="search-box" class="search-container">
      <SearchBar @toggle-filter="toggleFilter" />
      <RegionFilter :show="showFilter" ref="regionFilter" />

      <div class="nav-section">
        <NavigationBar @nav-change="handleNavChange" />
      </div>

      <div class="results-section">
        <HouseList
          v-if="!showFilter"
          :houses="houses"
          :showBuyTable="showBuyTable"
          :showRentTable="showRentTable"
          @view-house="viewHouseOnMap"
        />
      </div>
    </div>

    <transition name="slide">
      <NewsView v-if="currentNav === 'news'" @close="closeNav" />
    </transition>
    <transition name="slide">
      <PolicyView v-if="currentNav === 'policy'" @close="closeNav" />
    </transition>
    <transition name="slide">
      <LoanView v-if="currentNav === 'loan'" @close="closeNav" />
    </transition>
    <transition name="slide">
      <AnalysisView v-if="currentNav === 'analysis'" @close="closeNav" />
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import TheMap from "@/components/TheMap.vue";
import HouseList from "@/components/HouseList.vue";
import SearchBar from "@/components/SearchBar.vue";
import RegionFilter from "@/components/RegionFilter.vue";
import NavigationBar from "@/components/navbar/NavigationBar.vue";
import NewsView from "@/components/navbar/NewsView.vue";
import PolicyView from "@/components/navbar/PolicyView.vue";
import LoanView from "@/components/navbar/LoanView.vue";
import AnalysisView from "@/components/navbar/AnalysisView.vue";

export default {
  name: "HomeView",
  components: {
    TheMap,
    HouseList,
    SearchBar,
    RegionFilter,
    NavigationBar,
    NewsView,
    PolicyView,
    LoanView,
    AnalysisView,
  },
  data() {
    return {
      showFilter: false,
      currentNav: null,
      showBuyTable: true,
      showRentTable: false,
    };
  },
  computed: {
    ...mapState({
      houses: (state) => state.house.houses,
    }),
  },
  methods: {
    toggleFilter() {
      if (this.showFilter && this.$refs.regionFilter) {
        this.$refs.regionFilter.resetSelection();
      }
      this.showFilter = !this.showFilter;
    },
    viewHouseOnMap(house) {
      // TheMap 컴포넌트의 showMarker 메서드 호출
      this.$refs.map.showMarker({
        lat: house.lat,
        lng: house.lng,
        title: house.title,
      });
    },
    handleNavChange(navItem) {
      this.currentNav = navItem;
    },
    closeNav() {
      this.currentNav = null;
    },
  },
};
</script>

<style scoped>
.home {
  position: relative;
  width: 100%;
  height: 100vh;
}

.search-container {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 400px;
  max-height: calc(100vh - 40px);
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1000;
}

.nav-section {
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.results-section {
  max-height: calc(100vh - 200px); /* 적절한 높이 조정 */
  overflow-y: auto;
}

/* 트랜지션 스타일 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
