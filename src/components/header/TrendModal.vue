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
        const response = await axios.post('/api/trend/search', {
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
  padding-top: 80px;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 1200px;
  border-radius: 8px;
  border: none;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: #0a362f;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  color: white;
  margin: 0;
  font-size: 1.2rem;
}

.close-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
}

.modal-body {
  background: #f8f9fa;
  padding: 30px;
  display: flex;
  gap: 30px;
  min-height: 600px;
  overflow-y: auto;
  max-height: calc(90vh - 70px);
  border-radius: 0;
}

.trend-item {
  display: flex;
  align-items: center;
  padding: 5px;
}

.checkbox-section {
  width: 300px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #dee2e6;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #333;
  white-space: nowrap;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #0a362f;
  border: 1px solid #dee2e6;
  border-radius: 3px;
  appearance: none;
  -webkit-appearance: none;
  background-color: white;
}

.checkbox-label input[type="checkbox"]:checked {
  background-color: #0a362f;
  border-color: #0a362f;
}

.checkbox-label input[type="checkbox"]:checked::after {
  content: '';
  display: block;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  position: relative;
  top: 1px;
  left: 5px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: center;
  background: white;
  border-radius: 0 0 8px 8px;
}

.search-button {
  background: #0a362f;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
  min-width: 120px;
}

.search-button:hover {
  background: #0d4339;
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
  background: #f1f1f1;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #0a362f;
  border-radius: 4px;
}

.chart-section {
  flex: 1;
  padding: 20px;
  min-width: 800px;
  background: white;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

/* 차트 관련 스타일 수정 */
:deep(.trend-chart) {
  background: white !important;
}

:deep(.trend-chart canvas) {
  background: white !important;
}

:deep(.chart-container) {
  background: white !important;
}

/* 차트의 모든 텍스트 요소 색상 변경 */
:deep(.echarts text) {
  fill: #333 !important;
}

:deep(.echarts .echarts-title) {
  color: #333 !important;
}

:deep(.echarts .echarts-label) {
  color: #333 !important;
}

:deep(.echarts-for-vue) {
  color: #333 !important;
}

/* 축 레이블과 타이틀 색상 변경 */
:deep(.echarts .axis-label),
:deep(.echarts .axis-title) {
  fill: #333 !important;
  color: #333 !important;
}

/* 범례 텍스트 색상 변경 */
:deep(.echarts .legend-text) {
  fill: #333 !important;
  color: #333 !important;
}

/* 차트 제목 색상 변경 */
:deep(.echarts .chart-title) {
  color: #333 !important;
}
</style> 