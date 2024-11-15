<template>
  <div class="news-view">
    <div class="news-header">
      <div class="header-content">
        <span class="back-icon" @click="$emit('close')">←</span>
        <span class="header-title">부동산 뉴스</span>
      </div>
    </div>
    <div class="news-content">
      <div class="news-list">
        <div v-for="(news, index) in newsList" :key="index" class="news-item">
          <div class="news-title">{{ news.title }}</div>
          <div class="news-info">
            <span class="news-source">{{ news.source }}</span>
            <span class="news-time">{{ news.time }}</span>
          </div>
          <div class="scrap-btn">스크랩</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewsView",
  data() {
    return {
      newsList: [
        {
          title:
            '"노도강 천지개벽 쌀줄만 알까" 1만 가구 미니신도시 만든다는 이 동네',
          source: "매일경제",
          time: "4시간 전",
        },
        {
          title:
            '"한 달 뒤면 서울까지 20분" 환호 직주인들 신난 동네 [집코노미-접접쪽쪽]',
          source: "한국경제",
          time: "5시간 전",
        },
        {
          title: '"돈 많아도 현남동 안산다" 김구라 신흥촌은 어디',
          source: "머니투데이",
          time: "6시간 전",
        },
        {
          title:
            '"신흥촌, 30평보다 10평이 더 좋다고.." OO 떠났야 돈 번다[부릿지]',
          source: "머니투데이",
          time: "7시간 전",
        },
      ],
    };
  },
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
  background: linear-gradient(
    to right,
    #60a5fa,
    #2563eb
  ); /* 밝고 경쾌한 느낌 */
  color: white;
  padding: 15px;
  height: 56px;
  display: flex;
  align-items: center;
  z-index: 1001;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.back-icon {
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
}

.news-content {
  height: calc(100vh - 126px);
  overflow-y: auto;
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

.scrap-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
}

.scrap-btn:hover {
  background: #e9ecef;
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
</style>
