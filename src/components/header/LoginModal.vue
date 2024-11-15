<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>로그인</h2>
        <button class="close-btn" @click="$emit('close')"></button>
      </div>

      <div class="login-options">
        <button class="login-btn ho-login">
          <i class="bi bi-house-door"></i>
          SIU 앱으로 로그인
        </button>

        <button class="login-btn kakao-login">
          <i class="bi bi-chat-fill"></i>
          카카오 계정으로 로그인
        </button>
      </div>

      <div class="other-login-text">다른 방법으로 로그인</div>

      <div class="social-login">
        <button class="social-btn facebook">
          <i class="bi bi-facebook"></i>
          <span>페이스북</span>
        </button>
        <button class="social-btn apple">
          <i class="bi bi-apple"></i>
          <span>애플</span>
        </button>
        <button class="social-btn phone">
          <i class="bi bi-phone"></i>
          <span>휴대전화</span>
        </button>
      </div>

      <div class="signup-link">
        아직 회원이 아니신가요?
        <a href="#" @click.prevent="handleSignup">회원 가입</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginModal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleSignup() {
      this.$router.push("/signup");
    },
  },
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
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  width: 400px;
  border-radius: 12px;
  padding: 24px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.login-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;
}

.ho-login {
  background: linear-gradient(to right, #1e40af, #1e3a8a);
  color: white;
}

.ho-login:hover {
  background: #3f43a3;
}

.kakao-login {
  background: #fee500;
  color: #000000;
}

.kakao-login:hover {
  background: #fdd835;
}

.other-login-text {
  text-align: center;
  color: #666;
  margin: 20px 0;
  position: relative;
}

.other-login-text::before,
.other-login-text::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: #eee;
}

.other-login-text::before {
  left: 0;
}

.other-login-text::after {
  right: 0;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 24px;
}

.social-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
}

.social-btn i {
  font-size: 24px;
  padding: 12px;
  border-radius: 50%;
  background: #f5f5f5;
  transition: all 0.2s ease;
}

.social-btn:hover i {
  background: #eee;
}

.social-btn span {
  font-size: 12px;
  color: #666;
}

.signup-link {
  text-align: center;
  color: #666;
}

.signup-link a {
  color: #4b50b8;
  text-decoration: none;
  font-weight: 500;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>
