<template>
  <div class="news-view">
    <div class="news-header">
      <div class="header-content">
        <div class="left-section">
          <span class="back-icon" @click="$emit('close')">←</span>
          <span class="header-title">부동산 정책</span>
        </div>
        <button class="policy-button" @click="showPolicyModal = true">
          정부 정책
        </button>
      </div>
    </div>
    <div class="news-content">
      <div class="news-list">
        <div v-for="(news, index) in newsList" :key="index" class="news-item">
          <a :href="news.link" target="_blank" class="news-title">{{ news.title }}</a>
          <div class="news-description">{{ news.description }}</div>
          <div class="news-info">
            <span class="news-source">{{ news.source }}</span>
            <span class="news-time">{{ news.time }}</span>
          </div>
        </div>
      </div>
    </div>

    <PolicyModal 
      v-if="showPolicyModal" 
      :policies="policyData" 
      @close="showPolicyModal = false"
    />
  </div>
</template>


<script>
import axios from 'axios';
import PolicyModal from './PolicyModal.vue';

export default {
  name: "PolicyView",
  components: {
    PolicyModal
  },
  data() {
    return {
      newsList: [],
      isLoading: false,
      showPolicyModal: false,
      policyData: []
    };
  },
  methods: {
    async fetchNews() {
      try {
        this.isLoading = true;
        const response = await axios.get('http://localhost:8080/crawl/searchNewsRegulation');
        this.newsList = response.data;
      } catch (error) {
        console.error('뉴스 로딩 중 오류 발생:', error);
        this.newsList = [];
      } finally {
        this.isLoading = false;
      }
    },
    async fetchPolicyData() {
      try {
        const response = await axios.get('http://localhost:8080/api/policies');
        this.policyData = response.data.policies;
      } catch (error) {
        console.error('정책 데이터 로딩 중 오류:', error);
      }
    }
  },
  created() {
    this.fetchNews();
    this.fetchPolicyData();
  }
};
</script>

<style scoped>
.news-view {
  position: absolute;
  top: 70px;
  left: 0;
  width: 450px;
  height: calc(100vh - 70px);
  background: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.news-header {
  position: sticky;
  top: 0;
  background: #0a362f;
  color: white;
  padding: 15px;
  height: 56px;
  display: flex;
  align-items: center;
  z-index: 1001;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.back-icon {
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  color: rgba(255, 255, 255, 0.9);
  transition: color 0.2s ease;
}

.back-icon:hover {
  color: white;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.95);
}

.news-content {
  height: calc(100vh - 126px);
  overflow-y: auto;
  background: white;
}

.news-list {
  padding: 0;
}

.news-item {
  padding: 20px;
  border-bottom: 1px solid #eee;
  position: relative;
}

.news-title {
  font-size: 15px;
  line-height: 1.4;
  margin-bottom: 10px;
  color: #333;
  font-weight: 500;
  text-decoration: none;
  display: block;
  cursor: pointer;
}

.news-title:hover {
  text-decoration: underline;
  color: #0a362f;
}

.news-description {
  font-size: 13px;
  line-height: 1.5;
  margin: 8px 0;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-info {
  display: flex;
  gap: 8px;
  font-size: 13px;
}

.news-source {
  color: #666;
}

.news-time {
  color: #666;
}

/* 스크롤바 스타일링 */
.news-content::-webkit-scrollbar {
  width: 6px;
}

.news-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.news-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.news-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.policy-button {
  margin-left: auto;
  padding: 8px 16px;
  background-color: #4CAF50;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.policy-button:hover {
  background-color: #45a049;
}
</style>