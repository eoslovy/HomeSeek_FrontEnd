<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>시장 심리 지수</h3>
        <button class="close-button" @click="$emit('close')">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="modal-body">
        <div v-if="isLoading" class="loading-container">
          <div class="spinner"></div>
          <div class="loading-text">실시간 데이터를 불러오는 중입니다...</div>
        </div>
        <div v-else>
          <div class="sentiment-graph">
            <div class="graph-title" style="font-size: 24px;">{{ extractedDate }} 기준 전국 매매수급지수</div>
            <div class="progress-container">
              <div class="progress-bar">
                <div 
                  v-if="!isNaN(sellerPercent)" 
                  class="progress-section seller" 
                  :style="{ width: sellerPercent + '%' }"
                >
                  <span>매수자 많음 {{ sellerPercent }}%</span>
                </div>
                <div 
                  v-if="!isNaN(neutralPercent)" 
                  class="progress-section neutral" 
                  :style="{ width: neutralPercent + '%' }"
                >
                  보통 {{ neutralPercent }}%
                </div>
                <div 
                  v-if="!isNaN(buyerPercent)" 
                  class="progress-section buyer" 
                  :style="{ width: buyerPercent + '%' }"
                >
                  매도자 많음 {{ buyerPercent }}%
                </div>
              </div>
            </div>
          </div>
          <p v-html="formattedSentimentData"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SentimentModal',
  props: {
    show: Boolean,
    sentimentData: String
  },
  data() {
    return {
      isLoading: true
    }
  },
  watch: {
    sentimentData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.isLoading = false;
        }
      }
    },
    show: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.isLoading = true;
        }
      }
    }
  },
  computed: {
    extractedDate() {
      if (!this.sentimentData) return 'NaN';
      const match = this.sentimentData.match(/(\d{4}년\s*\d{1,2}월)/);
      return match ? match[1] : 'NaN';
    },
    buyerPercent() {
      if (!this.sentimentData) return NaN;
      const match = this.sentimentData.match(/매도자많음[^\d]*(\d+\.?\d*)/);
      return match ? parseFloat(match[1]) : NaN;
    },
    neutralPercent() {
      if (isNaN(this.buyerPercent) || isNaN(this.sellerPercent)) return NaN;
      const total = 100;
      const neutral = total - (this.buyerPercent + this.sellerPercent);
      return Math.round(neutral * 10) / 10;
    },
    sellerPercent() {
      if (!this.sentimentData) return NaN;
      const match = this.sentimentData.match(/매수자많음[^\d]*(\d+\.?\d*)/);
      return match ? parseFloat(match[1]) : NaN;
    },
    marketCondition() {
      return this.buyerPercent > this.sellerPercent ? '매도자에게' : '매수자에게';
    },
    formattedSentimentData() {
      if (!this.sentimentData) return '';
      
      let text = this.sentimentData;
      
      // 날짜 부분 강조
      text = text.replace(
        /(\d{4}년\s*\d{1,2}월\s*기준)/,
        '<span class="highlight">$1</span>'
      );
      
      // '매수자/매도자에게 유리한 시장' 강조
      text = text.replace(
        /(매수자에게\s*유리한\s*시장|매도자에게\s*유리한\s*시장)/g,
        '<span class="highlight">$1</span>'
      );
      
      return text;
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
  min-height: 200px;
  overflow-y: auto;
  max-height: calc(90vh - 70px);
  border-radius: 0 0 8px 8px;
  color: #333;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
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

.sentiment-graph {
  background: white;
  padding: 50px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  margin-bottom: 20px;
}

.graph-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 40px;
  color: #333;
}

.progress-container {
  width: 100%;
  padding: 30px 0;
}

.progress-bar {
  width: 100%;
  height: 80px;
  border-radius: 6px;
  display: flex;
  overflow: hidden;
  background: #f8f9fa;
  margin: 10px 0;
}

.progress-section {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 500;
  transition: width 0.3s ease;
  padding: 0 15px;
  white-space: nowrap;
}

.buyer {
  background: #2fb344;
}

.neutral {
  background: #dee2e6;
  color: #333;
}

.seller {
  background: #ff922b;
  min-width: 40px;
  position: relative;
  justify-content: flex-start;
  overflow: visible;
}

.seller span {
  position: absolute;
  white-space: nowrap;
  left: 15px;
  color: #333;
}

/* p 태그 스타일 수정 */
p {
  margin: 0;
  background: white;
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  font-size: 20px;  /* 폰트 크기 증가 */
  line-height: 1.6;
  color: #333;
}

/* p 태그가 마지막 요소일 때는 마진 제거 */
p:last-child {
  margin-bottom: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 25px;
  margin-top: 100px;
  margin-bottom: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0a362f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: #0a362f;
  font-size: 1.3rem;
  text-align: center;
  background: none;
  border: none;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

<style>
.highlight {
  color: #0a362f !important;
  font-weight: 700 !important;
}
</style> 