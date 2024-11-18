<template>
  <nav class="navbar navbar-expand-lg fixed-top" data-bs-theme="dark">
    <div class="container-fluid">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="#D4AF37" stroke-width="2" fill="none"/>
        </svg>
        <span class="brand-text ms-2">
          <span class="home-text">Home</span><span class="seek-text">Seek</span>
        </span>
      </router-link>

      <!-- 로그인 아이콘 -->
      <div class="ms-4 login-icon" @click="showLoginModal = true">
        <i class="bi bi-person-circle"></i>
      </div>

      <!-- 검색창 -->
      <div class="search-box ms-auto">
        <input
          type="text"
          class="form-control form-control-sm search-input"
          placeholder="단어를 검색해보세요 (예: 임차인)"
        />
        <i class="bi bi-search search-icon"></i>
      </div>

      <!-- 로그인 모달 -->
      <LoginModal :show="showLoginModal" @close="showLoginModal = false" />
    </div>
  </nav>
</template>

<script>
import LoginModal from "./LoginModal.vue";

export default {
  name: "TheHeader",
  components: {
    LoginModal,
  },
  data() {
    return {
      showLoginModal: false,
      isLoggedIn: false,
    };
  },
  methods: {
    logout() {
      this.isLoggedIn = false;
      this.$store.commit("auth/setUser", null);
      localStorage.removeItem("user");
      this.$router.push("/");
    },
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
.btn-link {
  background: none;
  border: none;
  padding: 0;
  text-decoration: none;
  cursor: pointer;
}

.btn-link:hover {
  color: #ffffff;
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

.navbar {
  padding: 0.8rem 1rem;
  background-color: rgba(33, 37, 41, 0.95) !important;
}

.container-fluid {
  padding: 0 1.5rem;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-box input {
  padding: 10px 35px 10px 15px;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid #D4AF37;
  color: #D4AF37;
  height: 42px;
  font-size: 14px;
  font-weight: 500;
}

.search-box input::placeholder {
  color: rgba(212, 175, 55, 0.8);
  font-weight: 600;
}

.search-box input:focus {
  background: rgba(212, 175, 55, 0.15);
  border-color: #D4AF37;
  box-shadow: 0 0 0 0.2rem rgba(212, 175, 55, 0.25);
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #D4AF37;
  font-size: 16px;
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
</style>
