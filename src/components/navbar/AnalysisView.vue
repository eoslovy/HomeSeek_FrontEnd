<template>
  <transition name="fade">
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="header-left">
            <i class="bi bi-arrow-left" @click="$emit('close')"></i>
            <h3>지역 비교 분석</h3>
          </div>
        </div>
        <div class="modal-body">
          <div class="map-container">
            <div class="map-section">
              <div class="map-header">
                <h3>강남구</h3>
              </div>
              <div class="map-content">
                <div id="map1" ref="map1" class="map"></div>
                <transition name="slide">
                  <div v-if="showLeftModal" class="side-modal left-modal">
                    <div class="modal-header">
                      <span class="header-title">{{ leftApt.aptName }} 거래정보</span>
                    </div>
                    <div class="modal-content">
                      <div class="chart-container">
                        <Line v-if="leftChartData.datasets" :data="leftChartData" :options="chartOptions" />
                      </div>
                      <div class="price-history">
                        <div class="history-header">
                          <span>거래일</span>
                          <span>면적</span>
                          <span>가격</span>
                        </div>
                        <div v-for="deal in leftDeals" :key="deal.id" class="history-item">
                          <span>{{ formatDate(deal.dealYear, deal.dealMonth, deal.dealDay) }}</span>
                          <span>{{ deal.excluUseAr }}㎡</span>
                          <span>{{ formatPrice(deal.dealAmount) }}만원</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
            <div class="map-section">
              <div class="map-header">
                <h3>송파구</h3>
              </div>
              <div class="map-content">
                <div id="map2" ref="map2" class="map"></div>
                <transition name="slide">
                  <div v-if="showRightModal" class="side-modal right-modal">
                    <div class="modal-header">
                      <span class="header-title">{{ rightApt.aptName }} 거래정보</span>
                    </div>
                    <div class="modal-content">
                      <div class="chart-container">
                        <Line v-if="rightChartData.datasets" :data="rightChartData" :options="chartOptions" />
                      </div>
                      <div class="price-history">
                        <div class="history-header">
                          <span>거래일</span>
                          <span>면적</span>
                          <span>가격</span>
                        </div>
                        <div v-for="deal in rightDeals" :key="deal.id" class="history-item">
                          <span>{{ formatDate(deal.dealYear, deal.dealMonth, deal.dealDay) }}</span>
                          <span>{{ deal.excluUseAr }}㎡</span>
                          <span>{{ formatPrice(deal.dealAmount) }}만원</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { Line } from 'vue-chartjs';

export default {
  name: "AnalysisView",
  components: {
    Line
  },
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      map1: null,
      map2: null,
      showLeftModal: false,
      showRightModal: false,
      leftApt: {},
      rightApt: {},
      leftDeals: [],
      rightDeals: [],
      leftChartData: {},
      rightChartData: {},
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  methods: {
    showApartment(mapNum, apt) {
      const map = mapNum === 1 ? this.map1 : this.map2;
      const position = new kakao.maps.LatLng(apt.lat, apt.lng);
      
      const marker = new kakao.maps.Marker({
        position: position,
        map: map,
        image: new kakao.maps.MarkerImage('/images/home.svg', new kakao.maps.Size(36, 36))
      });

      if (mapNum === 1) {
        this.leftApt = apt;
        this.showLeftModal = true;
        // 거래 데이터 가져오기
        this.fetchDeals(apt.id, 'left');
      } else {
        this.rightApt = apt;
        this.showRightModal = true;
        this.fetchDeals(apt.id, 'right');
      }

      map.setCenter(position);
      map.setLevel(3);
    },

    async fetchDeals(aptId, side) {
      try {
        const response = await axios.get(`/api/deals/${aptId}`);
        if (side === 'left') {
          this.leftDeals = response.data;
          this.updateChartData(response.data, 'left');
        } else {
          this.rightDeals = response.data;
          this.updateChartData(response.data, 'right');
        }
      } catch (error) {
        console.error('거래 데이터 조회 실패:', error);
      }
    },

    updateChartData(deals, side) {
      const chartData = {
        labels: deals.map(deal => `${deal.dealYear}.${deal.dealMonth}`),
        datasets: [{
          label: '거래가격',
          data: deals.map(deal => deal.dealAmount),
          borderColor: '#0a362f',
          tension: 0.1
        }]
      };
      
      if (side === 'left') {
        this.leftChartData = chartData;
      } else {
        this.rightChartData = chartData;
      }
    },

    formatDate(year, month, day) {
      return `${year}.${month}.${day}`;
    },

    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 70px;
  z-index: 9999;
}

.modal-content {
  background: rgba(33, 37, 41, 0.95);
  width: 98vw;
  height: 90vh;
  margin: 0;
  border-radius: 8px;
  border: 1px solid #D4AF37;
  z-index: 10000;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #D4AF37;
  background: #0a362f;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-left i {
  color: #D4AF37;
  cursor: pointer;
  font-size: 1.2rem;
}

.header-left h3 {
  color: #D4AF37;
  margin: 0;
  font-size: 1.2rem;
}

.modal-body {
  flex: 1;
  overflow: hidden;
  padding: 15px;
}

.map-container {
  display: flex;
  gap: 15px;
  height: 100%;
}

.map-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map-header {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
}

.map-header h3 {
  margin: 0;
  margin-bottom: 10px;
  font-size: 18px;
  color: #333;
}

.stats {
  display: flex;
  gap: 15px;
}

.stat-item {
  font-size: 14px;
  color: #666;
}

.map {
  flex: 1;
  width: 100%;
  height: 100%;
  border-radius: 0 0 8px 8px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.map-content {
  position: relative;
  flex: 1;
  display: flex;
}

.side-modal {
  position: absolute;
  top: 0;
  width: 300px;
  height: 100%;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1;
}

.left-modal {
  left: 0;
  border-right: 1px solid #eee;
}

.right-modal {
  left: 0;
  border-right: 1px solid #eee;
}

.modal-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  background: #fff;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #0a362f;
}

.chart-container {
  height: 200px;
  padding: 15px;
}

.price-history {
  padding: 15px;
}

.history-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-weight: 600;
  color: #333;
}

.history-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  color: #666;
}
</style>
