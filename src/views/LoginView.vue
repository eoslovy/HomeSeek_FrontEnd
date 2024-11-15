<template>
    <div class="login-container">
      <div class="login-box">
        <h2 class="text-center mb-4">로그인</h2>
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="userId" class="form-label">아이디</label>
            <input
              type="text"
              class="form-control"
              id="userId"
              v-model="loginForm.userId"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">비밀번호</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="loginForm.password"
              required
            />
          </div>
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-primary">로그인</button>
            <router-link to="/signup" class="btn btn-outline-secondary">
              회원가입하기
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex'
  
  export default {
    name: 'LoginView',
    data() {
      return {
        loginForm: {
          userId: '',
          password: ''
        }
      }
    },
    methods: {
      ...mapActions('auth', ['loginUser']),
      async login() {
        try {
          await this.loginUser(this.loginForm)
          this.$router.push('/')
        } catch (error) {
          alert('로그인에 실패했습니다.')
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .login-container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
  }
  
  .login-box {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
  </style>