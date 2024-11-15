<template>
    <div class="signup-container">
      <div class="signup-box">
        <h2 class="text-center mb-4">회원가입</h2>
        <form @submit.prevent="signup">
          <div class="mb-3">
            <label for="userId" class="form-label">아이디</label>
            <input
              type="text"
              class="form-control"
              id="userId"
              v-model="signupForm.userId"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">비밀번호</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="signupForm.password"
              required
            />
          </div>
          <div class="mb-3">
            <label for="passwordConfirm" class="form-label">비밀번호 확인</label>
            <input
              type="password"
              class="form-control"
              id="passwordConfirm"
              v-model="passwordConfirm"
              required
            />
          </div>
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-primary">회원가입</button>
            <router-link to="/login" class="btn btn-outline-secondary">
              로그인하기
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex'
  
  export default {
    name: 'SignupView',
    data() {
      return {
        signupForm: {
          userId: '',
          password: ''
        },
        passwordConfirm: ''
      }
    },
    methods: {
      ...mapActions('auth', ['signupUser']),
      async signup() {
        if (this.signupForm.password !== this.passwordConfirm) {
          alert('비밀번호가 일치하지 않습니다.')
          return
        }
        try {
          await this.signupUser(this.signupForm)
          this.$router.push('/login')
        } catch (error) {
          alert('회원가입에 실패했습니다.')
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .signup-container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
  }
  
  .signup-box {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
  </style>