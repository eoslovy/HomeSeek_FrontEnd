<template>
  <div class="home">
    <TheMap ref="map" @select-house="fetchHouseDeals" />

    <div id="search-box" class="search-container">
      <SearchBar 
        @toggle-filter="toggleFilter" 
        @search-keyword-change="handleSearchKeywordChange"
      />
      <RegionFilter :show="showFilter" ref="regionFilter" />

      <div class="nav-section">
        <NavigationBar @nav-change="handleNavChange" />
      </div>

      <div class="results-section">
        <HouseList
          v-if="!showFilter && houses.length > 0"
          :houses="houses"
          :showBuyTable="showBuyTable"
          :showRentTable="showRentTable"
          :searchKeyword="currentSearchKeyword"
          @view-house="viewHouseOnMap"
          @select-house="fetchHouseDeals"
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
      <FavoriteListView 
        v-if="currentNav === 'favoritelist'" 
        @close="closeNav"
        @view-house="handleViewHouse"
        @select-house="fetchHouseDeals"
      />
    </transition>

  <!-- 오른쪽 모달 -->
  <transition name="slide-right">
    <div v-if="showRightModal" class="right-modal">
      <div class="modal-header">
        <span class="back-icon" @click="closeRightModal">←</span>
        <span class="header-title">{{ selectedHouse.aptName }} 거래정보</span>
        <div class="header-buttons">
          <button 
            class="favorite-button" 
            :class="{ 'active': isFavorite }"
            @click="toggleFavorite"
          >
            <i class="bi" :class="isFavorite ? 'bi-star-fill' : 'bi-star'"></i>
          </button>
          <button class="listing-button" @click="fetchAndShowListings">
            매물보기
          </button>
        </div>
      </div>
      <div class="modal-content">
        <div class="area-filter">
          <select v-model="selectedArea" @change="filterByArea" class="area-select">
            <option value="all">전체 면적</option>
            <option v-for="area in uniqueAreas" :key="area" :value="area">
              {{ area }}㎡
            </option>
          </select>
        </div>

        <div class="chart-container">
          <Line
            v-if="chartData.datasets"
            :data="chartData"
            :options="chartOptions"
          />
        </div>
        <div class="price-history">
          <div class="history-header">
            <span>거래일</span>
            <span>면적</span>
            <span>격</span>
          </div>
          <div v-for="deal in filteredDeals" :key="deal.id" class="history-item">
            <span>{{ formatDate(deal.dealYear, deal.dealMonth, deal.dealDay) }}</span>
            <span>{{ deal.excluUseAr }}㎡</span>
            <span>{{ formatPrice(deal.dealAmount) }}만원</span>
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
        <span class="header-title">{{ selectedHouse.aptName }} 매물</span>
        <button class="ai-button" @click="getAIAdvice">
          AI 추천
        </button>
      </div>
      <div class="modal-content">
        <div class="area-filter">
          <select v-model="selectedListingArea" class="area-select">
            <option value="all">전체 면적</option>
            <option v-for="area in uniqueListingAreas" :key="area" :value="area">
              {{ area }}㎡
            </option>
          </select>
        </div>
        <div class="listing-list">
          <div v-for="item in filteredListings" :key="item.id" class="listing-item">
            <div class="listing-info">
              <div class="listing-price">{{ formatPrice(item.price) }}만원</div>
              <div class="listing-detail">매매 | {{ item.excluUseAr }}㎡</div>
              <div class="listing-location">{{ item.description }}</div>
            </div>
            <div class="listing-contact">
              <div class="agent">{{ item.agentNm }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- AI 추천 모달 -->
  <transition name="fade">
    <div v-if="showAIModal" class="ai-modal">
      <div class="modal-header">
        <span class="back-icon" @click="closeAIModal">←</span>
        <span class="header-title">AI 매물 분석</span>
      </div>
      <div class="modal-content">
        <div v-if="isLoading" class="loading">
          분석 중...
        </div>
        <div v-else class="ai-content">
          {{ aiAdvice }}
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
import FavoriteListView from "@/components/navbar/FavoriteListView.vue";
import axios from 'axios';
import Swal from 'sweetalert2';

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
    FavoriteListView,
    Line
  },
  data() {
    return {
      showFilter: false,
      showBuyTable: true,
      showRentTable: false,
      currentNav: '',
      currentSearchKeyword: '',
      showListingModal: false,
      dealList: [],
      selectedHouse: {},
      showRightModal: false,
      chartData: {
        labels: [],
        datasets: []
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          },
          title: {
            display: true,
            text: '거래가격 추이'
          }
        }
      },
      selectedArea: 'all',
      listingData: [],
      selectedListingArea: 'all',
      showAIModal: false,
      isLoading: false,
      aiAdvice: '',
      isFavorite: false
    };
  },
  computed: {
    ...mapState({
      houses: (state) => state.house.houses,
      currentUser: (state) => state.auth.user,
      isLoggedIn: (state) => state.auth.isLoggedIn
    }),
    uniqueAreas() {
      return [...new Set(this.dealList.map(deal => deal.excluUseAr))].sort((a, b) => a - b);
    },
    filteredDeals() {
      if (this.selectedArea === 'all') {
        return this.dealList;
      }
      return this.dealList.filter(deal => deal.excluUseAr === this.selectedArea);
    },
    uniqueListingAreas() {
      return [...new Set(this.listingData.map(item => item.excluUseAr))].sort((a, b) => a - b);
    },
    filteredListings() {
      if (this.selectedListingArea === 'all') {
        return this.listingData;
      }
      return this.listingData.filter(item => item.excluUseAr === this.selectedListingArea);
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
      if (!keyword) {
        this.$store.commit('house/setHouses', []);
      }
    },
    toggleRightModal() {
      this.showRightModal = !this.showRightModal;
    },
    closeRightModal() {
      this.showRightModal = false;
    },
    formatPrice(price) {
      if (!price) return '';
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    updateChartData() {
      const dealsToShow = this.selectedArea === 'all' 
        ? this.dealList 
        : this.dealList.filter(deal => deal.excluUseAr === this.selectedArea);

      const sortedDeals = [...dealsToShow].sort((a, b) => {
        const dateA = new Date(a.dealYear, a.dealMonth - 1, a.dealDay);
        const dateB = new Date(b.dealYear, b.dealMonth - 1, b.dealDay);
        return dateA - dateB;
      });

      this.chartData = {
        labels: sortedDeals.map(deal => 
          `${deal.dealYear}.${String(deal.dealMonth).padStart(2, '0')}`
        ),
        datasets: [{
          label: '거래가격',
          data: sortedDeals.map(deal => deal.dealAmount),
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
    },
    async fetchHouseDeals(houseInfo) {
      try {
        const response = await axios.post('/deals/search', {
          aptName: houseInfo.aptName,
          si: houseInfo.si,
          gu: houseInfo.gu
        });
        this.dealList = response.data;
        this.selectedHouse = houseInfo;
        this.showRightModal = true;
        this.selectedArea = 'all';
        this.updateChartData();
        await this.checkFavoriteStatus();
      } catch (error) {
        console.error('거래 정보 조회 실패:', error);
      }
    },
    formatDate(year, month, day) {
      return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
    },
    filterByArea() {
      this.updateChartData();
    },
    async fetchAndShowListings() {
      try {
        const response = await axios.post('/sales/search', {
          aptName: this.selectedHouse.aptName,
          si: this.selectedHouse.si,
          gu: this.selectedHouse.gu
        });
        this.listingData = response.data;
        this.showListingModal = true;
      } catch (error) {
        console.error('매물 정보 조 실패:', error);
      }
    },
    async getAIAdvice() {
      Swal.fire({
        title: 'AI 분석 중...',
        html: '심리지수, 실거래가 추이, 매물을 활용하여<br>종합적으로 분석하고 있습니다.',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          const spinner = document.querySelector('.swal2-loading');
          if (spinner) {
            spinner.firstChild.classList.add('custom-loading-spinner');
          }
        }
      });
      
      const requestData = {
        aptName: this.selectedHouse.aptName,
        si: this.selectedHouse.si,
        gu: this.selectedHouse.gu
      };

      try {
        const response = await axios.post('/openai/advice', requestData);
        
        Swal.close();
        this.aiAdvice = response.data;
        this.showAIModal = true;

      } catch (error) {
        console.error('AI 추천 조회 실패:', error.response || error);
        
        Swal.fire({
          icon: 'error',
          title: 'AI 분석 실패',
          text: '죄송합니다. 현재 AI 분석을 제공할 수 없습니다.',
          confirmButtonText: '확인',
          confirmButtonColor: '#dc3545'
        });
      }
    },
    closeAIModal() {
      this.showAIModal = false;
    },
    async toggleFavorite() {
      if (!this.isLoggedIn) {
        Swal.fire({
          icon: 'warning',
          title: '로그인이 필요합니다',
          text: '관심 목록 기능은 로그인 후 이용 가능합니다.',
          confirmButtonText: '확인',
          confirmButtonColor: '#0a362f'
        });
        return;
      }

      try {
        if (this.isFavorite) {
          await axios.delete('/users/deleteFavorite', {
            data: {
              userId: this.currentUser.id,
              aptSeq: this.selectedHouse.aptSeq
            }
          });
        } else {
          await axios.post('/users/setFavorite', {
            userId: this.currentUser.id,
            aptSeq: this.selectedHouse.aptSeq
          });
        }

        this.isFavorite = !this.isFavorite;
        
        Swal.fire({
          icon: 'success',
          title: this.isFavorite ? '관심 목록에 추가되었습니다' : '관심 목록에서 제거되었습니다',
          showConfirmButton: false,
          timer: 1500,
          position: 'top-end',
          toast: true
        });
      } catch (error) {
        console.error('관심 목록 처리 실패:', error);
        Swal.fire({
          icon: 'error',
          title: '처리 실패', 
          text: '관심 목록 처리 중 오류가 발생했습니다.',
          confirmButtonText: '확인',
          confirmButtonColor: '#dc3545'
        });
      }
    },

    async checkFavoriteStatus() {
      if (!this.isLoggedIn) return;
      
      try {
        const response = await axios.get(`/users/getFavorite`, {
          params: {
            userId: this.currentUser.id,
            aptSeq: this.selectedHouse.aptSeq
          }
        });

        if(response.data.check){
          this.isFavorite = true;
        }else{
          this.isFavorite = false;
        }
      } catch (error) {
        console.error('관심 목록 상태 확인 실패:', error);
      }
    },
    handleViewHouse(house) {
      this.selectedHouse = house;
      this.showRightModal = true;
      this.$refs.map.showMarker(house);
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
  position: relative;
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

.area-filter {
  margin-bottom: 20px;
}

.area-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  background-color: white;
}

.area-select:focus {
  outline: none;
  border-color: #0a362f;
}

.ai-button {
  margin-left: auto;
  padding: 6px 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}

.ai-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  max-height: 80vh;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1002;
  overflow-y: auto;
}

.ai-content {
  padding: 20px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.loading {
  padding: 40px;
  text-align: center;
  font-size: 16px;
  color: #666;
}

/* 로딩 스피너 커스텀 스타일 */
.custom-loading-spinner {
  width: 180px !important;
  height: 180px !important;
  border: 4px solid transparent !important;
  border-top: 4px solid #4a90e2 !important;
  border-right: 4px solid #4a90e2 !important;
  border-radius: 50% !important;
  animation: halfSpin 1s ease-in-out infinite !important;
  margin: 30px auto !important;
}

@keyframes halfSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* SweetAlert2 커스텀 스타일 */
.swal2-popup {
  font-size: 1.1em !important;
  padding: 3em !important;
  width: 32em !important;
  max-width: 90vw !important;
}

.swal2-title {
  color: #333 !important;
  font-size: 2em !important;
  margin-bottom: 1em !important;
}

.swal2-html-container {
  font-size: 1.3em !important;
  color: #666 !important;
  line-height: 1.8 !important;
  margin-top: 1em !important;
  padding: 0 1em !important;
}

/* 로딩 컨테이너의 배경색 제거 */
.swal2-loading {
  background: transparent !important;
}

/* 로딩 컨테이너 크기 조정 */
.swal2-loader {
  width: 180px !important;
  height: 180px !important;
}

.header-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.favorite-button {
  background: none;
  border: none;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 18px;
  color: #666;
  transition: color 0.3s ease;
}

.favorite-button.active {
  color: #ffd700;
}

.favorite-button:hover {
  color: #ffd700;
}
</style>
