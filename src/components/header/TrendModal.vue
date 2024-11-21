<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>지역 선택 (최대 5개까지 가능)</h3>
        <button class="close-button" @click="$emit('close')">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="checkbox-section">
          <div class="checkbox-grid">
            <div class="trend-item" v-for="(item, index) in trendItems" :key="index">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  :value="item"
                  v-model="selectedDistricts"
                >
                <span class="trend-keyword">{{ item }}</span>
              </label>
            </div>
          </div>
        </div>
        <div v-if="chartData" class="chart-section">
          <TrendChart :results="chartData" />
        </div>
      </div>
      <div class="modal-footer">
        <button class="search-button" @click="searchTrends" :disabled="selectedDistricts.length === 0">
          검색하기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import TrendChart from '../TrendChart.vue';

export default {
  name: 'TrendModal',
  components: {
    TrendChart
  },
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      trendItems: [
        '강남구', '강동구', '강북구', '강서구', '관악구',
        '광진구', '구로구', '금천구', '노원구', '도봉구',
        '동대문구', '동작구', '마포구', '서대문구', '서초구',
        '성동구', '성북구', '송파구', '양천구', '영등포구',
        '용산구', '은평구', '종로구', '중구', '중랑구'
      ],
      selectedDistricts: [],
      chartData: null
    }
  },
  methods: {
    async searchTrends() {
      try {
        const response = await axios.post('http://localhost:8080/trend/search', {
          districts: this.selectedDistricts
        });
        
        if (response.data && response.data.results) {
          this.chartData = response.data.results;
        }
      } catch (error) {
        alert('검색 중 오류가 발생했습니다.');
      }
    }
  }
}
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
  z-index: 1000;
}

.modal-content {
  background: rgba(33, 37, 41, 0.95);
  width: 1200px;
  margin-top: 80px;
  border-radius: 8px;
  border: 1px solid #D4AF37;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #D4AF37;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  color: #D4AF37;
  margin: 0;
  font-size: 1.2rem;
}

.close-button {
  background: none;
  border: none;
  color: #D4AF37;
  cursor: pointer;
  font-size: 1.2rem;
}

.modal-body {
  padding: 30px;
  display: flex;
  gap: 30px;
  min-height: 600px;
  overflow-y: auto;
}

.trend-item {
  display: flex;
  align-items: center;
  padding: 5px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #ffffff;
  white-space: nowrap;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #D4AF37;
  display: flex;
  justify-content: center;
}

.search-button {
  background: #D4AF37;
  color: #212529;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
}

.search-button:hover {
  background: #c49f32;
}

.search-button:disabled {
  background: #666;
  cursor: not-allowed;
}

/* 스크롤바 스타일링 */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.modal-body::-webkit-scrollbar-thumb {
  background: #D4AF37;
  border-radius: 4px;
}

.checkbox-section {
  width: 300px;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 10px;
}

.chart-section {
  flex: 1;
  padding: 20px;
  min-width: 800px;
}
</style> 