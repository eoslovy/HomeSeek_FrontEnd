<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isLogin ? "로그인" : "회원가입" }}</h2>
        <button class="close-btn" @click="$emit('close')"></button>
      </div>

      <div v-if="isLoggedIn" class="logged-in-content">
        <h4>{{ userId }}님 환영합니다</h4>
        <button @click="handleLogout" class="logout-btn">로그아웃</button>
      </div>

      <div v-else>
        <div v-if="isLogin" class="login-options">
          <form @submit.prevent="handleHoLogin">
            <input
              type="text"
              v-model="loginForm.userId"
              placeholder="아이디"
              required
            />
            <input
              type="password"
              v-model.trim="loginForm.pw"
              placeholder="비밀번호"
              required
            />
            <div class="auto-login-wrapper">
              <input
                type="checkbox"
                id="autoLogin"
                v-model="loginForm.autoLogin"
              />
              <label for="autoLogin">자동 로그인</label>
            </div>
            <button type="submit" class="login-btn ho-login">로그인</button>
          </form>
        </div>

        <div v-else class="signup-form">
          <form @submit.prevent="handleSignup">
            <div class="form-group">
              <input
                type="text"
                v-model.trim="signupForm.userId"
                placeholder="아이디"
                required
                @blur="checkDuplicateId"
              />
              <span
                class="validation-message"
                :class="{
                  error: !isIdAvailable,
                  success: isIdAvailable && signupForm.userId,
                }"
              >
                {{ idValidationMessage }}
              </span>
            </div>

            <div class="form-group">
              <input
                type="password"
                v-model="signupForm.pw"
                placeholder="비밀번호"
                required
                @input="validatePassword"
              />
              <span
                class="validation-message"
                :class="{ error: !isPasswordValid && signupForm.pw }"
              >
                {{ passwordValidationMessage }}
              </span>
            </div>

            <div class="form-group">
              <input
                type="password"
                v-model="signupForm.confirmPw"
                placeholder="비밀번호 확인"
                required
                @input="validatePasswordMatch"
              />
              <span
                class="validation-message"
                :class="{ error: !isPasswordMatch && signupForm.confirmPw }"
              >
                {{ passwordMatchMessage }}
              </span>
            </div>

            <div class="form-group">
              <input
                type="text"
                v-model.trim="signupForm.nickname"
                placeholder="닉네임"
                required
              />
            </div>

            <button type="submit" class="signup-btn" :disabled="!isFormValid">
              가입하기
            </button>
          </form>
        </div>

        <div class="toggle-form">
          {{ isLogin ? "아직 회원이 아니신가요?" : "이미 회원이신가요?" }}
          <a href="#" @click.prevent="toggleForm">
            {{ isLogin ? "회원가입" : "로그인" }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "LoginModal",
  data() {
    return {
      isLogin: true,
      loginForm: {
        userId: "",
        pw: "",
        autoLogin: false,
      },
      signupForm: {
        userId: "",
        pw: "",
        confirmPw: "",
        nickname: "",
      },
      isLoggedIn: false,
      userId: "",
      isIdAvailable: false,
      isPasswordValid: false,
      isPasswordMatch: false,
      idValidationMessage: "",
      passwordValidationMessage: "8~20자의 영문, 숫자, 특수문자를 포함해주세요",
      passwordMatchMessage: "",
    };
  },
  computed: {
    isFormValid() {
      return (
        this.isIdAvailable &&
        this.isPasswordValid &&
        this.isPasswordMatch &&
        this.signupForm.nickname.length > 0
      );
    },
  },
  created() {
    const user = localStorage.getItem('user');
    if (user && JSON.parse(user).autoLogin) {
      const userData = JSON.parse(user);
      this.isLoggedIn = true;
      this.userId = userData.nickname;
      this.$store.commit("auth/SET_LOGIN", userData);
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin;
      this.loginForm = { userId: "", pw: "", autoLogin: false };
      this.signupForm = { userId: "", pw: "", confirmPw: "", nickname: "" };
    },
    async handleHoLogin() {
      try {
        const loginData = {
          userId: this.loginForm.userId,
          pw: this.loginForm.pw,
          autoLogin: this.loginForm.autoLogin,
        };

        const response = await fetch("/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          const userData = {
            id: data.id,
            userId: data.userId,
            nickname: data.nickname,
            autoLogin: data.autoLogin,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
          
          if(userData.autoLogin){
            localStorage.setItem("user", JSON.stringify(userData));
          }
          this.isLoggedIn = true;
          this.userId = data.nickname;

          this.$store.commit("auth/SET_LOGIN", userData);
          this.$emit("close");
          this.$router.push("/");

          Swal.fire({
            icon: "success",
            title: "로그인 성공!",
            text: `${data.nickname}님 환영합니다`,
            showConfirmButton: false,
            timer: 1500,
            position: "top-end",
            toast: true,
          });
        } else {
          throw new Error(data.message || "로그인에 실패했습니다");
        }
      } catch (error) {
        console.error("로그인 에러:", error);
        Swal.fire({
          icon: "error",
          title: "로그인 실패",
          text: "아이디 또는 비밀번호를 확인해주세요",
          confirmButtonText: "확인",
          confirmButtonColor: "#dc3545",
        });
      }
    },

    async handleLogout() {
      try {
        const result = await Swal.fire({
          title: "로그아웃",
          text: "정말 로그아웃 하시겠습니까?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "로그아웃",
          cancelButtonText: "취소",
          confirmButtonColor: "#dc3545",
          cancelButtonColor: "#6c757d",
        });

        if (result.isConfirmed) {
          localStorage.removeItem("user");
          this.isLoggedIn = false;
          this.userId = "";
          this.$store.commit("auth/SET_LOGOUT");
          this.$emit("close");

          Swal.fire({
            icon: "success",
            title: "로그아웃 되었습니다",
            showConfirmButton: false,
            timer: 1500,
            position: "top-end",
            toast: true,
          });
        }
      } catch (error) {
        console.error("로그아웃 에러:", error);
        Swal.fire({
          icon: "error",
          title: "로그아웃 실패",
          text: "다시 시도해주세요",
          confirmButtonText: "확인",
          confirmButtonColor: "#dc3545",
        });
      }
    },

    async checkDuplicateId() {
      if (!this.signupForm.userId) {
        this.idValidationMessage = "아이디를 입력해주세요";
        this.isIdAvailable = false;
        return;
      }

      try {
        const response = await fetch(
          `/users/check-id/${this.signupForm.userId}`
        );
        const data = await response.json();

        if (response.ok) {
          this.isIdAvailable = data.available;
          this.idValidationMessage = data.available
            ? "사용 가능한 아이디입니다"
            : "이미 사용중인 아이디입니다";
        }
      } catch (error) {
        console.error("ID 중복 체크 에러:", error);
        this.idValidationMessage = "서버 오류가 발생했습니다";
        this.isIdAvailable = false;
      }
    },

    validatePassword() {
      const pwRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
      this.isPasswordValid = pwRegex.test(this.signupForm.pw);
      this.validatePasswordMatch();
    },

    validatePasswordMatch() {
      this.isPasswordMatch = this.signupForm.pw === this.signupForm.confirmPw;
      this.passwordMatchMessage = this.signupForm.confirmPw
        ? this.isPasswordMatch
          ? "비밀번호가 일치합니다"
          : "비밀번호가 일치하지 않습니다"
        : "";
    },

    async handleSignup() {
      try {
        const response = await fetch("/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: this.signupForm.userId,
            pw: this.signupForm.pw,
            nickname: this.signupForm.nickname,
          }),
        });

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "회원가입 성공!",
            text: "로그인해주세요.",
            showConfirmButton: false,
            timer: 1500,
          });
          this.isLogin = true;
        } else {
          const data = await response.json();
          throw new Error(data.message || "회원가입에 실패했습니다");
        }
      } catch (error) {
        console.error("회원가입 에러:", error);
        Swal.fire({
          icon: "error",
          title: "회원가입 실패",
          text: error.message || "다시 시도해주세요",
          confirmButtonText: "확인",
          confirmButtonColor: "#dc3545",
        });
      }
    },

    async checkAutoLogin(userId, accessToken, refreshToken) {
      try {
        const response = await fetch("/users/checkAutoLogin",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              userId: userId,
              accessToken: accessToken,
              refreshToken: refreshToken,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.isLoggedIn) {
            this.isLoggedIn = true;
            this.userId = data.userId;
            this.$store.commit("auth/SET_LOGIN", data);
          }
        }
      } catch (error) {
        console.error("자동 로그인 체크 실패:", error);
      }
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
  border-radius: 15px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: modalSlideDown 0.3s ease-out;
}

/* 모달 슬라이드 다운 애니메이션 */
@keyframes modalSlideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #0a362f;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.close-btn::before {
  content: "×";
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
  background: #0a362f;
  color: white;
}

.ho-login:hover {
  background: #0d4a40;
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

form {
  width: 100%;
}

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #000;
  background-color: white;
}

input:focus {
  outline: none;
  border-color: #1e40af;
}

.logged-in-content {
  text-align: center;
  padding: 20px;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
}

.logout-btn:hover {
  background: #c82333;
}

.form-group {
  margin-bottom: 15px;
}

.validation-message {
  display: block;
  font-size: 12px;
  margin-top: 5px;
}

.error {
  color: #dc3545;
}

.success {
  color: #28a745;
}

.toggle-form {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.toggle-form a {
  color: #4a90e2;
  text-decoration: none;
  margin-left: 5px;
}

.toggle-form a:hover {
  text-decoration: underline;
}

.signup-btn {
  width: 100%;
  padding: 12px;
  background: #0a362f;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.signup-btn:hover {
  background: #0d4a40;
}

.signup-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.auto-login-wrapper {
  display: flex;
  align-items: center;
  margin: 10px 0;
  background-color: white;
  padding: 8px;
  border-radius: 8px;
}

.auto-login-wrapper input[type="checkbox"] {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  background-color: transparent;
  vertical-align: middle;
}

.auto-login-wrapper label {
  color: #000;
  font-size: 14px;
  vertical-align: middle;
  line-height: 16px;
  margin-bottom: 0;
}
</style>
