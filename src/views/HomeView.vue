<template>
  <div class="home">
    <TheMap ref="map" />

    <div id="search-box" class="search-container">
      <SearchBar 
        @toggle-filter="toggleFilter" 
        @search-keyword-change="handleSearchKeywordChange"
      />
      <RegionFilter :show="showFilter" ref="regionFilter" />

      <div class="nav-section">
        <NavigationBar @nav-change="handleNavChange" />
      </div>
      <button class="test-button" @click="toggleRightModal">
        상세 정보 보기
      </button>

      <div class="results-section">
        <HouseList
          v-if="!showFilter"
          :houses="houses"
          :showBuyTable="showBuyTable"
          :showRentTable="showRentTable"
          :searchKeyword="currentSearchKeyword"
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

  <!-- 오른쪽 모달 -->
  <transition name="slide-right">
    <div v-if="showRightModal" class="right-modal">
      <div class="modal-header">
        <span class="back-icon" @click="closeRightModal">←</span>
        <span class="header-title">현대아파트 시세정보</span>
        <button class="listing-button" @click="toggleListingModal">매물보기</button>
      </div>
      <div class="modal-content">
        <div class="price-info">
          <div class="current-price">
            <div class="label">최근 실거래 기준 1개월 평균</div>
            <div class="price">30억</div>
          </div>
          <div class="compare-price">
            <div class="label">매물 가격 평균</div>
            <div class="price">32억</div>
          </div>
        </div>
        <div class="chart-container">
          <Line :data="chartData" :options="chartOptions" />
        </div>
        <div class="price-history">
          <div class="history-header">
            <span>거래일</span>
            <span>타입</span>
            <span>가격</span>
          </div>
          <div v-for="(item, index) in priceHistory" :key="index" class="history-item">
            <span>{{ item.date }}</span>
            <span>{{ item.type }}</span>
            <span>{{ item.price }}억</span>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- 매물 모달 -->
  <transition name="fade">
    <div v-if="showListingModal" class="listing-modal">
      <div class="modal-header">
        <span class="back-icon" @click="closeListingModal">←</span>
        <span class="header-title">현대아파트 매물</span>
      </div>
      <div class="modal-content">
        <div class="listing-list">
          <!-- 테스트용 더미 데이터 -->
          <div v-for="(item, index) in listingData" :key="index" class="listing-item">
            <div class="listing-info">
              <div class="listing-price">{{ item.price }}억</div>
              <div class="listing-detail">{{ item.type }} | {{ item.area }}㎡</div>
              <div class="listing-location">{{ item.floor }}층</div>
            </div>
            <div class="listing-contact">
              <div class="agent">{{ item.agent }}</div>
              <div class="phone">{{ item.phone }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Line } from 'vue-chartjs';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import TheMap from "@/components/TheMap.vue";
import HouseList from "@/components/HouseList.vue";
import SearchBar from "@/components/SearchBar.vue";
import RegionFilter from "@/components/RegionFilter.vue";
import NavigationBar from "@/components/navbar/NavigationBar.vue";
import NewsView from "@/components/navbar/NewsView.vue";
import PolicyView from "@/components/navbar/PolicyView.vue";
import LoanView from "@/components/navbar/LoanView.vue";
import AnalysisView from "@/components/navbar/AnalysisView.vue";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
    Line
  },
  data() {
    return {
      showFilter: false,
      currentNav: null,
      showBuyTable: true,
      showRentTable: false,
      currentSearchKeyword: "",
      showRightModal: false,
      priceHistory: [
        { date: '2024.01.15', type: '매매', price: 30 },
        { date: '2023.11.20', type: '매매', price: 25 },
        { date: '2023.09.05', type: '매매', price: 25 },
        { date: '2023.06.10', type: '매매', price: 20 },
      ],
      chartData: {
        labels: ['2023.06', '2023.09', '2023.11', '2024.01'],
        datasets: [{
          label: '매매가',
          data: [20, 25, 25, 30],
          borderColor: '#0a362f',
          tension: 0.1
        }]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: function(value) {
                return value + '억';
              }
            }
          }
        }
      },
      // ... 기존 data ...
      showListingModal: false,
      listingData: [
        {
          price: 32,
          type: '매매',
          area: 84,
          floor: '13',
          agent: '우리공인중개사',
          phone: '010-1234-5678'
        },
        {
          price: 31.5,
          type: '매매',
          area: 84,
          floor: '8',
          agent: '한국공인중개사',
          phone: '010-2345-6789'
        },
        // 더 많은 더미 데이터 추가 가능
      ]
    };
  },
  computed: {
    ...mapState({
      houses: (state) => state.house.houses,
    }),
    averagePrice() {
      const prices = this.priceHistory.map(item => item.price);
      const sum = prices.reduce((a, b) => a + b, 0);
      return (sum / prices.length).toFixed(1);
    },
    latestPrice() {
      return this.priceHistory[0].price;
    }
  },
  methods: {
    toggleFilter() {
      if (this.showFilter && this.$refs.regionFilter) {
        this.$refs.regionFilter.resetSelection();
      }
      this.showFilter = !this.showFilter;
    },
    viewHouseOnMap(house) {
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
    handleSearchKeywordChange(keyword) {
      this.currentSearchKeyword = keyword;
    },
    toggleRightModal() {
      this.showRightModal = !this.showRightModal;
    },
    closeRightModal() {
      this.showRightModal = false;
    },
    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    updateChartData() {
      this.chartData = {
        labels: this.priceHistory.map(item => item.date),
        datasets: [{
          label: '매매가',
          data: this.priceHistory.map(item => item.price),
          borderColor: '#0a362f',
          tension: 0.1
        }]
      };
    },
    toggleListingModal() {
      this.showListingModal = !this.showListingModal;
    },
    closeListingModal() {
      this.showListingModal = false;
    }
  }
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

/* 기존 스타일 유지하고 아래 스타일 추가 */

.right-modal {
  position: absolute;
  top: 70px;
  right: 20px;
  width: 400px;
  height: calc(100vh - 90px);
  background: white;
  border-radius: 8px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
}

.modal-header {
  background: #0a362f;
  color: white;
  padding: 15px;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-content {
  padding: 20px;
}

/* 오른쪽 슬라이드 트랜지션 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.test-button {
  margin: 10px 20px;
  padding: 8px 16px;
  background-color: #0a362f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.test-button:hover {
  background-color: #0d4339;
}

.price-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

.current-price, .compare-price {
  text-align: center;
}

.label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #0a362f;
}

.chart-container {
  height: 300px;
  margin: 20px 0;
}

.price-history {
  margin-top: 20px;
}

.history-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 10px;
  background: #f5f5f5;
  font-weight: bold;
}

.history-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.history-item span {
  text-align: center;
}

/* 매물 모달 스타일 */
.listing-button {
  margin-left: auto;
  padding: 6px 12px;
  background-color: white;
  color: #0a362f;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}

.listing-modal {
  position: absolute;
  top: 70px;
  right: 20px;
  width: 400px;
  height: calc(100vh - 90px);
  background: white;
  border-radius: 8px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1001; /* 기존 모달보다 위에 표시 */
  overflow-y: auto;
}

.listing-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.listing-price {
  font-size: 18px;
  font-weight: bold;
  color: #0a362f;
  margin-bottom: 5px;
}

.listing-detail {
  font-size: 14px;
  color: #666;
  margin-bottom: 3px;
}

.listing-location {
  font-size: 14px;
  color: #666;
}

.listing-contact {
  text-align: right;
}

.agent {
  font-size: 14px;
  color: #333;
  margin-bottom: 3px;
}

.phone {
  font-size: 14px;
  color: #0a362f;
  font-weight: 600;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
