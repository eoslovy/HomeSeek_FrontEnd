<template>
  <nav class="navbar navbar-expand-lg fixed-top bg-dark" data-bs-theme="dark">
    <div class="container-fluid">
      <router-link class="navbar-brand fw-bold fs-2" to="/">
        홈식이
      </router-link>

      <!-- 로그인 아이콘 -->
      <div class="ms-4 login-icon" @click="showLoginModal = true">
        <i class="bi bi-person-circle"></i>
      </div>

      <!-- 검색창 -->
      <div class="search-box ms-auto">
        <input
          type="text"
          class="form-control form-control-sm"
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
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}

.login-icon:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.login-icon i {
  font-size: 24px;
}

.navbar {
  padding: 0.5rem 1rem;
  background: rgba(33, 37, 41, 0.95) !important;
}

.container-fluid {
  padding: 0 1.5rem;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-box input {
  padding: 8px 35px 8px 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  height: 38px;
  font-size: 14px;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-box input:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: none;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
}
</style>
