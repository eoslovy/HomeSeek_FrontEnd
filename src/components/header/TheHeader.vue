<template>
  <nav class="navbar navbar-expand-lg fixed-top" data-bs-theme="dark">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <!-- 왼쪽 영역: 로고와 로그인 아이콘 -->
      <div class="left-section d-flex align-items-center">
        <a class="navbar-brand d-flex align-items-center" href="/" @click.prevent="refreshPage">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="#D4AF37" stroke-width="2" fill="none"/>
          </svg>
          <span class="brand-text ms-2">
            <span class="home-text">Home</span><span class="seek-text">Seek</span>
          </span>
        </a>

        <div class="ms-4 login-icon" @click="showLoginModal = true">
          <i class="bi bi-person-circle"></i>
        </div>
      </div>

      <!-- 오른쪽 영역: 검색창 -->
      <div class="right-section">
        <button class="trend-button" @click="showTrendModal = true">
          <i class="bi bi-graph-up"></i>
          실시간 트렌드
        </button>
        <input
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="단어를 검색해보세요 (예: 임차인)"
          @keyup.enter="search"
        />
        <i class="bi bi-search search-icon" @click="search"></i>
        
        <Transition name="fade">
          <div class="search-results" v-if="searchResult && searchResult.length > 0">
            <div class="search-result-content">
              <p>{{ searchResult }}</p>
            </div>
          </div>
        </Transition>
      </div>

      <LoginModal :show="showLoginModal" @close="showLoginModal = false" />
      <TrendModal :show="showTrendModal" @close="showTrendModal = false" />
    </div>
  </nav>
</template>

<script>
import LoginModal from "./LoginModal.vue";
import TrendModal from "./TrendModal.vue";
import axios from 'axios';

export default {
  name: "TheHeader",
  components: {
    LoginModal,
    TrendModal,
  },
  data() {
    return {
      showLoginModal: false,
      showTrendModal: false,
      isLoggedIn: false,
      searchKeyword: '',
      searchResult: null,
    };
  },
  methods: {
    logout() {
      this.isLoggedIn = false;
      this.$store.commit("auth/setUser", null);
      localStorage.removeItem("user");
      this.$router.push("/");
    },
    async search() {
      if (!this.searchKeyword.trim()) return;
      
      try {
        const response = await axios.post('http://localhost:8080/openai/search', {
          keyword: this.searchKeyword
        });
        this.searchResult = response.data;
      } catch (error) {
        console.error('검색 중 오류가 발생했습니다:', error);
      }
    },
    refreshPage() {
      window.location.href = '/';  // 또는 window.location.reload();
    }
  },
  watch: {
    // searchKeyword 감시자 추가
    searchKeyword(newVal) {
      if (!newVal.trim()) {
        this.searchResult = null;
      }
    }
  },
  created() {
    const user = localStorage.getItem("user");
    if (user) {
      this.isLoggedIn = true;
      this.$store.commit("auth/setUser", JSON.parse(user));
    }
  },
};
</script>

<style scoped>
.navbar {
  padding: 0.8rem 1rem;
  background-color: black!important;
}

.container-fluid {
  padding: 0 1.5rem;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-text {
  font-size: 26px;
  font-weight: 600;
}

.home-text {
  color: #ffffff;
}

.seek-text {
  color: #D4AF37;
}

.navbar-brand svg {
  margin-top: -4px;
}

.login-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #D4AF37;
}

.login-icon:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.login-icon i {
  font-size: 28px;
}

.left-section {
  flex: 0 0 auto;
}

.right-section {
  position: relative;
  width: 500px;
  height: 42px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  width: 100%;
  height: 42px;
  line-height: 42px;
  background: black !important;
  border: 2px solid #D4AF37;
  border-radius: 4px;
  color: #D4AF37;
  padding: 0 40px 0 12px;
}

.search-input:focus {
  background: black !important;
  border-color: #D4AF37;
  border-radius: 4px 4px 0 0;
  outline: none;
}

.search-input::placeholder {
  color: #D4AF37;
  font-weight: 500;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #D4AF37;
  font-size: 20px;
  cursor: pointer;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: black;
  border: 2px solid #D4AF37;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.search-result-content {
  padding: 15px;
  color: #ffffff;
  font-size: 14px;
  line-height: 1.6;
}

.search-result-content p {
  margin: 0;
  white-space: pre-wrap;
}

/* 스크롤바 스타일링 */
.search-results::-webkit-scrollbar {
  width: 8px;
}

.search-results::-webkit-scrollbar-track {
  background: black;
}

.search-results::-webkit-scrollbar-thumb {
  background: #D4AF37;
  border-radius: 4px;
}

/* 페이드 효과 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.trend-button {
  height: 42px;
  padding: 0 15px;
  background: transparent;
  border: 2px solid #D4AF37;
  border-radius: 4px;
  color: #D4AF37;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.trend-button:hover {
  background: rgba(212, 175, 55, 0.1);
}

.trend-button i {
  font-size: 16px;
}
</style>